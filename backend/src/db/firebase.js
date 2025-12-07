// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import dotenv from "dotenv";

dotenv.config();

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey:               process.env.FIREBASE_APIKEY,
  authDomain:           process.env.FIREBASE_AUTHDOMAIN,
  projectId:            process.env.FIREBASE_PROJECTID,
  storageBucket:        process.env.FIREBASE_STORAGEBUCKET,
  messagingSenderId:    process.env.FIREBASE_MESSAGINGSENDERID,
  appId:                process.env.FIREBASE_APPID,
  measurementId:        process.env.FIREBASE_MEASUREMENTID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);

// Log successful connection
console.log("Conexión a Firebase exitosa 🔥");

export { db };