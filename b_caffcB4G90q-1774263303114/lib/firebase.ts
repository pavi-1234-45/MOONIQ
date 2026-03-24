import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDBlU6y2zev89lc3vkipQRzJ0fzXNzlojs",
  authDomain: "mooniq-8183b.firebaseapp.com",
  projectId: "mooniq-8183b",
  storageBucket: "mooniq-8183b.firebasestorage.app",
  messagingSenderId: "293590623248",
  appId: "1:293590623248:web:be55624494d9fe6d835695",
  measurementId: "G-5SZSNL6QQ6",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
};
export type { User };
