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
const projectCol = collection(db, "projects");
const guestCol = collection(db, "guests");
const judgesCol = collection(db, "judges");
const studentCol = collection(db, "students");

const docRef = doc(projectCol, projectID);
const project = await getDocs(docRef);
console.log(project);

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
} // this the defualt class for everyone that enters the site

class guest extends user {
  #likes;
  constructor(ID, pass) {
    super(ID, pass);
    this.#likes = [];
  }

  get likes() {
    return this.#likes;
  }

  async addLike(projectID) {
    if (this.#likes.length < 20) {
      this.#likes.push(projectID);
      const docRef = doc(projectCol, projectID);
      const project = await getDocs(docRef);
      console.log(project);
        /*
      await setDoc(doc(projectCol, projectID), {
        likes: updateProjectLikeField + 1,
      });*/
    }
  }

  async removeLike(projectID) {
    newLikes = this.#likes.filter((project) => {
      project != projectID;
    });
    this.#likes = newLikes;
  }
}

class Project {
    name;
    #id;
    #grades;
    #likes;
    #summery;
    #img;
    #category;
    #round;
    constructor(id, name = " ", summery = " ", img = " ", round = 0, category = " ") {
        /*
        if(id exist in db):
            pull the info from the db
        else:
            create new doc
         */
        this.name = name
        this.#id = id
        this.#summery = summery
        this.#img = img
        this.#round = round
        this.#category = category
        this.#grades = new Array(NumberOfJudges)
    }
    get id() {
        return this.#id;
    }
    get grade() {
        let sum = 0;
        for (let i = 0; i < this.#grades.length; i++) {
            sum += this.#grades[i];
        }
        return sum / this.#grades.length;
    }
    get grades() {
        return this.#grades;
    }


    
}
