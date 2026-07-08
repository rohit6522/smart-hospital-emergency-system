import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnB3xyBG6pJgq50bVJtluzq2ymrFb_5BY",
  authDomain: "smart-hospital-system-71358.firebaseapp.com",
  projectId: "smart-hospital-system-71358",
  storageBucket: "smart-hospital-system-71358.firebasestorage.app",
  messagingSenderId: "863639549189",
  appId: "1:863639549189:web:40a644ee0257f2d517b36c"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "BFqYznV60mbOBvfIA3M-ZUe53gui083-JMZjc49cxed-6jnJtL8TNEQuuwy0b1PH5xF_PngDgmhNEiOhJzTbhRA",
      });
      console.log("FCM Token:", token);
      return token;
    } else {
      console.log("Notification permission denied.");
      return null;
    }
  } catch (err) {
    console.error("Error getting notification permission:", err);
    return null;
  }
};

export const listenForMessages = () => {
  onMessage(messaging, (payload) => {
    console.log("Message received:", payload);
    new Notification(payload.notification.title, {
      body: payload.notification.body,
      icon: "/vite.svg",
    });
  });
};