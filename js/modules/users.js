import { pushProjectParam, pullProjectParam } from "./projectInteract";

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

  set id(ID) {
    this.#id = ID;
  }

  get password() {
    return this.#password;
  }

  set password(pass) {
    this.#password = pass;
  }
} // this the defualt class for everyone that enters the site
const userConverter = {
  toFirestore: (user) => {
    return {
      id: user.id,
      pass: user.password,
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new user(data.id, data.password);
  },
};

class guest extends user {
  #likes;
  #name;
  #AmountOfLikes;

  constructor(ID, pass, name) {
    super(ID, pass);
    this.#likes = [];
    this.#AmountOfLikes = 0;
    this.#name = name;
  }

  get name() {
    return this.#name;
  }
  get likes() {
    return this.#likes;
  }

  get AmountOfLikes() {
    return this.#AmountOfLikes;
  }

  addLike(ProjectID) {
    if (this.AmountOfLikes < 20) {
      this.#likes.push(ProjectID);
      this.AmountOfLikes++;
      pushProjectParam(ProjectID, "likes", this.likes);
      pushProjectParam(ProjectID, "AmountOfLikes", this.AmountOfLikes);
      //   project = new Project(ProjectID);
      //   project.AddLike();
      // return null;
    }
  }
  RemoveLike(ProjectID) {
    if (this.AmountOfLikes > 0) {
      this.#likes.splice(this.#likes.indexOf(ProjectID), 1);
      this.AmountOfLikes--;
      //   project = new Project(ProjectID);
      pushProjectParam(ProjectID, "likes", this.likes);
      pushProjectParam(ProjectID, "AmountOfLikes", this.AmountOfLikes);
      // return null;
    }
  }
}

const guestConverter = {
  toFirestore: (project) => {
    return {
      id: project.id,
      name: project.name,
      grades: project.grades,
      likes: project.likes,
      AmountOfLikes: project.AmountOfLikes,
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
      data.summary,
      data.img,
      data.round,
      data.category
    );
  },
};

class student extends guest {
  #ProjectID;

  constructor(ID, pass, name, ProjectID) {
    super(ID, pass, name);
    this.#ProjectID = ProjectID;
  }

  get project() {
    return this.#ProjectID;
  }

  set project(projectID) {
    this.#ProjectID = projectID;
  }
}
const studentConverter = {
  toFirestore: (project) => {
    return {
      id: project.id,
      name: project.name,
      grades: project.grades,
      likes: project.likes,
      AmountOfLikes: project.AmountOfLikes,
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
      data.summary,
      data.img,
      data.round,
      data.category
    );
  },
};

class Project {
  name;
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
    summary = " ",
    img = " ",
    round = 0,
    category = " "
  ) {
    this.name = name;
    this.#id = id;
    this.#summary = summary;
    this.#img = img;
    this.#round = round;
    this.#category = category;
    this.#likes = 0;
    this.#grades = new Array(NumberOfJudges);
    // check if project exists (function)
  }

  get name() {
    return this.name;
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
    return;
  }
  AddGrade(Grade) {
    this.#grades.push(Grade);
  }

  RemoveGrade(Grade) {
    this.#grades.splice(this.#grades.indexOf(Grade), 1);
  }

  ChangeGrade(OldGrade, NewGrade) {
    this.RemoveGrade(OldGrade);
    this.AddGrade(NewGrade);
  }

  AddLike() {
    this.#likes++;
  }

  RemoveLike() {
    this.#likes--;
  }
}

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
      data.summary,
      data.img,
      data.round,
      data.category
    );
  },
};

class judge extends user {}

const judgeConverter = {
  toFirestore: (project) => {
    return {
      id: project.id,
      name: project.name,
      grades: project.grades,
      likes: project.likes,
      AmountOfLikes: project.AmountOfLikes,
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
      data.summary,
      data.img,
      data.round,
      data.category
    );
  },
};

class admin extends user {}
const adminConverter = {
  toFirestore: (project) => {
    return {
      id: project.id,
      name: project.name,
      grades: project.grades,
      likes: project.likes,
      AmountOfLikes: project.AmountOfLikes,
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
      data.summary,
      data.img,
      data.round,
      data.category
    );
  },
};

export {
  user,
  guest,
  Project,
  student,
  judge,
  admin,
  projectConverter,
  userConverter,
  guestConverter,
  studentConverter,
  judgeConverter,
  adminConverter,
};
