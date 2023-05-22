import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyA_1MAUu6O6dDCmG2jS4H3eiIgVw7YIYcI",
    authDomain: "fir-course-cd557.firebaseapp.com",
    projectId: "fir-course-cd557",
    storageBucket: "fir-course-cd557.appspot.com",
    messagingSenderId: "131504226185",
    appId: "1:131504226185:web:1cf242fa4319b65f696b58",
    measurementId: "G-TS9MKBZWRM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)

export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)
export const storage = getStorage(app)