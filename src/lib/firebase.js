// src/lib/firebase.js
import Firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
const config = {
    apiKey: "AIzaSyCEjLHqLpW5Prv-5zhb33RUhz6Z1RwrhXc",
    authDomain: "instagram-3a3d7.firebaseapp.com",
    projectId: "instagram-3a3d7",
    storageBucket: "instagram-3a3d7.appspot.com",
    messagingSenderId: "132423561098",
    appId: "1:132423561098:web:6e4ce7ed6d4f37c1d86273"
};
const firebase = Firebase.initializeApp(config);
const { FieldValue } = Firebase.firestore;
export { firebase, FieldValue };
