const indexLoaded = async () => {
  const addBtn = document.getElementById("addProject");
  const gridrow = document.getElementById("gallery-container-row");
  const input = document.getElementById("projectInputID");
  let projects = [];

  function redirectProjectWithParams(id) {
    const url = "../../frontend/html/project.html";
    window.location.href = `${url}?id=${id}`;
  }

  async function getGallery() {
    const projectsRef = await projectCollection
      .withConverter(projectConverter)
      .get();
    const projectsRefMapped = projectsRef.docs.map((doc) => doc.data());

    projectsRefMapped.forEach((project) => {
      project.name = project.name == " " ? "." : project.name;
      project.summary = project.summary == " " ? "." : project.summary;
      projects.push(project);

      const cardDiv = document.createElement("div");
      cardDiv.classList.add("card");
      cardDiv.style = "width: 18rem;";
      cardDiv.innerHTML = `
        <img src="${project.img}" class="img-thumbnail" style="width: 18rem; height: 18rem;" alt=".">
        <div class="card-body"> 
            <h5 class="card-title">${project.name}</h5>
            <p class="card-text">${project.summary}</p>
            <div class="card-footer">${project.likes}</div>
        </div>
        `;

      cardDiv.addEventListener("click", () => {
        redirectProjectWithParams(project.id);
      });
      gridrow.appendChild(cardDiv);
    });
  }

  await getGallery();

  console.log(projects);
};

const ProjectLoaded = async () => {
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
  getProject(id);
};
