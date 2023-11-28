import { projectCollection, studentCollection, judgeCollection, guestCollection, guestConverter, judgeConverter, studentConverter } from "./database.js";

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
class Guest extends User {//set and get done
    #pass
    #likes;
    name;
    #AmountOfLikes;

    constructor(ID, pass = "", name = "", amount = 0, likes = []) {
        super(ID);
        if (DBInteract.validate(this)) {
            this = DBInteract.getAll(this);
        }
        else {
            this.#pass = pass
            this.#likes = likes;
            this.#AmountOfLikes = amount;
            this.name = name;
            DBInteract.setAll(this);
        }
    }

    get name() {
        return this.name;
    }
    get likes() {
        return this.#likes;
    }

    get pass(){
        return this.#pass;
    }

    get AmountOfLikes() {
        return this.#AmountOfLikes;
    }

    // set name(newname){
    //     this.name = newname;
    // }

    set pass(newpass){
        this.#pass = newpass
    }

    set likes(newlikes){
        this.#likes = newlikes;
    }

    set AmountOfLikes(newamount){
        this.#AmountOfLikes = newamount;
    }
    set name(newName){
        this.name = newName;
    }

    addLike(ProjectID) {
        if (this.AmountOfLikes < 20) {
            this.#likes.push(ProjectID);
            this.AmountOfLikes++;
            let project = new Project(ProjectID);
            project.AddLike()

        }
    }
    RemoveLike(ProjectID) {
        if (this.AmountOfLikes > 0) {
            this.#likes.splice(this.#likes.indexOf(ProjectID), 1);
            this.AmountOfLikes--;
            let project = new Project(ProjectID);
            project.RemoveLike()
        }
    }
}

class Judge extends User {//set and get done
    name;
    #pass;
    #projects;

    constructor(ID, pass = "", name = "", projects = []) {
        super(ID);
        if (DBInteract.validate(this)) {
            this = DBInteract.getAll(this);
        }
        else {
            this.#pass = pass;
            this.name = name;
            this.#projects = projects;
        }
    }
    get name() {
        return this.name;
    }

    get pass(){
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

    set name(newName){
        this.name = newName;
    }

    set pass(newpass){
        this.#pass = newpass;
    }

    set projects(newProjects){
        this.#projects = newProjects;
    }

    AddProject(projectID) {
        this.#projects.push(projectID);
    }

    RemoveProject(projectID) {
        this.#projects.splice(this.#projects.indexOf(projectID), 1);
    }
}

class Student extends Guest {//set and get done
    #ProjectID;

    constructor(ID, pass = "", name = "", ProjectID = "", likes = [], amount = 0) {
        super(ID, pass, name, amount, likes);
        if (DBInteract.validate(this)) {
            this = DBInteract.getAll(this);
        }
        else {
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

class Project {//set and get done
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
        if (DBInteract.validate(this)) {
            this = DBInteract.getAll(this);
        }
        else {
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
        this.#name = newparam
    }

    set id(newparam) {
        this.#id = newparam
    }

    set grades(newparam) {
        this.#grades = newparam
    }

    set likes(newparam) {
        this.#likes = newparam

    }

    set summary(newparam) {
        this.#summary = newparam
    }

    set img(newparam) {
        this.#img = newparam
    }

    set round(newparam) {
        this.#round = newparam
    }

    set category(newparam) {
        this.#category = newparam
    }

    AddGrade(Grade) {
        this.#grades.push(Grade);
        DBInteract.updateParameter(this,"grades",this.#grades);
    }

    RemoveGrade(Grade) {
        this.#grades.splice(this.#grades.indexOf(Grade), 1);
        DBInteract.updateParameter(this,"grades",this.#grades);
    }

    ChangeGrade(OldGrade, NewGrade) {
        this.RemoveGrade(OldGrade);
        this.AddGrade(NewGrade);
    }

    AddLike() {
        this.#likes++;
        DBInteract.updateParameter(this,"likes",this.#likes);
    }

    RemoveLike() {
        this.#likes--;
        DBInteract.updateParameter(this,"likes",this.#likes);
    }
}

class DBInteract {
    static converter;
    static collection;
    
    static getType(object){
        switch(true){
            case object instanceof Guest:
                 collection = guestCollection;
                 converter = guestConverter;
                break;
            case object instanceof Judge:
                collection = judgeCollection;
                converter = judgeConverter;

                break;
            case object instanceof Student:
                 collection = studentCollection;
                 converter = studentConverter;

                break;
            case object instanceof Project:
                 collection = projectCollection;
                 converter = projectCollection
                break;
            default:
                console.log("Not really sure what this object is. Aborting...")
                return;
        }
    }
    static async validate(object){
        getType(object);
        const document = doc(
            collection,
            object.id
            ).withConverter(this.converter);
        
        const snapshot = await getDoc(document); //snapshot.data() is the data
        return snapshot.exists();
    }

    static async getAll(object) {
        getType(object);

        const document = doc(
            collection,
            object.id
            ).withConverter(this.converter);
        
        const snapshot = await getDoc(document); //snapshot.data() is the data
        if(snapshot.exists()){
            return snapshot.data();
        }
        else{
            this.setAll(object);
            return object;
        }
    }
    static async setAll(object){
        this.getType(object);
        const document = doc(this.collection, object.id).withConverter(
            this.converter
          );
          await setDoc(document, object, { merge: true });
    }

    static async updateParameter(object, field, value){
        const document = doc(db, this.collection, object.id);
        await updateDoc(document, { [field]: value }, { merge: true });
    }
}

export { User, Guest, Project, Student, Judge, DBInteract };
