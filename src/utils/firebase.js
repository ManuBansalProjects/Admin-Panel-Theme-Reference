// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken } from "firebase/messaging";

// const firebaseConfig = {
//     apiKey: "AIzaSyBZTZui8H6KuzvI73LOv6YN51J2fg10vXk",
//     authDomain: "reloaded-astrology.firebaseapp.com",
//     projectId: "reloaded-astrology",
//     storageBucket: "reloaded-astrology.firebasestorage.app",
//     messagingSenderId: "369831406673",
//     appId: "1:369831406673:web:f64b76c4ca4cf6d6fc9c70",
//     measurementId: "G-PYDPYKJCDC"
// };

// const app = initializeApp(firebaseConfig);

// const messaging = getMessaging(app);

// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('/firebase-messaging-sw.js')
//         .then(function(registration) {
//             console.log("Service Worker registered with scope:", registration.scope);
//             messaging.useServiceWorker(registration); // Associate the service worker with Firebase messaging
//         })
//         .catch(function(error) {
//             console.error("Service Worker registration failed:", error);
//         });
// }

// const vapidKey = process.env.REACT_APP_VAPID_KEY;

// export const requestFCMToken = async () => {
//     try {
//         const permission = await Notification.requestPermission();
        
//         if (permission === "granted") {
//             // Get FCM token
//             const token = await getToken(messaging, { vapidKey });
//             console.log("FCM Token ====> ", token);
//             return token;
//         } else {
//             console.log("User denied permission to notify.");
//             return null;
//         }
//     } catch (error) {
//         console.error("Error retrieving FCM token ====> ", error);
//         return null;
//     }
// };


