import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
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

const studentConverter = {
  toFirestore: (student) => {
    return {
      id: student.id,
      name: student.name,
      password: student.password,
      likes: student.likes,
      ProjectID: student.ProjectID,
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new student(
      data.id,
      data.name,
      data.password,
      data.likes,
      data.ProjectID
    );
  },
};

const projectConverter = {
  toFirestore: (project) => {
    return {
      id: project.id,
      name: project.name,
      grades: project.grades,
      likes: project.likes,
      summary: project.summary,
      img: project.img,
      category: project.category,
      round: project.round,
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new Project(
      data.id,
      data.name,
      data.grades,
      data.likes,
      data.summary,
      data.img,
      data.round,
      data.category
    );
  },
};

const judgeConverter = {
  toFirestore: (judge) => {
    return {
      id: judge.id,
      name: judge.name,
      password: judge.password,
      projects: judge.projects,
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new judge(data.id, data.name, data.password, data.projects);
  },
};

const guestConverter = {
  toFirestore: (guest) => {
    return {
      id: guest.id,
      name: guest.name,
      password: guest.password,
      likes: guest.likes,
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new guest(data.id, data.name, data.password, data.likes);
  },
};

const app = initializeApp(firebaseConfig);
console.log("Initialized app");
const db = getFirestore(app);
console.log("Got Database");

const NumberOfJudges = 5;
const projectCollection = collection(db, "projects");
console.log("got proj collect");

const guestCollection = collection(db, "guests");
console.log("got guest collect");

const judgeCollection = collection(db, "judges");
console.log("got judge collect");

const studentCollection = collection(db, "students");
console.log("got student collect");

export {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  studentCollection,
  judgeCollection,
  guestCollection,
  projectCollection,
  NumberOfJudges,
  app,
  db,
  firebaseConfig,
  studentConverter,
  projectConverter,
  judgeConverter,
  guestConverter,
};
