const user_id = JSON.parse(localStorage.getItem("CurrentUser"));
const isJudge = localStorage.getItem("UserType") == "judge";
const roundone = document.getElementById("gallery-round1");
const roundtwo = document.getElementById("gallery-round2");
const roundthree = document.getElementById("gallery-round3");

function judge_profile_bailout() {
  window.location.href = "/public/index.html";
}

if (!isJudge) judge_profile_bailout();

async function on_judge_profile_load() {
  const judge_obj = await judgeCollection
    .doc(user_id)
    .withConverter(judgeConverter)
    .get()
    .then((result) => {
      if (!result.empty) {
        return result.data();
      } else {
        judge_profile_bailout();
      }
    });
  console.log(judge_obj.toString());
  let project_distribution = 1;
  judge_obj.projects.forEach(async (projectId) => {
    console.log(projectId);
    const project_obj = await projectCollection
      .doc(projectId)
      .withConverter(projectConverter)
      .get()
      .then((result) => {
        if (!result.empty) {
          return result.data();
        }
      });
    const project_card = document.createElement("div");
    project_card.classList.add("card");
    project_card.style = "width: 18rem;";

    project_card.innerHTML = `
        <img src="${project_obj.img}" class="img-thumbnail" style="width: 18rem; height: 18rem;" alt=".">
        <div style="background-color:${project_obj.color}"class="card-body"> 
            <h3 class="card-title" style="color:${project_obj.textColor}">Name: ${project_obj.name}</h3>
            <h3 class="card-title" style="color:${project_obj.textColor}">ID: ${project_obj.id}</h3>
            <h5 class="card-text" style="color:${project_obj.textColor}">Summary: ${project_obj.summary}</h5>
            <div class="card-footer" style="color:${project_obj.textColor}">Likes: ${project_obj.likes}</div>
        </div>`;
    project_card.addEventListener("click", () => {
      window.location.href = `../projects/project-judge.html?id=${projectId}`;
    });
    let gridrow = roundone;
    if (
      project_distribution >= judge_obj.projects.length / 3 &&
      project_distribution < (2 * judge_obj.projects.length) / 3
    ) {
      gridrow = roundtwo;
    }
    if (
      project_distribution >= (2 * judge_obj.projects.length) / 3 &&
      project_distribution < judge_obj.projects.length
    ) {
      gridrow = roundthree;
    }
    gridrow.appendChild(project_card);
    project_distribution++;
    // console.log(project_obj.toString());
  });
}
//   if (!user_id) {
//     judge_profile_bailout();
//   } else {
//   }
// }
