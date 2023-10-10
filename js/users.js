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

  //addLike function

  //removeLike Function
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
  //update project in firestore

  //add project likes function

  //remove likes from project function
}
