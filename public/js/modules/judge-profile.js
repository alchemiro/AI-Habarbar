const user_id = JSON.parse(localStorage.getItem("CurrentUser"));
const isJudge = localStorage.getItem("UserType") == "judge";
const maincontainer = document.getElementById("mainContainer");

function judge_profile_bailout() {
  window.location.href = "../index.html";
}

authenticate();
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
    project_card.classList.add("text-center");
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
    maincontainer.appendChild(project_card);
  });
}
