import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    getDoc,
    updateDoc,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const NumberOfJudges = 5;
const projectsCollection = collection(db, "projects");
const guestCollection = collection(db, "guests");
const judgesCollection = collection(db, "judges");
const studentCollection = collection(db, "students");

export {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    studentCollection,
    judgesCollection,
    guestCollection,
    projectsCollection,
    NumberOfJudges,
    app,
    db,
    firebaseConfig,
};
