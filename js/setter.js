const projectID = document.getElementById("projectIDInput");
const projectLikes = document.getElementById("projectLikesInput");
const projectName = document.getElementById("projectNameInput");
const projectSumm = document.getElementById("projectSummaryInput");
const submitbtn = document.getElementById("submitButtonSetProject");
const getBtn = document.getElementById("projectSubmitOutput");
const projOutputID = document.getElementById("projectIDOutput");

submitbtn.addEventListener("click", () => {
  const id = projectID.value;
  const likes = projectLikes.value;
  const name = projectName.value;
  const summ = projectSumm.value;

  const proj = new Project(id, name, undefined, likes, summ);

  projectCollection
    .doc(proj.id)
    .withConverter(projectConverter)
    .set(proj)
    .then(() => {
      console.log("successfully wrote project?");
    });
});

getBtn.addEventListener("click", () => {
  const id = projOutputID.value;
  var project = new Project(id);
  //   const projRef = projectConverter.doc(id).withConverter(projectConverter);
  getDocument(project);
});
