import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCIzPId76MHXnA3EdWOd6W8yDG67YYOM-Q",
    authDomain: "vibe-snaper.firebaseapp.com",
    databaseURL: "https://vibe-snaper-default-rtdb.firebaseio.com",
    projectId: "vibe-snaper",
    storageBucket: "vibe-snaper.firebasestorage.app",
    messagingSenderId: "536034989244",
    appId: "1:536034989244:web:e038f5b3d6138636b46cb9",
    measurementId: "G-GBBJV8ND18"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);