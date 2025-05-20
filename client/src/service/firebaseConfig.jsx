// firebaseConfig.jsx

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA5h4HeOW5EmA0uXiBdXHTxNcxhcQ-QHVw",
  authDomain: "visittozeur.firebaseapp.com",
  projectId: "visittozeur",
  storageBucket: "visittozeur.appspot.com",
  messagingSenderId: "267370047933",
  appId: "1:267370047933:web:e5017aee39967fdb330ad4",
  measurementId: "G-MTVCXRZFYQ"
};

// Initialize app
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ✅ Export everything needed
export { app, db, auth, provider };
