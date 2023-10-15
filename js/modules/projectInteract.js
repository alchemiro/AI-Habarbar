import {
    projectCollection,
    db,
    doc,
    setDoc,
    getDoc,
    updateDoc,
} from "./database.js";
import { Project } from "./users.js";

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
            data.grades,
            data.likes
            data.summary,
            data.img,
            data.round,
            data.category
        );
    },
};

async function validate(projectID){    const projectDocumentReference = doc(
        projectCollection,
        projectID
    ).withConverter(projectConverter);

    try {
        return projectnapshot.exists();
    } catch {
        return false;
    }
}

//pull entire project and if it doesn't exist, create one
async function pullProject(projectID) {
    const projectDocumentReference = doc(
        projectCollection,
        projectID
    ).withConverter(projectConverter);

    try {
        const projectnapshot = await getDoc(projectDocumentReference);
        console.log(
            "A document with this ID exists, and the data has been retrieved and is being returned."
        );
        return projectnapshot.data();
    } catch {
        const newProject = new Project(projectID);
        pushProject(newProject);
        return newProject;
    }
}

//push entire project - OVERWRITE
async function pushProject(project) {
    const projectRef = doc(projectCollection, project.id).withConverter(
        projectConverter
    );

    await setDoc(projectRef, project, { merge: true });
}

//pull ambiguous parameter
async function pullProjectParam(projectID, field) {
    const project = pullProject(projectID);
    return project[field];
}

//push ambiguous parameter
async function pushProjectParam(projectID, field, value) {
    const projectRef = doc(db, projectCollection, projectID);
    try {
        await updateDoc(projectRef, { [field]: value }, { merge: true });
    } catch {
        return "Something went wrong, push failed.";
    }
}

export { validate, pushProjectParam, pushProject, pullProjectParam, pullProject };
