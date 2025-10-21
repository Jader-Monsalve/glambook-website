// Firebase configuration
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// Firebase configuration
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

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Analytics only if supported (browser environment)
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { analytics };
export default app;