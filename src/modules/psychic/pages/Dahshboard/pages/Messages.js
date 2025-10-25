import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useFormik } from 'formik';
import moment from 'moment';

import { SOCKET_CLIENT } from '../../../../../utils/socket';
import { ROLE, SWAL_SETTINGS } from '../../../../../utils/Constants';
import { getUser } from '../../../../../utils/commonfunction';
import { getChat } from '../../../services/chat.services';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';

export default function Messages() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [messages, setMessages] = useState([]);

    const SENDER = getUser(ROLE.PSYCHIC);
    const params = useParams();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const receiverID = searchParams.get("receiverID");
    const receiverDetails = location?.state?.receiver;
    const bookingDetails = location?.state?.bookingDetails;

    const chatWindow = useRef();

    // Formik for sending messages
    const messageForm = useFormik({
        initialValues: {
            message: "",
            senderId: SENDER._id,
            receiverId: receiverID,
            roomID: params.roomID,
            type: "text",
        },
        onSubmit: (values, { resetForm }) => {
            if (!values.message.trim()) return;
            SOCKET_CLIENT.emit("SEND-MESSAGE", values);
            resetForm();
        },
    });

    // Scroll to bottom
    const scrollToBottom = () => {
        if (chatWindow.current) {
            chatWindow.current.scrollTo({
                top: chatWindow.current.scrollHeight,
                behavior: "smooth",
            });
        }
    };

    // Join room on mount
    useEffect(() => {
        if (params?.roomID) {
            SOCKET_CLIENT.emit("JOIN-USER", { roomID: params?.roomID });
        }
    }, [params?.roomID]);

    // Get chat history
    useEffect(() => {
        const fetchMessages = async () => {
            if (!params?.roomID) return;
            const formData = new FormData();
            formData.append("roomID", params.roomID);

            try {
                const response = await getChat(formData);
                if (response?.data?.list) {
                    setMessages(response.data.list);
                    setTimeout(scrollToBottom, 100);
                }
            } catch (err) {
                console.error("Error fetching chat:", err);
            }
        };

        fetchMessages();
    }, [params.roomID]);

    // Handle new message from socket
    useEffect(() => {
        const handleNewMessage = (message) => {
            console.log("New message received:", message);
            console.log("params?.roomID--", params?.roomID);
            if (message?.roomID === params?.roomID) {
                setMessages((prev) => [...prev, message]);
            }
        };

        SOCKET_CLIENT.on("NEW-MESSAGE", handleNewMessage);

        return () => {
            SOCKET_CLIENT.off("NEW-MESSAGE", handleNewMessage);
        };
    }, []);

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Handle Enter key
    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            messageForm.handleSubmit();
        }
    };

    const ONE_HOUR_MS = 60 * 60 * 1000;

    const calculateRemainingSeconds = () => {
        const now = new Date();
        const bookingDate = new Date(bookingDetails?.date);
        const timePassed = now - bookingDate;
        const remaining = ONE_HOUR_MS - timePassed;
        return Math.max(0, Math.floor(remaining / 1000));
    };

    const [remainingSeconds, setRemainingSeconds] = useState(calculateRemainingSeconds());

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

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return [hours.toString().padStart(2, "0"), minutes.toString().padStart(2, "0"), seconds.toString().padStart(2, "0")].join(":");
    };

    return (
        <div className="chat-right-container">
            {/* Header */}
            <div className="chat-right-header d-flex gap-3 align-items-center justify-content-between">
                <div className="d-flex gap-3 align-items-center">
                    <figure className="avatar avatar-md m-0">
                        <img src={receiverDetails?.profile_image} alt="profile_image" />
                    </figure>
                    <div className="chat-right-header-info">
                        <h4 className="heading-18-semibold">{receiverDetails?.name}</h4>
                    </div>
                </div>
                <div className="fw-semibold pe-3">
                    <h4 className="m-0">{formatTime(remainingSeconds)}</h4>
                </div>
            </div>

            {/* Messages */}
            <div className="chat-right-body scroll" ref={chatWindow} tabIndex={1}>
                <ul>
                    {messages.map((msg, idx) => (
                        <li key={idx} className={msg.senderId === SENDER._id ? "my-msg" : "user-msg"}>
                            <div className="chat-msg">
                                <div className="chat-msg-text" style={{ wordBreak: "break-word" }}>
                                    <p>{msg.message}</p>
                                </div>
                                <time>{moment(msg.createdAt).format("hh:mm A")}</time>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Message Input */}
            {remainingSeconds > 0 ? (
                <form onSubmit={messageForm.handleSubmit}>
                    <div className="chat-right-footer d-flex gap-2 align-items-center">
                        <textarea
                            name="message"
                            className="w-100"
                            placeholder="Type your message here..."
                            value={messageForm.values.message}
                            onChange={messageForm.handleChange}
                            onBlur={messageForm.handleBlur}
                            onKeyDown={handleKeyPress}
                        />
                        <button type="submit" className="btn btn-primary btn-icon btn-icon-32" aria-label="Send" disabled={!messageForm.values.message.trim()}>
                            <i className="ti ti-send"></i>
                        </button>
                    </div>
                </form>
            ) : (
                <p className="text-danger chat-right-footer d-flex gap-2 align-items-center mb-2">{t("session_has_ended")}</p>
            )}
        </div>
    );
}



// import React, { useEffect, useRef, useState } from 'react'
// import userImg1 from "./../../../../../assets/website/images/user1.jpg"
// import { useLocation, useParams, useSearchParams } from 'react-router-dom';
// import { SOCKET_CLIENT } from '../../../../../utils/socket';
// import { ROLE } from '../../../../../utils/Constants';
// import { formateDate, getDate, getUser } from '../../../../../utils/commonfunction';
// import { useFormik } from 'formik';
// import { getChat } from '../../../services/chat.services';
// import moment from 'moment/moment';
// // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// // import { faPhone } from '@fortawesome/free-solid-svg-icons';
// // import { faVideo } from '@fortawesome/free-solid-svg-icons';
// // <div className='d-flex gap-3 m-3'>
// //                     <FontAwesomeIcon icon={faPhone} size='xl'  style={{ cursor: 'pointer' }} onClick={()=> startAudioCall()}/>
// //                     <FontAwesomeIcon icon={faVideo} size='xl'  style={{ cursor: 'pointer' }} onClick={()=> startVideoCall()}/>
// //                 </div>
// export default function Messages() {
//     const [messages, setMessages] = useState([]);
//     const [page, setPage] = useState(1);
//     const [messageSet, setMessageSet] = useState(false);
//     const [perPage, setPerPage] = useState(5);
//     const SENDER = getUser(ROLE.PSYCHIC);
//     const params = useParams();
//     const location = useLocation();
//     const [searchParams] = useSearchParams();
//     const receiverID = searchParams.get("receiverID");
//     const chatWindow = useRef();
//     const receiverDetails = location?.state?.receiver;

//     const messageForm = useFormik({
//         initialValues: {
//             message: "",
//             senderId: SENDER._id,
//             receiverId: receiverID,
//             roomID: params.roomID,
//             type: "text"
//         },
//         // validationSchema: validationSchema,
//         onSubmit: (values, { setSubmitting, resetForm }) => {
//             gotoBottom();
//             SOCKET_CLIENT.emit('SEND-MESSAGE', values);
//             messageForm.setFieldValue("message", "");
//         }
//     })

//     //agora states

//     useEffect(() => {
//         // Join the user’s room upon component mount
//         SOCKET_CLIENT.emit('JOIN-USER', { roomID: params.roomID });
//     }, [params]);

//     useEffect(() => {
//         SOCKET_CLIENT.on('NEW-MESSAGE', (message) => {
//             setMessages((prevMessages) => [...(prevMessages || []), message]);
//         });

//         return () => {
//             SOCKET_CLIENT.off('NEW-MESSAGE');
//         };
//     }, [messages]);

//     const handleKeyPress = (event) => {
//         if (event.key === 'Enter' && !event.shiftKey) {
//             event.preventDefault(); // prevent newline in textarea
//             messageForm.handleSubmit();
//         }
//     };
    

//     useEffect(() => {
//         if (params.roomID) {
//             const formData = new FormData();
//             formData.append("roomID", params.roomID);
//             // formData.append("page", page);
//             // formData.append("per_page", perPage);

//             getChat(formData).then((response) => {
//                 if (response?.data)
//                     setMessages((prevMsg) => [...response?.data?.list, ...prevMsg]);
//                 // setPage(response?.data?.page);
//                 // setPerPage(response?.data?.per_page);
//                 setMessageSet(true);
//                 setTimeout(() => {
//                     console.log("hi-->")
//                     gotoBottom();
//                 }, 100);
//             }).catch((error) => {
//                 console.error('Error fetching chat:', error);
//             });
//         }

//         return (() => {
//             setMessages([]);
//             setPage(1);
//         })
//     }, [params]);

//     useEffect(() => {
//         scrollToBottom();
//     }, [messages]);

//     console.log("messages-=-=-", messages)

//     function gotoBottom() {
//         if (chatWindow.current) {
//             const { scrollHeight } = chatWindow.current;
//             chatWindow.current.scrollTo({
//                 top: scrollHeight,
//                 behavior: 'smooth',
//             });
//         }
//     }

//     function scrollToBottom() {
//         if (chatWindow.current) {
//             const { scrollTop, scrollHeight, clientHeight } = chatWindow.current;

//             const isNearBottom = scrollHeight - scrollTop - clientHeight <= 250;

//             if (isNearBottom) {
//                 chatWindow.current.scrollTo({
//                     top: scrollHeight,
//                     behavior: 'smooth', // Optional: makes it scroll smoothly
//                 });
//             }
//         }
//     }

//     useEffect(() => {
//         // Add scroll event listener when component mounts
//         const handleScroll = () => {
//             if (chatWindow.current) {
//                 if (chatWindow.current.scrollTop === 0) {
//                     // If scroll is at the top, increment the page number
//                     setPage((prevPage) => prevPage + 1);
//                 }
//             }
//         };

//         if (chatWindow.current) {
//             chatWindow.current.addEventListener('scroll', handleScroll);
//         }

//         // Clean up the event listener when the component unmounts
//         return () => {
//             if (chatWindow.current) {
//                 chatWindow.current.removeEventListener('scroll', handleScroll);
//             }
//         };
//     }, []);

//     console.log("-=-=page number-=-=", page);
//     console.log("-=-=message -=-=", messages);
//     console.log("-=-=chatWindow -=-=", chatWindow?.current?.scrollHeight);

//     return (
//         <div className='chat-right-container '>
//             <div className='chat-right-header d-flex gap-3 align-items-center justify-content-between'>
//                 <div className='d-flex gap-3 align-items-center'>
//                     <figure className='avatar avatar-md m-0'>
//                         <img src={receiverDetails?.profile_image} alt='profile_image' />
//                     </figure>
//                     <div className='chat-right-header-info'>
//                         <h4 className='heading-18-semibold'>{receiverDetails?.name}</h4>
//                         {/* <p className='m-0'>Career</p> */}
//                     </div>
//                 </div>
//             </div>
//             <div className='chat-right-body scroll' tabIndex={1} ref={chatWindow}>
//                 <ul>
//                     {messages?.map((data, index) => (
//                         <li className={'' + (data?.senderId === SENDER._id ? 'my-msg' : 'user-msg')} key={index}>
//                             <div className='chat-msg'>
//                                 <div className='chat-msg-text'>
//                                     <p>{data?.message}</p>
//                                 </div>
//                                 <time>{moment(data?.createdAt).format('hh:mm A')}</time>
//                             </div>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//             {/* <div>
//                 {messages?.map((msg, index) => (
//                     <div key={index}>
//                         <p><strong>{msg.senderId}</strong>: {msg.message}</p>
//                     </div>
//                 ))}
//             </div> */}
//             <form onSubmit={messageForm.handleSubmit}>
//                 <div className='chat-right-footer d-flex gap-2 align-items-center'>
//                     <textarea
//                         placeholder='Type your message here...'
//                         className='w-100'
//                         name='message'
//                         value={messageForm?.values?.message}
//                         onChange={messageForm.handleChange}
//                         onBlur={messageForm.handleBlur}
//                         onKeyDown={handleKeyPress}
//                     ></textarea>
//                     <button aria-label="Send" type='submit' className='btn btn-primary btn-icon btn-icon-32'><i className='ti ti-send'></i></button>
//                 </div>
//             </form>
//         </div>
//     )
// }
