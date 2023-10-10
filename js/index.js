// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDocs,
  deleteDoc,
  setDoc,
} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDbwHRNfml9PgY9iCBP-RXJKgza0cBhS2s",
  authDomain: "ai-habarbar.firebaseapp.com",
  databaseURL:
    "https://ai-habarbar-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ai-habarbar",
  storageBucket: "ai-habarbar.appspot.com",
  messagingSenderId: "377582621016",
  appId: "1:377582621016:web:de9d0a40e1ffe4e7e2152d",
  measurementId: "G-H6QWR8BCR1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const NumberOfJudges = 5;
const projectsCollection = collection(db, "projects");
const guestCol = collection(db, "guests");
const judgesCol = collection(db, "judges");
const studentCol = collection(db, "students");

const docRef = doc(projectsCollection, projectID);
const project = await getDocs(docRef);
console.log(project);
