import { studentsCollection, db, doc, setDoc, getDoc } from "./database.js";

//pull entire student and if it doesn't exist, create one
async function pullstudent(studentID) {
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
async function pushstudent(student) {
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
async function pullParam(studentID, field) {
    const student = pullstudent(studentID);
    return student[field];
}

//push ambiguous parameter
async function pushParam(studentID, field, value) {
    const studentRef = doc(db, studentsCollection, studentID);
    try {
        await setDoc(studentRef, { [field]: value }, { merge: true });
    } catch {
        return "Something went wrong, push failed.";
    }
}

export { pushParam, pushstudent, pullParam, pullstudent };
