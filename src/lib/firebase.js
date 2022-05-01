// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// import file for seeding database
import { seedDatabase } from "../seed";


// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyC77MZSzUQJuAhCTLFLpKiI3mlyQWDEiSc",
  authDomain: "instagram-4bc6a.firebaseapp.com",
  projectId: "instagram-4bc6a",
  storageBucket: "instagram-4bc6a.appspot.com",
  messagingSenderId: "623662632878",
  appId: "1:623662632878:web:f6445d6e4a3b0b1905023f"
};


// Initialize Firebase

const firebase = initializeApp(firebaseConfig);
const db = getFirestore(firebase);

const {FieldValue} = db;

// call seed file once

//seedDatabase(db); 
//https://firebase.google.com/codelabs/firebase-web#7


export {firebase, FieldValue, db};
