import {
  projectsCollection,
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
      data.summary,
      data.img,
      data.round,
      data.category
    );
  },
};

//pull entire project and if it doesn't exist, create one
async function pullProject(projectID) {
  const projectDocumentReference = doc(
    projectsCollection,
    projectID
  ).withConverter(projectConverter);

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
  const projectRef = doc(projectsCollection, project.id).withConverter(
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
  const projectRef = doc(db, projectsCollection, projectID);
  try {
    await updateDoc(projectRef, { [field]: value }, { merge: true });
  } catch {
    return "Something went wrong, push failed.";
  }
}

export { pushProjectParam, pushProject, pullProjectParam, pullProject };
