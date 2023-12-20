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
        console.log("Object found on db, taking data");
        this.#name = projTemplate.name;
        this.#grades = projTemplate.grades;
        this.#likes = projTemplate.likes;
        this.#summary = projTemplate.summary;
        this.#img = projTemplate.img;
        this.#round = projTemplate.round;
        this.#category = projTemplate.category;
      });
    } else {
      console.log("Object not found on database, using local data");
      this.#name = name;
      this.#grades = grade;
      this.#likes = likes;
      this.#summary = summary;
      this.#img = img;
      this.#round = round;
      this.#category = category;
    }
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
