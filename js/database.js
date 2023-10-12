import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    getDoc,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDbwHRNfml9PgY9iCBP-RXJKgza0cBhS2s",
    authDomain: "ai-habarbar.firebaseapp.com",
    databaseURL:
        "https://ai-habarbar-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "ai-habarbar",
    storageBucket: "ai-habarbar.appspot.com",
    messagingSenderId: "377582621016",
    appId: "1:377582621016:web:de9d0a40e1ffe4e7e2152d",
    measurementId: "G-H6QWR8BCR1",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const NumberOfJudges = 5;
const projectsCollection = collection(db, "projects");
const guestCollection = collection(db, "guests");
const judgesCollection = collection(db, "judges");
const studentCollection = collection(db, "students");

//pull entire project and if it doesn't exist, create one
async function pullProject(projectID) {
    const projectDocumentReference = doc(projectsCollection, projectID);

    try {
        const projectSnapshot = await getDoc(projectDocumentReference);
        console.log(
            "A document with this ID exists, and the data has been retrieved and is being returned."
        );
        return projectSnapshot.data();
    } catch {
        return "No such document exists, or a different error occured.";
    }
}

//push entire project - OVERWRITE
async function pushProject(project) {
    const proejctRef = doc(projectsCollection, project.id);
    const projectData = {
        id: project.id,
        name: project.name,
        grades: project.grades,
        likes: project.likes,
        summary: project.summary,
        img: project.img,
        category: project.category,
        round: project.round,
    };

    await setDoc(cityRef, projectData, { merge: true });
}

//pull ambiguous parameter
async function pullParam(projectID, field) {
    const project = pullProject(projectID);
    return project[field];
}

//push ambiguous parameter
async function pushParam(projectID, field, value) {
    const projectRef = doc(db, projectsCollection, projectID);
    try {
        await setDoc(projectRef, { [field]: value }, { merge: true });
    } catch {
        return "Something went wrong, push failed.";
    }
}
export {
    studentCollection,
    judgesCollection,
    guestCollection,
    projectsCollection,
    NumberOfJudges,
    app,
    db,
    firebaseConfig,
    pullParam,
    pullProject,
    pushParam,
    pushProject,
};
