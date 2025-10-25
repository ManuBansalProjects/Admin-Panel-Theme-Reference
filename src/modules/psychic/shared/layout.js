import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setGlobalLoader } from "../../../redux/slices/globalLoader";
import Header from "./header";
import WebsiteFooter from "../../website/shared/footer";
import { getUser, setTitle } from "../../../utils/commonfunction";
import { addPsychicData } from "../../../redux/slices/psychicDetails";
import { psychicProfileDetails } from "../services/profile.services";
import { useSelector } from "react-redux";
import PsychicGlobalLoader from "./PsychicGlobalLoader";
import { SOCKET_CLIENT } from "../../../utils/socket";
import { ROLE, SOCKET_EVENTS } from "../../../utils/Constants";
// import IncomingCallNotification from "./IncomingCallNotification";
import { incrementUnread, setNotificationCounts } from "../../../redux/slices/notificationCount";
import { psychicNotificationCount } from "../services/notification.services";
import { useTranslation } from "react-i18next";

function PsychicLayout() {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const globalLoaderState = useSelector((state) => state.globalLoader);
    const navigate = useNavigate();
    window.navigate_ = navigate;

    useLayoutEffect(() => {
        Promise.all([import("../../../assets/website/css/style.css"), import("../../../assets/website/css/components.css"), import("../../../assets/website/css/responsive.css")]).then(() => {
            dispatch(setGlobalLoader(false));
        });
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const psychicDetails = await psychicProfileDetails();
                dispatch(addPsychicData(psychicDetails.data));
                setTitle(psychicDetails?.title ? psychicDetails?.title : "Reloaded Astrology");

                setTimeout(() => {
                    dispatch(setGlobalLoader(false));
                }, 100);
            } catch (error) {
                console.error("Error fetching psychic details:", error);
                dispatch(setGlobalLoader(false));
            }
        };

        fetchData();
    }, [dispatch]);

    useEffect(() => {
        psychicNotificationCount()
        .then((response) => {
            const { total_records, unread_notification } = response.data;
            console.log("Notification count ===> ", response?.data, unread_notification);
            dispatch(setNotificationCounts({ total: total_records, unread: unread_notification }));
        })
        .catch((error) => {
            console.log("Error ===> ", error);
        })
    })

    /** Joining user to socket for realtime notifications >>>>> */
    useMemo(() => {
        const user = getUser(ROLE.PSYCHIC);
        // console.log("user", user)
        if (user) {
            let joinRequest = {
                roomID: user._id,
            };
            SOCKET_CLIENT.on("connect", () => {
                SOCKET_CLIENT.emit("JOIN-USER", joinRequest, (error) => {
                    if (error) {
                        console.log("*****Socket connection error on JOIN-USER", error);
                    }
                    console.log("*****Socket connection on JOIN-USER", joinRequest);
                });
            });
            
        }
    }, []);

    const notifyMe = useCallback(
        (response) => {
            if (!("Notification" in window)) {
                alert("This browser does not support desktop notifications");
            } else if (Notification.permission === "granted") {
                // console.log("response of notification-->", response)
                const title = (typeof response?.title === "string") && (response?.title?.length > 0 ) ? response?.title : "New Notification";
                const notification = new Notification(title , { body: response.message || "New notification" });
                notification.onclick = function () {
                    navigate(`/psychic/notification`);
                };
            } else if (Notification.permission !== "denied") {
                Notification.requestPermission().then((permission) => {
                    if (permission === "granted") {
                        const notification = new Notification("New notification", { body: response.message || "New notification" });
                        notification.onclick = function () {
                            navigate(`/psychic/notification`);
                        };
                    }
                });
            }
        },
        [navigate]
    );

    useEffect(() => {
        SOCKET_CLIENT.on("GET-DATA", (response) => {
            console.log("response socket-->", response);
            if (response.event === SOCKET_EVENTS.NEW_BOOKING || response.event === SOCKET_EVENTS.CANCEL_BOOKING || response.event === SOCKET_EVENTS.SESSION_REMINDER) {
                notifyMe(response);
                dispatch(incrementUnread())
            }
            return () => {
                SOCKET_CLIENT.off("GET-DATA");
            };
        });
    }, [notifyMe]);

    /** Joining user to socket for realtime notifications <<<<< */
    // useMemo(() => {
    //   SOCKET_CLIENT.on('GET-DATA', (response) => {
    //     console.log("88888", response);
    //     if (response.event === SOCKET_EVENTS.NEW_BOOKING) {
    //       console.log("Data received", response.data);
    //     }
    //   });
    // }, []);

  return (
    <>
      {globalLoaderState ?
        <PsychicGlobalLoader/>
        :
        <div>
             {/* Skip Link */}
            <a href="#dashboard-right-container" className="skip-link">
                {t("skip_to_main_content")}
            </a>
          {/* <IncomingCallNotification/> */}
          <Header />
          <div className="inner-wraper">
            <Outlet />
          </div>
          <WebsiteFooter />
        </div>
      }
    </>
  );
}

export default PsychicLayout;
