import { projectsCollection, db, doc, setDoc, getDoc } from "./database.js";

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
  const projectRef = doc(projectsCollection, project.id);
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

  await setDoc(projectRef, projectData, { merge: true });
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

export { pushParam, pushProject, pullParam, pullProject };
