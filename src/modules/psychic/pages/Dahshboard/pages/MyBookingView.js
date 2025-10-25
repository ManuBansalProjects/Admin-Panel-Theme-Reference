import React, { useEffect, useRef, useState } from "react";
import VideoCamera from "../../../../../assets/website/images/VideoCamera.svg";
import ChatCenteredDots from "../../../../../assets/website/images/ChatCenteredDots.svg";
import { useTranslation } from "react-i18next";
import { CancelBooking, MarkCompleteBooking, psychicBookingDetails } from "../../../services/booking.services";
import { useNavigate, useParams } from "react-router-dom";
import { capitalizeFirstLetter, getDate, getUser, handleServerValidations } from "../../../../../utils/commonfunction";
import cancelIcon from "../../../../../assets/website/images/icon-for-cancel.svg";
import { getCmsPage } from "../../../services/common.services";
import moment from "moment";
import Swal from "sweetalert2";
import { ONE_HOUR_SECONDS, ROLE, SWAL_SETTINGS } from "../../../../../utils/Constants";
import { getRoomId, notifyForMeeting } from "../../../services/chat.services";
import { useDispatch } from "react-redux";
import { setMeetingDetails } from "../../../../../redux/slices/meetingDetailsSlice";
import { SOCKET_CLIENT } from "../../../../../utils/socket";

export default function MyBookingView() {
    const { t } = useTranslation();
    const params = useParams();
    const dispatch = useDispatch();
    const [bookingDetails, setBookingDetails] = useState({});
    const [selectedSlotId, setSelectedSlotId] = useState(null);
    const [cancellationReason, setCancellationReason] = useState("");
    const [validationError, setValidationError] = useState("");
    const [cmsPage, setCmsPage] = useState({});
    const modalCloseBtnRef = useRef();
    const navigate = useNavigate();
    const [bookingData, setBookingData] = useState([]);
    const [dataLength, setDataLength] = useState("");
    const [itemPerPage] = useState(7);
    const [page, setPage] = useState(1);
    const [statsupdate, setStatusUpdate] = useState("false");
    const [loader, setLoader] = useState(false);
    const [remainingSeconds, setRemainingSeconds] = useState(1);
    const currentMoment = moment().seconds(0).milliseconds(0);
    const bookingDatePlusOneHour = moment(bookingDetails?.date).add(1, "hours").seconds(0).milliseconds(0);
    const SENDER = getUser(ROLE.PSYCHIC);

    useEffect(() => {
        psychicBookingDetails(params.id)
            .then((response) => {
                setBookingDetails(response?.data);
                setRemainingSeconds(calculateRemainingSeconds(response?.data?.date));
            })
            .catch((err) => {
                console.log("Error===>", err);
            });
    }, [statsupdate]);

    const cancelPolicy = () => {
        getCmsPage("psychic_booking_cancel_policy")
            .then((response) => {
                setCmsPage(response?.data[0]);
            })
            .catch((err) => {
                console.log("Error fetching privacy policy: ", err);
            });
    };

    const handleCancelBooking = (bookedSlot) => {
        setSelectedSlotId(bookedSlot._id);
    };

    const handleCancellationClick = async () => {
        if (!cancellationReason) {
            setValidationError(t("err_cancellation_reason_required"));
            return;
        }
        if (validationError !== "") return;

        if (params?.id) {
            modalCloseBtnRef?.current?.click();
            const formData = new FormData();
            formData.append("o_id", params?.id);
            formData.append("cancellation_reason", cancellationReason);
            CancelBooking(formData)
                .then((response) => {
                    setStatusUpdate(!statsupdate);
                    if (response.success) {
                        Swal.fire({
                            icon: "success",
                            text: response.message,
                            ...SWAL_SETTINGS,
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            text: handleServerValidations(response),
                            ...SWAL_SETTINGS,
                        });
                    }
                })
                .catch((error) => {
                    console.log("deleteError===>", error);
                });
        }
    };

    const handleNotification = () => {
        const formData = new FormData();
        formData.append("client_id", bookingDetails?.client?._id);
        formData.append("date", bookingDetails?.date);
        formData.append("booking_id", bookingDetails?._id);
        formData.append("mode_of_consultation", bookingDetails?.mode_of_consultation);
        notifyForMeeting(formData)
            .then((response) => {
                console.log("Notification response: ", response);
            })
            .catch((error) => {
                console.error("Error sending notification: ", error);
            });
    };

    function onUserClick(bookingDetails) {
        // if (bookingDetails.chatDetails && bookingDetails.chatDetails._id) {
        //     navigate(`/psychic/chat/${bookingDetails.chatDetails._id}?receiverID=${bookingDetails?.client?._id}`, { state: { receiver: bookingDetails?.client } });
        // } else {
        //     getRoomId({ receiverId: bookingDetails?.client?._id, senderId: SENDER._id }).then((response) => {
        //         console.log("=-=chatId=->", response);
        //         navigate(`/psychic/chat/${response.data._id}?receiverID=${bookingDetails?.client?._id}`, { state: { receiver: bookingDetails?.client } });
        //     });
        // }
        // SOCKET_CLIENT.emit('SEND-MESSAGE', values);
        // handleNotification();
        remainingSeconds > 0 && handleNotification();
        if (bookingDetails) {
            navigate(`/psychic/chat/${bookingDetails._id}?receiverID=${bookingDetails?.client?._id}`, { state: { receiver: bookingDetails?.client, bookingDetails } });
        }
    }

    const handleMarkCompletedBooking = async (id) => {
        MarkCompleteBooking(id)
            .then((response) => {
                setStatusUpdate(!statsupdate);
                if (response.success) {
                    Swal.fire({
                        icon: "success",
                        text: response.message,
                        ...SWAL_SETTINGS,
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        text: handleServerValidations(response),
                        ...SWAL_SETTINGS,
                    });
                }
            })
            .catch((error) => {
                console.log("deleteError");
            });
    };
    
    const ONE_HOUR_MS = 60 * 60 * 1000;

    const calculateRemainingSeconds = (date) => {
        const now = new Date();
        const bookingDate = new Date(date);
        const timePassed = now - bookingDate;
        const remaining = ONE_HOUR_MS - timePassed;
        return Math.max(0, Math.floor(remaining / 1000));
    };

    useEffect(() => {
        if (remainingSeconds <= 0) {
            // Swal.fire({
            //     icon: "error",
            //     text: t("session_has_ended"),
            //     ...SWAL_SETTINGS,
            // });
            // navigate(-1);
            return;
        }

        const interval = setInterval(() => {
            setRemainingSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [remainingSeconds]);

    console.log("Remaining Seconds---: ", remainingSeconds);

    const handleStartMeeting = async (meeting_type) => {
        // const psychic = JSON.parse(localStorage.getItem('psychic'));
        // const data = {
        //     call_type : 'outgoing',
        //     call_info : {
        //         uid : Math.floor(Math.random() * 10000), // random uid
        //         // channel : `${psychic._id}-${bookingDetails?.client?._id}`,
        //         channel : `${psychic._id}-68428ffb442de4d5d8d78c96`, //psychic is vibhiuti always, customer is tiwari, for local
        //         // channel : `${psychic._id}-67d82432a46ec2d6fd4fdb67`, //, for staging
        //         // reciever_id : bookingDetails?.client?._id,
        //         reciever_id : '68428ffb442de4d5d8d78c96', //for local
        //         // reciever_id : '67d82432a46ec2d6fd4fdb67', //for staging
        //         reciever_name : bookingDetails?.client?.name,
        //         reciever_profile_image : bookingDetails?.client?.profile_image,
        //         sender_id : psychic._id,
        //         sender_name : psychic.name,
        //         sender_profile_image : psychic.profile_image,
        //         meeting_type
        //     }
        // }
        // dispatch(setMeetingDetails(data));
        handleNotification();
        navigate(`/psychic/meeting?meeting_id=${bookingDetails.meeting_id}`);
    };

    return (
        <>
            <div className="booking-page">
                <div className="booking-container">
                    <div className="header">
                        <h2 className="heading">{t("label_booking_details")}</h2>
                        <button className="btn btn-border" onClick={() => navigate(-1)}>
                            <span>{t("btn_back")}</span> <span>↩️</span>
                        </button>
                    </div>
                    <div className="booking-box">
                        <div className="detail-row">
                            <span className="label">{t("booking_id")}</span>
                            <span className="value">{bookingDetails?.generated_booking_id}</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">{t("client_name_id")}</span>
                            <span className="value">{capitalizeFirstLetter(bookingDetails?.client?.name)}</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">{t("date_and_time")}</span>
                            <span className="value">{getDate(bookingDetails?.date, "YYYY-MM-DD", true, false, false)}</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">{t("label_credit")}</span>
                            <span className="value">{bookingDetails?.credit}</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">{t("label_amount")}</span>
                            <span className="value">{`€ ${Number(bookingDetails?.amount).toFixed(2)}`}</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">{t("label_mode_of_consultation")}</span>
                            <span className="value">{t(bookingDetails?.mode_of_consultation)}</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">{t("booking_status")}</span>
                            <span className={`value paid ${bookingDetails?.booking_status === "booked" ? "text-success" : "text-danger"}`}>
                                {bookingDetails?.booking_status === "booked" ? t("booked") : t(bookingDetails?.booking_status)}
                            </span>
                        </div>
                        <div className="px-0 py-3 list-group-item ">
                            <h3 className="heading-18 mb-2">{t("label_purpose")}</h3>
                            <p className="heading-18-semibold">{bookingDetails?.purpose}</p>
                        </div>

                        {remainingSeconds < ONE_HOUR_SECONDS && bookingDetails?.booking_status !== "cancelled" && (
                            <div className="action-row">
                                {bookingDetails?.mode_of_consultation === "chat" && (
                                    <button className="btn-1 outline" onClick={() => onUserClick(bookingDetails)}>
                                        <a href="javascript:void(0)">
                                            <img src={ChatCenteredDots} alt="chat-icon" />
                                        </a>{" "}
                                        {remainingSeconds > 0 ? t("start_chat_meet") : t("view_past_chat_meet")}
                                    </button>
                                )}

                                {bookingDetails?.mode_of_consultation === "audio" && remainingSeconds > 0 && (
                                    <button onClick={() => handleStartMeeting("audio")} className="btn-1 outline">
                                        <a href="javascript:void(0)">
                                            <img src={VideoCamera} alt="audio-icon" />
                                        </a>{" "}
                                        {t("start_audio_meet")}
                                    </button>
                                )}

                                {bookingDetails?.mode_of_consultation === "video" && remainingSeconds > 0 && (
                                    <button onClick={() => handleStartMeeting("video")} className="btn-1 outline">
                                        <a href="javascript:void(0)">
                                            <img src={VideoCamera} alt="video-icon" />
                                        </a>{" "}
                                        {t("start_video_meet")}
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="action-row">
                            {currentMoment >= bookingDatePlusOneHour && bookingDetails?.booking_status === "booked" && (
                                <button className="btn-2 complete" onClick={() => handleMarkCompletedBooking(params.id)}>
                                    {t("btn_mark_completed")}
                                </button>
                            )}
                            {bookingDetails?.booking_status === "booked" && currentMoment < moment(bookingDetails?.date) && (
                                <button
                                    type="button"
                                    className="btn-4 cancel"
                                    onClick={() => handleCancelBooking(bookingDetails)}
                                    disabled={bookingDetails?.booking_status !== "booked"}
                                    data-bs-dismiss="modal"
                                    data-bs-toggle="modal"
                                    data-bs-target="#modalCancel"
                                >
                                    {t("btn_cancel_booking")}
                                </button>
                            )}
                        </div>

                        {/* <button onClick={() => handleStartMeeting("video")} className="btn-1 outline">
                            <a href="javascript:void(0)">
                                <img src={VideoCamera} alt="video-icon" />
                            </a>{" "}
                            {t("start_video_meet")}
                        </button> */}
                    </div>
                </div>
            </div>

            
            
            {/* cancel confirmation modal */}
            <div className="modal fade" id="modalCancel" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="cancel-modal-info text-center p-6 px-16 d-flex flex-column gap-4">
                                <figure className="mb-0">
                                    <img src={cancelIcon} alt="cancel" />
                                </figure>
                                <h4 className="heading-32-semibold">{t("are_sure_cancel_booking")}</h4>
                                <div className="cancel-modal-btn-group d-flex gap-2 justify-content-center">
                                    <button type="button" className="btn btn-border" data-bs-dismiss="modal">
                                        {t("btn_no")}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCancellationReason("")}
                                        className="btn btn-primary"
                                        data-bs-dismiss="modal"
                                        data-bs-toggle="modal"
                                        data-bs-target="#modalCancelReason"
                                    >
                                        {t("btn_yes")}
                                    </button>
                                </div>
                                <div className="btn-text cp" onClick={cancelPolicy} data-bs-toggle="modal" data-bs-target="#modalCancelPolicy">
                                    {t("cancellation_policy")}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* cancel reason input modal */}
            <div className="modal fade" id="modalCancelReason" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="modal-header d-flex justify-content-between align-items-center">
                                <h1 className="heading-20-bold" id="exampleModalLabel">
                                    {t("Cancel booking")}
                                </h1>
                                <button ref={modalCloseBtnRef} type="button" className="close-btn-custom" data-bs-dismiss="modal" aria-label="Close">
                                    <i className="ti ti-xbox-x" aria-hidden="true"></i>
                                </button>
                            </div>
                            <div className="cancel-modal-info text-center p-6 px-16 d-flex flex-column gap-4">
                                <figure className="mb-0">
                                    <img src={cancelIcon} alt="cancel" />
                                </figure>
                                <div className="">
                                    <label htmlFor="cancellation_reason" className="form-label">
                                        {t("label_cancellation_reason")}
                                    </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="cancellation_reason"
                                        id="cancellation_reason"
                                        value={cancellationReason}
                                        placeholder={t("placeholder_cancel_reason")}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setCancellationReason(value);

                                            const trimmedValue = value.trim();
                                            if (trimmedValue.length === 0) {
                                                setValidationError(t("cancellation_reason_is_required"));
                                            } else if (trimmedValue.length > 200) {
                                                setValidationError(t("cancellation_reason_characters_limit_200"));
                                            } else if (!/[a-zA-Z]/.test(trimmedValue)) {
                                                setValidationError(t("cancellation_reason_include_at_least_one_letter"));
                                            } else {
                                                setValidationError("");
                                            }
                                        }}
                                    />
                                    {validationError && <div className="validation-error text-danger">{validationError}</div>}
                                </div>
                                <div className="cancel-modal-btn-group d-flex gap-2 justify-content-center">
                                    <button type="button" onClick={handleCancellationClick} className="btn btn-primary">
                                        {t("btn_submit")}
                                    </button>
                                    <button type="button" className="btn btn-border" data-bs-dismiss="modal">
                                        {t("btn_cancel")}
                                    </button>
                                </div>
                                <div className="btn-text cp" onClick={cancelPolicy} data-bs-toggle="modal" data-bs-target="#modalCancelPolicy">
                                    {t("cancellation_policy")}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* cancel policy modal  */}
            <div className="modal fade" id="modalCancelPolicy" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="cancel-modal-info text-center p-6 px-16 d-flex flex-column gap-4">
                                <h4 className="heading-32-semibold">{cmsPage?.title}</h4>
                                <div dangerouslySetInnerHTML={{ __html: cmsPage?.description }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
