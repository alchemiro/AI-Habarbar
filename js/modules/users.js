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
  #likes;
  #summary;
  #img;
  #category;

  constructor(
    id,
    name = " ",
    likes = 0,
    summary = " ",
    img = " ",
    category = " "
  ) {
    this.#id = id;
    console.log(`Project Constructor called, using project ID ${this.#id}`);
    if (dblayer.validate(this)) {
      var projTemplate = dblayer.getAll(this).then(() => {
        console.log("Object found on db, taking data");
        this.#name = projTemplate.name;
        this.#likes = projTemplate.likes;
        this.#summary = projTemplate.summary;
        this.#img = projTemplate.img;
        this.#category = projTemplate.category;
      });
    } else {
      console.log("Object not found on database, using local data");
      this.#name = name;
      this.#likes = likes;
      this.#summary = summary;
      this.#img = img;
      this.#category = category;
    }
  }

  AddLike() {
    this.#likes++;
    dblayer.updateParameter(this, "likes", this.#likes);
  }

  RemoveLike() {
    this.#likes--;
    dblayer.updateParameter(this, "likes", this.#likes);
    }
    GetProj() {
        return [this.#id, this.#name, this.#likes, this.#summery, this.#img, this.#category];
    }
}

class Grade {
    id;
    #judge;
    #project;
    #score;
    // #round;
    constructor(id, judge, project, score) {
        this.id = id;
        this.#judge = judge;
        this.#project = project;
        this.#score = score;
        // this.#round = round;
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
    // get round() {
    //   return this.#round;
    // }
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
