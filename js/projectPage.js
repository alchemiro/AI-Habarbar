const urlParams = new URLSearchParams(window.location.search);
const nameDiv = document.getElementById("nametag");
const sumDiv = document.getElementById("summarytag");
const imageDiv = document.getElementById("imagetag");
const likegradeDiv = document.getElementById("likegradediv");
// console.log(urlParams.toString());

const id = urlParams.get("id");
// console.log(id);

async function getProject(id) {
  const p = await getDocument(new Project(id));

  nameDiv.innerHTML += `<h2>${p.name}</h2>`;

  sumDiv.innerHTML += `<h2>${p.summary}</h2>`;

  imageDiv.innerHTML += `<img src="${p.img}" alt="Project Image">`;

  //   if(loginIsGuest) show likes
  //   else if(loginIsJudge) show grading
}

document.addEventListener("DOMContentLoaded", getProject(id));
