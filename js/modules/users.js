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
    AmountOfLikes;

    constructor(ID, pass) {
        super(ID, pass);
        this.#likes = [];
        this.AmountOfLikes = 0;
    }

    get likes() {
        return this.#likes;
    }

    get AmountOfLikes() {
        return this.AmountOfLikes;
    }

    AddLike(ProjectID) {
        if (this.AmountOfLikes < 20) {
            this.#likes.push(ProjectID);
            this.AmountOfLikes++;
            project = new Project(ProjectID);
            project.AddLike();
        }

    }
    RemoveLike(ProjectID) {
        if (this.AmountOfLikes > 0) {
            this.#likes.splice(this.#likes.indexOf(ProjectID), 1);
            this.AmountOfLikes--;
            project = new Project(ProjectID);
            project.RemoveLike();
        }
        
    }
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

    constructor(id, name = " ", summary = " ", img = " ", round = 0, category = " ") {
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
