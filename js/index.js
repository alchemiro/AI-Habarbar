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

const docRef = doc(projectsCollection , projectID);
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
        const docRef = doc(projectsCollection , projectID);
      const project = await getDocs(docRef);
      console.log(project);
        /*
      await setDoc(doc(this.#grades, projectID), {
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
    #summary;
    #img;
    #category;
    #round;
    
    constructor(id, name = " ", summary = " ", img = " ", round = 0, category = " ",) {

        this.name = name;
        this.#id = id;
        this.#summary = summary;
        this.#img = img;
        this.#round = round;
        this.#category = category;
        this.#likes = 0;
        this.#grades = new Array(NumberOfJudges);
        
        // Check if the project exists
        const docRef = projectsCollection.doc(id);
        
        docRef.get()
            .then((doc) => {
                if (doc.exists) {
                    // Project exists, populate object with Firestore data
                    const data = doc.data();
                    this.name = data.name;
                    this.#summary = data.summary;
                    this.#img = data.img;
                    this.#round = data.round;
                    this.#category = data.category;
                    this.#likes = data.likes;
                } else {
                    // Project doesn't exist, create a new one
                    return docRef.set({
                        name: this.name,
                        summary: this.#summary,
                        img: this.#img,
                        round: this.#round,
                        category: this.#category,
                        grade: this.#grades,
                        likes: this.#likes,
                    });
                } 
            })
            .then(() => {
                console.log('Project data retrieved or created in Firestore.');
            })
            .catch((error) => {
                console.error('Error checking/creating Firestore project:', error);
            });
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
    updateInFirestore() {
        const updatedData = {
            name: this.name,
            summary: this.#summary,
            img: this.#img,
            round: this.#round,
            category: this.#category,
            grade: this.#grades,
        };

        this.docRef.update(updatedData)
            .then(() => {
                console.log('Project data updated in Firestore.');
            })
            .catch((error) => {
                console.error('Error updating data in Firestore:', error);
            });
    }
    AddLike() {
        this.#likes += 1;
        const updatedData = {
            likes: this.#likes,
        };

        this.docRef.update(updatedData)
            .then(() => {
                console.log('likes updated in Firestore.');
            })
            .catch((error) => {
                console.error('Error updating likes in Firestore:', error);
            });
    }
    removeLike() {
        this.#likes -= 1;
        const updatedData = {
            likes: this.#likes,
        };

        this.docRef.update(updatedData)
            .then(() => {
                console.log('likes updated in Firestore.');
            })
            .catch((error) => {
                console.error('Error updating likes in Firestore:', error);
            });
    }
}
