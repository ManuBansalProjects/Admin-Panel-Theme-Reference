import io from 'socket.io-client';

const CONNECTION_CONFIG = {
	"force new connection": true,
	"reconnectionAttempts": "Infinity",
	"timeout": 10000,
	"transports": ["websocket"]
}

export const SOCKET_CLIENT = io.connect(process.env.REACT_APP_SOCKET_URL, CONNECTION_CONFIG);
// export const SOCKET_CLIENT = io(process.env.REACT_APP_SOCKET_URL, CONNECTION_CONFIG);

export const sendNotification = (notificationData)=>{
    SOCKET_CLIENT.emit('notificationSend', notificationData, (error) => {
        /** notificationData sample 
         * 
         {
            sender_id:user._id,
            receiver_id:"650be8fe10cda2e63513231c",
            title:"New message",
            message:"Hi",
            redirection:true,
            redirect_to:"/",
            type:NOTIFICATIONS_TYPES.UNREAD_CHAT_MESSAGE
            }
         */
        if (error) {
            console.log("*****Socket connection error on notificationSend", error);
        }
    })
}