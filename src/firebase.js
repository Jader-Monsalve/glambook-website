// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA6ZaSPJZ9sz75fvYSy1GUL0uLpth5PURQ",
  authDomain: "glambook-ac3dd.firebaseapp.com",
  projectId: "glambook-ac3dd",
  storageBucket: "glambook-ac3dd.firebasestorage.app",
  messagingSenderId: "536181803335",
  appId: "1:536181803335:web:358a751de57699eab4a462",
  measurementId: "G-6C1YMQLCR5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);