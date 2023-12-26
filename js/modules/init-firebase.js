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
const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore();

const studentCollection = db.collection("students");
const projectCollection = db.collection("projects");
const guestCollection = db.collection("guests");
const judgeCollection = db.collection("judges");

class Project {
  #name;
  #id;
  #grades;
  #likes;
  #summary;
  #img;
  #category;
  #round;

  constructor(
    id,
    name = " ",
    grade = [],
    likes = 0,
    summary = " ",
    img = " ",
    round = 0,
    category = " "
  ) {
    this.#id = id;
    this.#name = name;
    this.#grades = grade;
    this.#likes = likes;
    this.#summary = summary;
    this.#img = img;
    this.#round = round;
    this.#category = category;
  }

  get name() {
    return this.#name;
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
  get likes() {
    return this.#likes;
  }
  get summary() {
    return this.#summary;
  }
  get img() {
    return this.#img;
  }
  get round() {
    return this.#round;
  }
  get category() {
    return this.#category;
  }

  set name(newparam) {
    this.#name = newparam;
  }
  set id(newparam) {
    this.#id = newparam;
  }
  set grades(newparam) {
    this.#grades = newparam;
  }
  set likes(newparam) {
    this.#likes = newparam;
  }
  set summary(newparam) {
    this.#summary = newparam;
  }
  set img(newparam) {
    this.#img = newparam;
  }
  set round(newparam) {
    this.#round = newparam;
  }
  set category(newparam) {
    this.#category = newparam;
  }

  toString() {
    return (
      "ID: " +
      this.id +
      " Name: " +
      this.name +
      " Likes: " +
      this.likes +
      " End of Project."
    );
  }
}

const getDocumentFirebase = async function (collection, keystring, converter) {
  // keystring = "1";
  // console.log("before proj get");
  var objectRef = collection.doc(keystring).withConverter(converter);
  return objectRef.get().then((document) => {
    if (document.exists) {
      console.log("Found!");
      // console.log(document.data().toString());
      const data = document.data();
      console.log(data.toString());
      return data; // var proj = document.data();
      // console.log(proj.toString());
    } else {
      console.log("Not found.");
      return;
    }
  });
};

const getDocument = async function (object) {
  // console.log("Got a project");
  console.log("getting");
  const data = getDocumentFirebase(
    projectCollection,
    object.id,
    projectConverter
  );
  // console.log("hello!");
  console.log(data.toString());
  return Promise.resolve(data);
};

// const getDocument = async function (object) {
//   if (object instanceof Project) {
//     console.log("Got a project");
//     console.log("getting");
//     await getDocumentFirebase(projectCollection, object.id, projectConverter)
//       .then((data) => {
//         console.log("hello!");
//         console.log(data);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   } else if (object instanceof Student) {
//     getDocumentFirebase(studentCollection, object.id, studentConverter)
//       .then((document) => {
//         console.log(document.toString());
//         var obj = document.data();
//         return obj;
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   } else if (object instanceof Judge) {
//     getDocumentFirebase(projectCollection, object.id, judgeConverter)
//       .then((document) => {
//         console.log(document.toString());
//         var obj = document.data();
//         return obj;
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   } else if (object instanceof Guest) {
//     getDocumentFirebase(projectCollection, object.id, guestConverter)
//       .then((document) => {
//         console.log(document.toString());
//         var obj = document.data();
//         return obj;
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   } else {
//     console.log("Not really sure what this is, aborting...");
//     return;
//   }
// };
