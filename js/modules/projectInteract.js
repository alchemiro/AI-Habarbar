import {
  projectCollection,
  db,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  projectConverter,
} from "./database.js";
import { Project } from "./users.js";

async function validate(projectID) {
  const projectDocumentReference = doc(
    projectCollection,
    projectID
  ).withConverter(projectConverter);

  const projectSnapshot = await getDoc(projectDocumentReference);

  try {
    return projectSnapshot.exists();
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
    const projectSnapshot = await getDoc(projectDocumentReference);
    console.log(
      "A document with this ID exists, and the data has been retrieved and is being returned."
    );
    return projectSnapshot.data();
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

export {
  validate,
  pushProjectParam,
  pushProject,
  pullProjectParam,
  pullProject,
};
