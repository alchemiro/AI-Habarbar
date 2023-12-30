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
} // this the defualt class for everyone that enters the site
class Guest extends User {
  //set and get done
  #pass;
  #likes;
  name;
  #AmountOfLikes;

  constructor(ID, pass = "", name = "", amount = 0, likes = []) {
    super(ID);
    if (dblayer.validate(this)) {
      var guesttemplate = dblayer.getAll(this).then(() => {
        this.#pass = guesttemplate.pass;
        this.#likes = guesttemplate.likes;
        this.#AmountOfLikes = guesttemplate.AmountOfLikes;
        this.name = guesttemplate.name;
      });
    } else {
      this.#pass = pass;
      this.#likes = likes;
      this.#AmountOfLikes = amount;
      this.name = name;
      dblayer.setAll(this);
    }
  }

  get name() {
    return this.name;
  }
  get likes() {
    return this.#likes;
  }

  get pass() {
    return this.#pass;
  }

  get AmountOfLikes() {
    return this.#AmountOfLikes;
  }

  // set name(newname){
  //     this.name = newname;
  // }

  set pass(newpass) {
    this.#pass = newpass;
  }

  set likes(newlikes) {
    this.#likes = newlikes;
  }

  set AmountOfLikes(newamount) {
    this.#AmountOfLikes = newamount;
  }
  set name(newName) {
    this.name = newName;
  }

  addLike(ProjectID) {
    if (this.AmountOfLikes < 20) {
      this.#likes.push(ProjectID);
      this.AmountOfLikes++;
      let project = new Project(ProjectID);
      project.AddLike();
    }
  }
  RemoveLike(ProjectID) {
    if (this.AmountOfLikes > 0) {
      this.#likes.splice(this.#likes.indexOf(ProjectID), 1);
      this.AmountOfLikes--;
      let project = new Project(ProjectID);
      project.RemoveLike();
    }
  }
}

class Judge extends User {
  //set and get done
  name;
  #pass;
  #projects;

  constructor(ID, pass = "", name = "", projects = []) {
    super(ID);
    if (dblayer.validate(this)) {
      var judgetemplate = dblayer.getAll(this).then(() => {
        this.#pass = judgetemplate.pass;
        this.name = judgetemplate.name;
        this.#projects = judgetemplate.pullGuestProjects;
      });
    } else {
      this.#pass = pass;
      this.name = name;
      this.#projects = projects;
    }
  }
  get name() {
    return this.name;
  }

  get pass() {
    return this.#pass;
  }

  get pullGuestProjects() {
    return this.#projects;
  }

  get Project() {
    for (var i = 0; i < this.#projects.length; i++) {
      // yield this.#Projects[i];
    }
  }

  set name(newName) {
    this.name = newName;
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
}

class Student extends Guest {
  //set and get done
  #ProjectID;

  constructor(
    ID,
    pass = "",
    name = "",
    ProjectID = "",
    likes = [],
    amount = 0
  ) {
    super(ID, pass, name, amount, likes);
    if (dblayer.validate(this)) {
      var studenttemplate = dblayer.getAll(this).then(() => {
        this.#ProjectID = studenttemplate.project;
      });
    } else {
      this.#ProjectID = ProjectID;
    }
  }

  get project() {
    return this.#ProjectID;
  }

  set project(projectID) {
    this.#ProjectID = projectID;
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
  // console.log("getting");
  if (object instanceof Project) {
    const data = getDocumentFirebase(
      projectCollection,
      object.id,
      projectConverter
    );
    console.log(data.toString());
    return Promise.resolve(data);
  } else if (object instanceof Student) {
    const data = getDocumentFirebase(
      studentCollection,
      object.id,
      studentConverter
    );
    console.log(data.toString());
    return Promise.resolve(data);
  } else if (object instanceof Judge) {
    const data = getDocumentFirebase(
      judgeCollection,
      object.id,
      judgeConverter
    );
    console.log(data.toString());
    return Promise.resolve(data);
  } else if (object instanceof Guest) {
    const data = getDocumentFirebase(
      guestCollection,
      object.id,
      guestConverter
    );
    console.log(data.toString());
    return Promise.resolve(data);
  } else {
    return Promise.reject("Unknown object type");
  }
};
