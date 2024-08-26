// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACa-Tg4y7aRuKbFV48R80Kbmw-acUpD6M",
  authDomain: "ai-flashcards-9962e.firebaseapp.com",
  projectId: "ai-flashcards-9962e",
  storageBucket: "ai-flashcards-9962e.appspot.com",
  messagingSenderId: "442137332939",
  appId: "1:442137332939:web:8dd1e65c0aa430a887df4e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export{db}