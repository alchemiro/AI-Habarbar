import {
  projectCollection,
  studentCollection,
  judgeCollection,
  guestCollection,
  guestConverter,
  judgeConverter,
  studentConverter,
  doc,
  projectConverter,
} from "./database.js";

class DBInteract {
  converter;
  collection;
  constructor() {
    // this.converter = projectConverter;
    // this.collection = projectCollection;
  }

  async getType(object) {
    if (object instanceof Guest) {
      console.log("Received a Guest");
      this.collection = guestCollection;
      this.converter = guestConverter;
      return;
    } else if (object instanceof Judge) {
      console.log("Received a Judge");
      this.collection = judgeCollection;
      this.converter = judgeConverter;
      return;
    } else if (object instanceof Student) {
      console.log("Received a Student");
      this.collection = studentCollection;
      this.converter = studentConverter;
      return;
    } else if (object instanceof Project) {
      console.log("Received a Project");
      this.collection = projectCollection;
      this.converter = projectConverter;
      return;
    } else {
      console.log(
        "Not really sure what this object is. Probably a User. Aborting..."
      );
      return;
    }
  }
  async validate(object) {
    if (!this.collection || !this.converter) {
      console.log("collection or converter is null");
      return false;
    }
    const document = this.collection
      .doc(object.id)
      .withConverter(this.converter);

    const snapshot = getDoc(document); //snapshot.data() is the data
    return snapshot.exists();
  }

  async getAll(object) {
    if (!this.validate(object)) {
      console.log("object not valid");
      this.getType(object);
    }
    const document = this.collection
      .doc(object.id)
      .withConverter(this.converter);

    const snapshot = await getDoc(document); //snapshot.data() is the data
    if (snapshot.exists()) {
      return snapshot.data();
    } else {
      this.setAll(object);
      return object;
    }
  }
  async setAll(object) {
    if (!this.validate(object)) return;
    const document = this.collection
      .doc(object.id)
      .withConverter(this.converter);
    await setDoc(document, object, { merge: true });
  }

  async updateParameter(object, field, value) {
    this.getType(object);
    const document = this.collection.doc(object.id);
    await updateDoc(document, { [field]: value }, { merge: true });
  }
}

const dblayer = new DBInteract();
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

class Project {
  //set and get done
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
    console.log(`Project Constructor called, using project ID ${this.#id}`);
    if (dblayer.validate(this)) {
      var projTemplate = dblayer.getAll(this).then(() => {
        this.#name = projTemplate.name;
        this.#grades = projTemplate.grades;
        this.#likes = projTemplate.likes;
        this.#summary = projTemplate.summary;
        this.#img = projTemplate.img;
        this.#round = projTemplate.round;
        this.#category = projTemplate.category;
      });
    } else {
      this.#name = name;
      this.#grades = grade;
      this.#likes = likes;
      this.#summary = summary;
      this.#img = img;
      this.#round = round;
      this.#category = category;
    }
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

  AddGrade(Grade) {
    this.#grades.push(Grade);
    dblayer.updateParameter(this, "grades", this.#grades);
  }

  RemoveGrade(Grade) {
    this.#grades.splice(this.#grades.indexOf(Grade), 1);
    dblayer.updateParameter(this, "grades", this.#grades);
  }

  ChangeGrade(OldGrade, NewGrade) {
    this.RemoveGrade(OldGrade);
    this.AddGrade(NewGrade);
  }

  AddLike() {
    this.#likes++;
    dblayer.updateParameter(this, "likes", this.#likes);
  }

  RemoveLike() {
    this.#likes--;
    dblayer.updateParameter(this, "likes", this.#likes);
  }
}

export { User, Guest, Project, Student, Judge, DBInteract };
