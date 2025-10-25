import React, { useCallback, useEffect, useMemo, useState } from "react";
import userImg1 from "./../../../assets/website/images/user1.jpg";
import { SOCKET_CLIENT } from "../../../utils/socket";
import { io } from "socket.io-client";
import { LOADER_TIMEOUT_TIME, SOCKET_EVENTS } from "../../../utils/Constants";
import { markNotificationRead, psychicNotificationList } from "../services/notification.services";
import RecordNotFound from "../../website/shared/RecordNotFound";
import { DT, formatDashString, getDate } from "../../../utils/commonfunction";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { markAsRead, setNotificationCounts } from "../../../redux/slices/notificationCount";

export default function NotificationPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [eventName, setEventName] = useState("GET-DATA");

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    // const notifyMe = useCallback((response) => {
    //   if (!("Notification" in window)) {
    //     alert("This browser does not support desktop notifications");
    //   } else if (Notification.permission === "granted") {
    //     const notification = new Notification("New notification", { body: response.message || "New booking created" });
    //     notification.onclick = function () {
    //       navigate(`/psychic/notification`);
    //     };
    //   } else if (Notification.permission !== "denied") {
    //     Notification.requestPermission().then((permission) => {
    //       if (permission === "granted") {
    //         const notification = new Notification("New notification", { body: response.message || "New booking created" });
    //         notification.onclick = function () {
    //           navigate(`/psychic/notification`);
    //         };
    //       }
    //     });
    //   }
    // }, [navigate]);

    useEffect(() => {
        SOCKET_CLIENT.on(eventName, (response) => {
            if (response.event === SOCKET_EVENTS.NEW_BOOKING) {
                // notifyMe(response);
                setNotifications((prevNotifications) => [response?.data, ...prevNotifications]);
            }
            return () => {
                SOCKET_CLIENT.off(eventName);
            };
        });
    }, []);

    // useMemo(() => {
    //   SOCKET_CLIENT.on(eventName, (response) => {
    //     console.log("88888", response);
    //     if (response.event === SOCKET_EVENTS.NEW_BOOKING) {
    //       console.log("Data received-==-=not-=-=", response.data);
    //     }
    //   });
    // }, []);

    // console.log("notifications-==-=-=", notifications)

    useEffect(() => {
        setLoading(true);
        psychicNotificationList()
            .then((response) => {
                const notificationData = response?.data
                setNotifications(response?.data?.list);
                dispatch(setNotificationCounts({ total: notificationData?.total_records, unread: notificationData?.unread_notification }));
                setTimeout(() => {
                    setLoading(false);
                }, LOADER_TIMEOUT_TIME);
            })
            .catch((error) => {
                console.log("Error===>", error);
                setTimeout(() => {
                    setLoading(false);
                }, LOADER_TIMEOUT_TIME);
            });
    }, []);

    const handleNavigation = (notification) => {
        console.log("=-=-notification=-", notification, notification.notification_type);
        switch (notification.notification_type) {
            case "booking":
                navigate(`/psychic/my-booking-view/${notification?.notification_type_id}`);
                break;
            case "cancel-booking":
                navigate(`/psychic/my-booking-view/${notification?.notification_type_id}`);
                break;
            case "session-reminder":
                navigate(`/psychic/my-booking-view/${notification?.notification_type_id}`);
                break;

            default:
                break;
        }
    };

    const getNotificatonText = (notification) => {
        const notficationType = formatDashString(notification?.type)
        switch (notification?.type) {
            case "new-booking":
                return DT(t("new_booking_notification_text"), { userName : notification?.client?.first_name, date : getDate(notification.date) });
                break;
            case "cancel-booking":
                return DT(t("cancel_booking_notification_text"), { userName : notification?.client?.first_name, date : getDate(notification.date) });
                break;
            case "session-reminder":
                return DT(t("session_reminder_notification_text"), { userName : notification?.client?.first_name, date : getDate(notification.date) });
                break;
            default:
                return DT(t("general_notification_text"), [notficationType])
                break;
        }
    };

    const handleMarkRead = (notification) => {
        if(notification._id){
            markNotificationRead({o_id: notification?._id})
            .then((response) => {
                // console.log("mark read")
                dispatch(markAsRead())
            })
            .catch((err) => {
                console.log("Erroe===>", err)
            })
        }
    }

    return (
        <div className="dashboard-wrapper py-5">
            <div className="container">
                <div className="dashboard-container">
                    <div className="dashboard-header">
                        <h2 className="heading-22-bold text-center">{t("label_notifications")}</h2>
                    </div>
                    <div className="dashboard-body" style={{ minHeight: "600px" }}>
                        <div className="notification-sec">
                            <div className="d-flex flex-column gap-3">
                                {notifications?.length > 0 ? (
                                    loading ? (
                                        [...Array(6)].map((_, index) => (
                                            <div key={index} className="notification-item d-flex gap-3 align-items-center">
                                                <figure className="mb-0">
                                                    <Skeleton circle width={24} height={24} />
                                                </figure>
                                                <figcaption className="flex-1">
                                                    <Skeleton width="400px" height={16} />
                                                </figcaption>
                                                <time className="ms-auto text-muted flex-shrink-0">
                                                    <Skeleton width="200px" height={14} />
                                                </time>
                                            </div>
                                        ))
                                    ) : (
                                        notifications?.map((notification, index) => (
                                            <div
                                                key={index}
                                                className={`notification-item d-flex gap-3 align-items-center ${notification?.read_by?.psychic === 0 && "active"}`}
                                                onClick={() => { handleNavigation(notification); handleMarkRead(notification) }}
                                            >
                                                <figure className="mb-0">
                                                    <i className="ti ti-bell"></i>
                                                </figure>
                                                <figcaption className="flex-1">
                                                    {/* <h4 className="heading-16-semibold">{`Request notification for ${formatDashString(notification?.type)}`}</h4> */}
                                                    <h4 className="heading-16-semibold">{getNotificatonText(notification)}</h4>
                                                </figcaption>
                                                <time className="ms-auto text-muted flex-shrink-0">{getDate(notification?.createdAt)}</time>
                                            </div>
                                        ))
                                    )
                                ) : (
                                    <RecordNotFound />
                                )}
                                {/* <div className='notification-item active d-flex gap-3 align-items-center'>
                  <figure className='mb-0'>
                    <i className='ti ti-bell'></i>
                  </figure>
                  <figcaption className='flex-1'>
                    <h4 className='heading-16-semibold'>New Booking Request</h4>
                  </figcaption>
                  <time className='ms-auto text-muted flex-shrink-0'>10 mins ago</time>
                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
