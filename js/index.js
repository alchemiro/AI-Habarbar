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

class user {
  #id;
  #password;
  constructor(ID, Password) {
    this.#id = ID;
    this.#password = Password;
  }

  get id() {
    return this.#id;
  }

  get password() {
    return this.#password;
  }
}

class guest extends user {
  #id;
  #password;
  #likes;
  constructor(ID, pass) {
    super(ID, pass);
    this.#likes = [];
  }

  get likes() {
    return this.#likes;
  }

  async addLike(projectID) {
    if (this.#likes.length > 20) {
      this.#likes.push(projectID);
      const docRef = doc(db, "projects", projectID);
      const currentProjectLikes = await getDocs(docRef);
      const projectRef = collection(db, "projects");
      await setDoc(doc(projectRef, projectID), {
        likes: currentProjectLikes + 1,
      });
    }
  }

  async removeLike(projectID) {
    newLikes = this.#likes.filter((project) => {
      project != projectID;
    });
    this.#likes = newLikes;
  }
}
