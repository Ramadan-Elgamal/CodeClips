
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD09pgld4j2-hOjPKl6rjSY3iKHdTe5mpk",
  authDomain: "codeclips.firebaseapp.com",
  projectId: "codeclips",
  storageBucket: "codeclips.appspot.com",
  messagingSenderId: "696825099134",
  appId: "1:696825099134:web:2692b1812afb6518d8f92f"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
