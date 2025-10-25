// importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging.js');

// // Initialize the Firebase app in the service worker by passing the generated config
// const firebaseConfig = {
//     apiKey: "AIzaSyBZTZui8H6KuzvI73LOv6YN51J2fg10vXk",
//     authDomain: "reloaded-astrology.firebaseapp.com",
//     projectId: "reloaded-astrology",
//     storageBucket: "reloaded-astrology.firebasestorage.app",
//     messagingSenderId: "369831406673",
//     appId: "1:369831406673:web:f64b76c4ca4cf6d6fc9c70",
//     measurementId: "G-PYDPYKJCDC"
// };
// firebase.initializeApp(firebaseConfig);

// // Retrieve firebase messaging
// const messaging = firebase.messaging();
// messaging.onBackgroundMessage(function(payload) {
//     console.log("Receive background message--->",payload);
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//   };
//   self.registration.showNotification(notificationTitle,
//     notificationOptions);
// });

