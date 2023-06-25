import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQ2njI4pxmcVemTovJnIKF1CuEQDkAFfM",
  authDomain: "orbital-3d9f2.firebaseapp.com",
  projectId: "orbital-3d9f2",
  storageBucket: "orbital-3d9f2.appspot.com",
  messagingSenderId: "538392609594",
  appId: "1:538392609594:web:2edd050eaa55dce5be4603",
  measurementId: "G-93J9CMDP6J",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
