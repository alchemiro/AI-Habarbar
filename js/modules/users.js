import { pushProjectParam, pushProject, pullProjectParam, pullProject, validate } from "./projectInteract.js";
import { pushStudentParam, pushStudent, pullStudentParam, pullStudent, validate } from "./studentInteract.js";
import { pushGuestParam, pushGuest, pullGuestParam, pullGuest, validate } from "./guestInteract.js";
import { pushJudgeParam, pushJudge, pullJudgeParam, pullJudge, validate } from "./judgeInteract.js";

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

class Guest extends user {
    #likes;
    name;
    #AmountOfLikes;

    constructor(ID, pass = "", name = "", amount = 0, likes = []) {
        if (validate(ID)) {
            this = pullGuest(ID);
        }
        else {
            super(ID, pass);
            this.#likes = likes;
            this.#AmountOfLikes = amount;
            this.name = name;
        }
    }

    get name() {
        return this.name;
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
            project = new Project(ProjectID);
            project.AddLike()

        }
    }
    RemoveLike(ProjectID) {
        if (this.AmountOfLikes > 0) {
            this.#likes.splice(this.#likes.indexOf(ProjectID), 1);
            this.AmountOfLikes--;
            project.RemoveLike()
        }
    }
}

class Judge extends user {
    name;
    #Projects;

    constructor(ID, pass = "", name = "", Projects = []) {
        if (validate(ID)) {
            this = pullJudge(ID);
        }
        else {
            super(ID, pass);
            this.name = name;
            this.#Projects = Projects;
        }
    }
    get name() {
        return this.name;
    }

    get Projects() {
        return this.#Projects;
    }


    get Project() {
        for (var i = 0; i < this.#Projects.length; i++) {
      // yield this.#Projects[i];
        }
    }

    AddProject(projectID) {
        this.#Projects.push(projectID);
    }

    RemoveProject(projectID) {
        this.#Projects.splice(this.#Projects.indexOf(projectID), 1);
    }
}

class Student extends Guest {
    #ProjectID;

    constructor(ID, pass = "", name = "", ProjectID = "", likes = [], amount = 0) {
        if (validate(ID)) {
            this = pullStudent(ID);
        }
        else {
            super(ID, pass, name, amount, likes);
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
    #name;
    #id;
    #grades;
    #likes;
    #summary;
    #img;
    #category;
    #round;

    constructor( id, name = " ", grade = [],  likes = 0, summary = " ", img = " ", round = 0, category = " ") {
        this.#id = id;
        if (validate(this.#id)) {
            this = pullProject(this.#id);
        }
        else {
            this.#name = name;
            this.#grade = grades;
            this.#likes = 0;
            this.#summary = summary;
            this.#img = img;
            this.#round = round;
            this.#category = " ";
        }
    }
    g

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
        pushProjectParam(ProjectID, "likes", this.likes);
    }

    RemoveLike() {
        this.#likes--;
        pushProjectParam(ProjectID, "likes", this.likes);
    }
}

export { user, Guest, Project, Student, Judge };
