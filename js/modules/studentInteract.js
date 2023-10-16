import { studentCollection, db, doc, setDoc, getDoc, updateDoc,} from "./database.js";
import { student } from "./users.js";

const studentConverter = {
    toFirestore: (student) => {
        return {
            id: student.id,
            name: student.name,
            password: student.password,
            likes: student.likes,
            ProjectID: student.ProjectID
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new student(
            data.id,
            data.name,
            data.password,
            data.likes,
            data.ProjectID,
        );
    },
};

async function validate(studentID) {
    const studentDocumentReference = doc(
        studentCollection,
        studentID
    ).withConverter(studentConverter);

    try {
        return studentnapshot.exists();
    } catch {
        return false;
    }
}

//pull entire student and if it doesn't exist, create one
async function pullStudent(studentID) {
    const studentDocumentReference = doc(
        studentCollection,
        studentID
    ).withConverter(studentConverter);

    try {
        const studentnapshot = await getDoc(studentDocumentReference);
        console.log(
            "A document with this ID exists, and the data has been retrieved and is being returned."
        );
        return studentnapshot.data();
    } catch {
        const newstudent = new student(studentID);
        pushstudent(newstudent);
        return newstudent;
    }
}

//push entire student - OVERWRITE
async function pushStudent(student) {
    const studentRef = doc(studentCollection, student.id).withConverter(
        studentConverter
    );

    await setDoc(studentRef, student, { merge: true });
}

//pull ambiguous parameter
async function pullStudentParam(studentID, field) {
    const student = pullstudent(studentID);
    return student[field];
}

//push ambiguous parameter
async function pushStudentParam(studentID, field, value) {
    const studentRef = doc(db, studentCollection, studentID);
    try {
        await updateDoc(studentRef, { [field]: value }, { merge: true });
    } catch {
        return "Something went wrong, push failed.";
    }
}

export { validate, pushStudentParam, pushStudent, pullStudentParam, pullStudent };