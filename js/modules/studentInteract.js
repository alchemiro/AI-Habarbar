import { studentCollection, db, doc, setDoc, getDoc } from "./database.js";

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

//pull entire student and if it doesn't exist, create one
async function pullStudent(studentID) {
  const studentDocumentReference = doc(studentCollection, studentID);

  try {
    const studentSnapshot = await getDoc(studentDocumentReference);
    console.log(
      "A document with this ID exists, and the data has been retrieved and is being returned."
    );
    return studentSnapshot.data();
  } catch {
    return "No such document exists, or a different error occured.";
  }
}

//push entire student - OVERWRITE
async function pushStudent(student) {
  const studentRef = doc(studentsCollection, student.id);
  const studentData = {
    id: student.id,
    password: student.password,
    name: student.name,
    ProjectID: student.ProjectID,
    likes: student.likes,
  };

  await setDoc(studentRef, studentData, { merge: true });
}

//pull ambiguous parameter
async function pullStudentParam(studentID, field) {
  const student = pullStudent(studentID);
  return student[field];
}

//push ambiguous parameter
async function pushStudentParam(studentID, field, value) {
  const studentRef = doc(db, studentsCollection, studentID);
  try {
    await setDoc(studentRef, { [field]: value }, { merge: true });
  } catch {
    return "Something went wrong, push failed.";
  }
}

export { pushStudentParam, pushStudent, pullStudentParam, pullStudent };
