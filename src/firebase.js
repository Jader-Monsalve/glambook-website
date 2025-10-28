// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updatePassword,
  updateProfile,
  deleteUser,
  sendPasswordResetEmail,
  signInAnonymously
} from "firebase/auth";
import { 
  getFirestore, 
  connectFirestoreEmulator,
  enableNetwork,
  disableNetwork,
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  writeBatch
} from "firebase/firestore";

// Firebase configuration with environment variables for production
const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_API_KEY || "AIzaSyA6ZaSPJZ9sz75fvYSy1GUL0uLpth5PURQ",
  authDomain: import.meta.env.FIREBASE_AUTH_DOMAIN || "glambook-ac3dd.firebaseapp.com",
  projectId: import.meta.env.FIREBASE_PROJECT_ID || "glambook-ac3dd",
  storageBucket: import.meta.env.FIREBASE_STORAGE_BUCKET || "glambook-ac3dd.firebasestorage.app",
  messagingSenderId: import.meta.env.FIREBASE_MESSAGING_SENDER_ID || "536181803335",
  appId: import.meta.env.FIREBASE_APP_ID || "1:536181803335:web:358a751de57699eab4a462",
  measurementId: import.meta.env.FIREBASE_MEASUREMENT_ID || "G-6C1YMQLCR5"
};

// Initialize Firebase with error handling
let app;
let analytics;
let auth;
let db;

try {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase app initialized successfully');
  
  // Initialize Analytics (only in browser environment)
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
  
  // Initialize Auth
  auth = getAuth(app);
  console.log('✅ Firebase Auth initialized');
  
  // Initialize Firestore with proper settings
  db = getFirestore(app);
  console.log('✅ Firestore initialized');
  
} catch (error) {
  console.error('❌ Error initializing Firebase:', error);
  throw error;
}

// Network state management
export async function enableFirebaseNetwork() {
  try {
    await enableNetwork(db);
    console.log('✅ Firebase network enabled');
  } catch (error) {
    console.warn('⚠️ Error enabling Firebase network:', error);
  }
}

export async function disableFirebaseNetwork() {
  try {
    await disableNetwork(db);
    console.log('📴 Firebase network disabled');
  } catch (error) {
    console.warn('⚠️ Error disabling Firebase network:', error);
  }
}

// Export Firebase services
export { 
  auth, 
  db, 
  analytics,
  // Auth functions
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  updateProfile,
  deleteUser,
  sendPasswordResetEmail,
  signInAnonymously,
  // Firestore functions
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  writeBatch,
  enableNetwork,
  disableNetwork
};