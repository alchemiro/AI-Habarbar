// const db = app.firestore();
const projectCollection = db.collection("projects");
console.log("got proj collect");

const guestCollection = db.collection("guests");
console.log("got guest collect");

const judgeCollection = db.collection("judges");
console.log("got judge collect");

const studentCollection = db.collection("students");
console.log("got student collect");

const studentCollection = db.collection("grades");
console.log("got grades collect");

window.getCollectionType = () => {
  console.log("hello!");
};
