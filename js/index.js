import { DBInteract, Project, Student, Judge, Guest } from "./modules/users.js";
const masongrid = document.getElementById("masonry-grid");

const button = document.getElementById("projectButton");
const db = new DBInteract();

button.addEventListener("click", getAllProjects());

function getAllProjects() {
  var projectwrapper = document.createElement("div");
  projectwrapper.classList = ["grid-item"];

  var projectImage = document.createElement("img");

  var projectTitle = document.createElement("p");
  var projectSubtitle = document.createElement("p");

  var projecttemplate = new Project(1);
  db.getType(projecttemplate);
}
