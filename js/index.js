// const firefile = document.getElementById("local-firefile");
// console.log(firefile);
// window.getCollectionType();

const addBtn = document.getElementById("addProject");
const gridrow = document.getElementById("gallery-container-row");
const input = document.getElementById("projectInputID");

const redirectProjectWithParams = (id) => {
  const url = "../../frontend/html/project.html";
  window.location.href = `${url}?id=${id}`;
};

addBtn.addEventListener("click", async () => {
  const projectsRef = await projectCollection
    .withConverter(projectConverter)
    .get();
  const projectsRefMapped = projectsRef.docs.map((doc) => doc.data());

  projectsRefMapped.forEach((project) => {
    console.log(project.toString());

    // console.log(gotProj.toString());
    gridrow.innerHTML += `
    <div class="col offset-1">
        <div class="card" style="width: 18rem;" onclick="redirectProjectWithParams(${project.id})">
                <img src= ${project.Photo} class="img-thumbnail" style="width: 18rem; height: 18rem;" alt=".../">
          <div class="card-body">
              <h5 class="card-title">${project.name}</h5>
              <p class="card-text">${project.summary}</p>
              <div class="card-footer"> ${project.likes} </div>
            </div>
        </div>
     </div>`;
  });
});
