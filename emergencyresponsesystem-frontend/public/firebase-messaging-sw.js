/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnB3xyBG6pJgq50bVJtluzq2ymrFb_5BY",
  authDomain: "smart-hospital-system-71358.firebaseapp.com",
  projectId: "smart-hospital-system-71358",
  storageBucket: "smart-hospital-system-71358.firebasestorage.app",
  messagingSenderId: "863639549189",
  appId: "1:863639549189:web:40a644ee0257f2d517b36c"
};

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/vite.svg",
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});