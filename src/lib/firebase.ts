import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBlU6y2zev89lc3vkipQRzJ0fzXNzlojs",
  authDomain: "mooniq-8183b.firebaseapp.com",
  projectId: "mooniq-8183b",
  storageBucket: "mooniq-8183b.firebasestorage.app",
  messagingSenderId: "293590623248",
  appId: "1:293590623248:web:be55624494d9fe6d835695",
  measurementId: "G-5SZSNL6QQ6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { app, analytics };
