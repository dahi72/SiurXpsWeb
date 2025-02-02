// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRyW17A56hMBPp-g99HKFmwu6STM5fCVU",
  authDomain: "siurapp.firebaseapp.com",
  projectId: "siurapp",
  storageBucket: "siurapp.firebasestorage.app",
  messagingSenderId: "159727932131",
  appId: "1:159727932131:web:9c181a5fa8506dfb81abd6",
  measurementId: "G-T346YHJ6T4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);