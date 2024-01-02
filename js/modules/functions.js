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

const AdminLoaded = async () => {
  const div = document.getElementById("holdstuff");

  const ProjectTable = document.getElementById("ProjectBody");
  const ProjectRows = ProjectTable.getElementsByTagName("tr");

  const StudentTable = document.getElementById("StudentBody");
  const StudentRows = StudentTable.getElementsByTagName("tr");

  const JudgeTable = document.getElementById("JudgeBody");
  const JudgeRows = JudgeTable.getElementsByTagName("tr");

  const GuestTable = document.getElementById("GuestBody");
  const GuestRows = GuestTable.getElementsByTagName("tr");

  async function getAllProjects() {
    const projectsRef = await projectCollection
      .withConverter(projectConverter)
      .get();
    const projectsRefMapped = projectsRef.docs.map((doc) => doc.data());

    projectsRefMapped.forEach((project) => {
      project.name = project.name == " " ? "." : project.name;
      project.summary = project.summary == " " ? "." : project.summary;
      ProjectTable.innerHTML += `<tr>
                    <th scope="row">${project.id}</th>
                    <td>${project.name}</td>
                    <td>student name</td>
                    <td>100</td>
                    <td>${project.summary}</td>
                </tr>`;
      console.log("projectssssss");
    });
  }
  async function getAllJudges() {
    const judgesRef = await judgeCollection.withConverter(judgeConverter).get();
    const judgesRefMapped = judgesRef.docs.map((doc) => doc.data());

    judgesRefMapped.forEach((judge) => {
      console.log(judge.toString());
      //judge.name = judge.name == " " ? "." : judge.name;
      JudgeTable.innerHTML += `<tr>
                    <th scope="row">${judge.id}</th>
                    <td>${judge.name}</td>
                    <td>none!</td>
                    <td>none!</td>
                </tr>`;
    });
  }

  async function getAllGuests() {
    const guestsRef = await guestCollection.withConverter(guestConverter).get();
    const guestRefMapped = guestsRef.docs.map((doc) => doc.data());
    guestRefMapped.forEach((guest) => {
      guest.name = guest.name == " " ? "." : guest.name;
      GuestTable.innerHTML += `<tr>
                    <th scope="row">${guest.id}</th>
                    <td>${guest.name}</td>
                    <td>none!</td>
                    <td>none!</td>
                </tr>`;
    });
  }

  async function getAllStudents() {
    const studentsRef = await studentCollection
      .withConverter(studentConverter)
      .get();
    const studentRefMapped = studentsRef.docs.map((doc) => doc.data());
      studentRefMapped.forEach((student) => {
          console.log(student);
      StudentTable.innerHTML += `<tr>
      <th scope="row">${student.id}</th>
      <td>${student.name}</td>
      <td>${student.project}</td>
      <td>${student.amount}</td>
  </tr>`;
    });
  }
  async function getAll() {
    getAllProjects();
    getAllJudges();
    getAllGuests();
    getAllStudents();
  }
  getAll();
};
