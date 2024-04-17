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

const gradeCollection = db.collection("grades");
const studentCollection = db.collection("students");
const projectCollection = db.collection("projects");
const guestCollection = db.collection("guests");
const judgeCollection = db.collection("judges");

class User {
  #id;
  constructor(ID = -1) {
    this.#id = ID;
  }

  get id() {
    return this.#id;
  }

  set id(ID) {
    this.#id = ID;
  }
}

class Guest extends User {
  //set and get done
  #pass;
  #likes;
  #name;

  constructor(ID, name = "", pass = "", likes = []) {
    super(ID);
    this.#pass = pass;
    this.#likes = likes;
    this.#name = name;
  }

  get name() {
    return this.#name;
  }
  get likes() {
    return this.#likes;
  }

  get pass() {
    return this.#pass;
  }

  set name(newname) {
    this.#name = newname;
  }

  set pass(newpass) {
    this.#pass = newpass;
  }

  set likes(newlikes) {
    this.#likes = newlikes;
  }

  toString() {
    return `Guest ID: ${this.id}, Password: ${this.pass}, Name: ${this.name}`;
  }
}

class Project {
  #name;
  #id;
  #likes;
  #summary;
  #img;
  #category;
  #avg;
  constructor(
    id,
    name = " ",
    likes = 0,
    summary = " ",
    img = " ",
    category = " ",
    avg = 0
  ) {
    this.#id = id;
    this.#name = name;
    this.#likes = likes;
    this.#summary = summary;
    this.#img = img;
    this.#category = category;
    this.#avg = avg;
  }
  get name() {
    return this.#name;
  }
  get id() {
    return this.#id;
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
  get category() {
    return this.#category;
  }
  get avg() {
    return this.#avg;
  }

  set name(newparam) {
    this.#name = newparam;
  }
  set id(newparam) {
    this.#id = newparam;
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
  set category(newparam) {
    this.#category = newparam;
  }
  set avg(value) {
    this.#avg = value;
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

  get color() {
    switch (this.#category) {
      case "אלקטרוניקה":
        return "#fffff0";
      case "תקשוב":
        return "#D4AF37";
      case "מכטרוניקה":
        return "#ffe55e";
      default:
        return "#000000";
    }
  }

  get textColor() {
    switch (this.#category) {
      case "אלקטרוניקה":
        return "#121212";
      case "תקשוב":
        return "#121212";
      case "מכטרוניקה":
        return "#121212";
      default:
        return "#121212";
    }
  }
}

class Judge extends User {
  #name;
  #pass;
  #projects;
  constructor(ID, name = "", pass = "", projects = []) {
    super(ID);
    this.#pass = pass;
    this.#name = name;
    this.#projects = projects;
  }
  get name() {
    return this.#name;
  }
  get pass() {
    return this.#pass;
  }
  get projects() {
    return this.#projects;
  }
  set name(newName) {
    this.#name = newName;
  }
  set pass(newpass) {
    this.#pass = newpass;
  }
  set projects(newProjects) {
    this.#projects = newProjects;
  }
  AddProject(projectID) {
    this.#projects.push(projectID);
  }
  RemoveProject(projectID) {
    this.#projects.splice(this.#projects.indexOf(projectID), 1);
  }

  toString() {
    return `Judge ID: ${this.id}, Password: ${this.pass}, Name: ${this.name}, Projects: ${this.projects}`;
  }
}

class Student extends Guest {
  //set and get done
  #project;

  constructor(ID, name = "", pass = "", likes = [], project = "") {
    super(ID, name, pass, likes);
    this.#project = project;
  }

  get project() {
    return this.#project;
  }

  set projectID(project) {
    this.#project = project;
  }
  toString() {
    return `Student ID: ${this.id}, Password: ${this.pass}, Name: ${this.name}, Project ID: ${this.project}`;
  }
}

class Grade {
  id;
  #judge;
  #project;
  #score;
  constructor(id, judge, project, score) {
    this.id = id;
    this.#judge = judge;
    this.#project = project;
    this.#score = score;
  }
  get judge() {
    return this.#judge;
  }
  get project() {
    return this.#project;
  }
  get score() {
    return this.#score;
  }

  set judge(value) {
    this.#judge = value;
  }
  set project(value) {
    this.#judge = value;
  }
  set score(value) {
    this.#judge = value;
  }
}

const getDocumentFirebase = async function (collection, keystring, converter) {
  // keystring = "1";
  // console.log("before proj get");
  var objectRef = collection.doc(keystring).withConverter(converter);
  return objectRef.get().then((document) => {
    if (document.exists) {
      // console.log("Found!");
      // console.log(document.data().toString());
      const data = document.data();
      // console.log(data.toString());
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
  // console.log("getting");
  if (object instanceof Project) {
    const data = getDocumentFirebase(
      projectCollection,
      object.id,
      projectConverter
    );
    // console.log(data.toString());
    return Promise.resolve(data);
  } else if (object instanceof Student) {
    const data = getDocumentFirebase(
      studentCollection,
      object.id,
      studentConverter
    );
    // console.log(data.toString());
    return Promise.resolve(data);
  } else if (object instanceof Judge) {
    const data = getDocumentFirebase(
      judgeCollection,
      object.id,
      judgeConverter
    );
    // console.log(data.toString());
    return Promise.resolve(data);
  } else if (object instanceof Guest) {
    const data = getDocumentFirebase(
      guestCollection,
      object.id,
      guestConverter
    );
    // console.log(data.toString());
    return Promise.resolve(data);
  } else if (object instanceof Grade) {
    const data = getDocumentFirebase(
      gradeCollection,
      object.id,
      gradeConverter
    );
    console.log(data.toString());
    return Promise.resolve(data);
  } else {
    return Promise.reject("Unknown object type");
  }
};

const setDocumentFirebase = async function (collection, keystring, converter) {
  // keystring = "1";
  // console.log("before proj get");
  var objectRef = collection.doc(keystring).withConverter(converter);
  await objectRef.set(object);
  return Promise.resolve();
};

const setDocument = async function (object) {
  if (object instanceof Project) {
    await setDocumentFirebase(
      projectCollection,
      object.id,
      projectConverter
    ).then(console.log("Sent project"));
    return Promise.resolve();

    // console.log(data.toString());
  } else if (object instanceof Student) {
    await setDocumentFirebase(
      studentCollection,
      object.id,
      studentConverter
    ).then(console.log("Sent student"));
    return Promise.resolve();

    // console.log(data.toString());
  } else if (object instanceof Judge) {
    await setDocumentFirebase(judgeCollection, object.id, judgeConverter).then(
      console.log("Sent judge")
    );
    return Promise.resolve();

    // console.log(data.toString());
  } else if (object instanceof Guest) {
    await setDocumentFirebase(guestCollection, object.id, guestConverter).then(
      console.log("Sent guest")
    );
    return Promise.resolve();
  } else if (object instanceof Grade) {
    await setDocumentFirebase(gradeCollection, object.id, gradeConverter).then(
      console.log("Sent grade")
    );
    return Promise.resolve();
  } else {
    return Promise.reject();
  }
};
