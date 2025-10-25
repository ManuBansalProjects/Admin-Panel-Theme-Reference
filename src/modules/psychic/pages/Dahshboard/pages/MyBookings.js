import React, { useEffect, useRef, useState } from 'react';
import cancelIcon from '../../../../../assets/website/images/icon-for-cancel.svg';
import { CancelBooking, MarkCompleteBooking, psychicBookingList } from '../../../services/booking.services';
import { capitalizeFirstLetter, getDate, handleServerValidations } from '../../../../../utils/commonfunction';
import PsychicPagination from '../../../shared/CommonPagination';
import { useTranslation } from 'react-i18next';
import { LOADER_TIMEOUT_TIME, SERVICES, STATUS_CLASS, SWAL_SETTINGS } from '../../../../../utils/Constants';
import Swal from 'sweetalert2';
import Skeleton from 'react-loading-skeleton';
import RecordNotFound from '../../../../website/shared/RecordNotFound';
import { getCmsPage } from '../../../services/common.services';
import moment from 'moment/moment';
import { useNavigate } from 'react-router-dom';

export default function MyBookings() {
  const modalCloseBtnRef = useRef()
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState([]);
  const [dataLength, setDataLength] = useState("");
  const [itemPerPage] = useState(7);
  const [page, setPage] = useState(1);
  const [viewBookingData, setViewBookingData] = useState({});
  const [cmsPage, setCmsPage] = useState({});
  const { t } = useTranslation();
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [validationError, setValidationError] = useState("");
  const [statsupdate, setStatusUpdate] = useState("false");
  const [loader, setLoader] = useState(false);
  const currentMoment = moment().seconds(0).milliseconds(0);
  const bookingDatePlusOneHour = moment(viewBookingData?.date).add(1, 'hours').seconds(0).milliseconds(0);

  useEffect(() => {
    setLoader(true);
    const formData = new FormData();
    formData.append("page", page);
    formData.append("per_page", itemPerPage);
    psychicBookingList(formData)
      .then((response) => {
        setDataLength(response?.data?.total_records)
        setPage(response && response.data && response.data.page ? response.data.page : 1);
        setBookingData(response?.data?.list);
        setTimeout(() => {
          setLoader(false);
        }, LOADER_TIMEOUT_TIME);
      })
      .catch((error) => {
        console.log('Error fetching booking data: ', error);
        setTimeout(() => {
          setLoader(false);
        }, LOADER_TIMEOUT_TIME);
      })
  }, [page, itemPerPage, statsupdate]);

  const cancelPolicy = () => {
    getCmsPage("psychic_booking_cancel_policy")
      .then((response) => {
        setCmsPage(response?.data[0])
      })
      .catch((err) => {
        console.log("Error fetching privacy policy: ", err);
      })
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

    if (selectedSlotId) {
      modalCloseBtnRef?.current?.click();
      const formData = new FormData();
      formData.append("o_id", selectedSlotId);
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
          console.log("deleteError");
        });
    }
  };

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

  console.log("=-=-data-=-", cancellationReason, selectedSlotId)
  console.log("=-=-validationError-=-", validationError)

  return (
    <div className='dashboard-right-container'>
      <div className='dashboard-header'>
        <div className='d-flex align-items-center  justify-content-between'>
          <h2 className='heading-22-bold'>{t("sidebar_my_bookings")}</h2>

          {/* <div class="card-head-group d-flex align-items-center gap-2">

            <div class="search-box">
              <input type="text" class="form-control search-input" placeholder="Search" />
            </div>

            <select class="form-control cp" name="payment_method_type">
              <option value="With Tax">With Tax</option>
              <option value="Without Tax">Without Tax</option>
            </select>
          </div> */}
        </div>
      </div>
      <div className='dashboard-body'>
        <div className='my-bookings-sec'>
          <div className="table-responsive" style={{ minHeight: "27rem" }}>
            {loader ?
              <table className="table table-striped">
                <thead>
                  <tr><td><Skeleton width="100%" height={30} /></td></tr>
                </thead>
                <tbody>
                  <tr><td><Skeleton width="100%" height={30} /></td></tr>
                  <tr><td><Skeleton width="100%" height={30} /></td></tr>
                  <tr><td><Skeleton width="100%" height={30} /></td> </tr>
                  <tr><td><Skeleton width="100%" height={30} /></td> </tr>
                  <tr><td><Skeleton width="100%" height={30} /></td> </tr>
                  <tr><td><Skeleton width="100%" height={30} /></td> </tr>
                  <tr><td><Skeleton width="100%" height={30} /></td> </tr>
                </tbody>
              </table>
              :
              bookingData?.length > 0 ?
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>{t("booking_id")}</th>
                      <th>{t("client_name")}</th>
                      <th>{t("date_and_time")}</th>
                      <th>{t("label_credit")}</th>
                      <th>{t("label_mode_of_consultation")}</th>
                      <th>{t("booking_status")}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingData?.map((booking) => (
                      <tr key={booking._id}>
                        <td>{booking?.generated_booking_id}</td>
                        <td>{booking?.client?.name}</td>
                        <td>{getDate(booking?.date, "YYYY-MM-DD", true, false, false)}</td>
                        <td>{booking?.credit}</td>
                        <td className='text-center'>{t(booking?.mode_of_consultation)}</td>
                        {/* <td>{SERVICES[booking?.service]}</td> */}
                        <td>
                          <span className={`badge ${STATUS_CLASS[booking?.booking_status] || "text-secondary"}`}>
                            {booking?.booking_status === "booked"
                              ? t("booked")
                              : t(booking?.booking_status)}
                          </span>
                        </td>

                        <td>
                          <div className='d-flex gap-1'>
                            {/* <button onClick={() => setViewBookingData(booking)} className='btn btn-primary' data-bs-toggle="modal" data-bs-target="#deatilsModal">{t("btn_view")}</button> */}
                            <button onClick={() => navigate(`/psychic/my-booking-view/${booking._id}`)} className='btn btn-primary'>{t("btn_view")}</button>
                            <button onClick={() => handleCancelBooking(booking)} disabled={booking?.booking_status !== "booked" || currentMoment > moment(booking?.date)} className='btn btn-border' data-bs-toggle="modal" data-bs-target="#modalCancel">{t("btn_cancel")}</button>
                          </div>
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </table>
                :
                <RecordNotFound />
            }
          </div>
          {!loader && bookingData?.length > 0 &&
            <PsychicPagination
              dataLength={dataLength}
              itemPerPage={itemPerPage}
              currentPage={page}
              setPage={setPage}
            />
          }
          {/* <nav aria-label="Page navigation example">
            <ul className="pagination">
              <li className="page-item">
                <a className="page-link" href="#" aria-label="Previous">
                  <span aria-hidden="true"><i className='ti ti-chevron-left'></i></span>
                </a>
              </li>
              <li className="page-item active"><a className="page-link" href="#">1</a></li>
              <li className="page-item"><a className="page-link" href="#">2</a></li>
              <li className="page-item"><a className="page-link" href="#">3</a></li>
              <li className="page-item">
                <a className="page-link" href="#" aria-label="Next">
                  <span aria-hidden="true"><i className='ti ti-chevron-right'></i></span>
                </a>
              </li>
            </ul>
          </nav> */}
        </div>
      </div>

      {/* cancel confirmation modal */}
      <div className="modal fade" id="modalCancel" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-body">
              <div className='cancel-modal-info text-center p-6 px-16 d-flex flex-column gap-4'>
                <figure className='mb-0'>
                  <img src={cancelIcon} alt="cancel" />
                </figure>
                <h4 className='heading-32-semibold'>{t("are_sure_cancel_booking")}</h4>
                <div className='cancel-modal-btn-group d-flex gap-2 justify-content-center'>
                  <button type='button' className='btn btn-border' data-bs-dismiss="modal" >{t("btn_no")}</button>
                  <button
                    type='button'
                    onClick={() => setCancellationReason("")}
                    className='btn btn-primary'
                    data-bs-dismiss="modal"
                    data-bs-toggle="modal"
                    data-bs-target="#modalCancelReason"
                  >{t("btn_yes")}</button>
                </div>
                <div className='btn-text cp' onClick={cancelPolicy} data-bs-toggle="modal" data-bs-target="#modalCancelPolicy">{t("cancellation_policy")}</div>
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
                <h1 className="heading-20-bold" id="exampleModalLabel">{t("Cancel booking")}</h1>
                <button ref={modalCloseBtnRef} type="button" className='close-btn-custom' data-bs-dismiss="modal" aria-label="Close">
                  <i className='ti ti-xbox-x' aria-hidden="true"></i>
                </button>
              </div>
              <div className='cancel-modal-info text-center p-6 px-16 d-flex flex-column gap-4'>
                <figure className='mb-0'>
                  <img src={cancelIcon} alt="cancel" />
                </figure>
                {/* <h4 className='heading-32-semibold'>{t("are_sure_cancel_booking hiiiiiiii")}</h4> */}
                <div className=''>
                  <label htmlFor="cancellation_reason" className='form-label'>{t("label_cancellation_reason")}</label>
                  <input
                    className='form-control'
                    type='text'
                    name='cancellation_reason'
                    id='cancellation_reason'
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
                  {validationError && (
                    <div className="validation-error text-danger">
                      {validationError}
                    </div>
                  )}
                </div>
                <div className='cancel-modal-btn-group d-flex gap-2 justify-content-center'>
                  <button type='button' onClick={handleCancellationClick} className='btn btn-primary'>{t("btn_submit")}</button>
                  <button type='button' className='btn btn-border' data-bs-dismiss="modal" >{t("btn_cancel")}</button>
                </div>
                <div className='btn-text cp' onClick={cancelPolicy} data-bs-toggle="modal" data-bs-target="#modalCancelPolicy">{t("cancellation_policy")}</div>
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
              <div className='cancel-modal-info text-center p-6 px-16 d-flex flex-column gap-4'>
                <h4 className='heading-32-semibold'>{cmsPage?.title}</h4>
                <div dangerouslySetInnerHTML={{ __html: cmsPage?.description }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* view booking details modal */}
      <div className="modal fade" id="deatilsModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between align-items-center">
              <h1 className="heading-20-bold" id="exampleModalLabel">{t("label_details")}</h1>
              <button type="button" className='close-btn-custom' data-bs-dismiss="modal" aria-label="Close">
                <i className='ti ti-xbox-x'></i>
              </button>
            </div>
            <div className="modal-body">
              <div className='list-group list-group-flush'>
                <div className='px-0 py-3 list-group-item d-flex justify-content-between align-items-center'>
                  <h3 className='heading-18'>{t("booking_id")}</h3>
                  <p className='heading-18-semibold'>{viewBookingData?.generated_booking_id}</p>
                </div>
                <div className='px-0 py-3 list-group-item d-flex justify-content-between align-items-center'>
                  <h3 className='heading-18'>{t("client_name_id")}</h3>
                  <p className='heading-18-semibold'>{viewBookingData?.client?.name}</p>
                </div>
                <div className='px-0 py-3 list-group-item d-flex justify-content-between align-items-center'>
                  <h3 className='heading-18'>{t("date_and_time")}</h3>
                  <p className='heading-18-semibold'>{getDate(viewBookingData?.date)}</p>
                </div>
                <div className='px-0 py-3 list-group-item d-flex justify-content-between align-items-center'>
                  <h3 className='heading-18'>{t("label_credit")} </h3>
                  <p className='heading-18-semibold'>{viewBookingData?.credit}</p>
                </div>
                <div className='px-0 py-3 list-group-item d-flex justify-content-between align-items-center'>
                  <h3 className='heading-18'>{t("label_mode_of_consultation")} </h3>
                  <p className='heading-18-semibold'>{viewBookingData?.mode_of_consultation}</p>
                </div>
                <div className='px-0 py-3 list-group-item d-flex justify-content-between align-items-center'>
                  <h3 className='heading-18'>{t("booking_status")}</h3>
                  <p className={`heading-18-semibold ${viewBookingData?.booking_status === "booked" ? "text-success" : "text-danger"}`}>
                    {viewBookingData?.booking_status === "booked" ? t("booked") : t(viewBookingData?.booking_status)}
                  </p>
                </div>
                {/* <div className='px-0 py-3 list-group-item d-flex justify-content-between align-items-center'>
                  <h3 className='heading-18'>{t("label_purpose")}</h3>
                  <p className='heading-18-semibold'>{SERVICES[viewBookingData?.service]}</p>
                </div> */}
                <div className='px-0 py-3 list-group-item '>
                  <h3 className='heading-18 mb-2'>{t("label_purpose")}</h3>
                  <p className='heading-18-semibold'>{viewBookingData?.purpose}</p>
                </div>
              </div>
            </div>
            <div className="modal-footer justify-content-start">
              {viewBookingData?.booking_status === "booked" &&
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleCancelBooking(viewBookingData)}
                  disabled={viewBookingData?.booking_status !== "booked"}
                  data-bs-dismiss="modal"
                  data-bs-toggle="modal"
                  data-bs-target="#modalCancel">
                  {t("btn_cancel_booking")}
                </button>
              }
              {currentMoment >= bookingDatePlusOneHour &&
                viewBookingData?.booking_status === "booked" &&
                <button className='btn btn-primary' onClick={() => handleMarkCompletedBooking(viewBookingData._id)} data-bs-dismiss="modal" aria-label="Close">
                  {t("btn_mark_completed")}
                </button>
              }
            </div>
          </div>
        </div>
      </div>

    </div>

  )
}
