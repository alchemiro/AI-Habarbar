function redirectProjectWithParams(id) {
  const url = "../../frontend/html/project.html";
  window.location.href = `${url}?id=${id}`;
}
const checkLoggedIn = () => {
  const user = localStorage.getItem("CurrentUser");
  return typeof user == (Judge || Student || Guest);
};

function navigator() {
  const head = document.getElementById("sidebar");
  head.innerHTML = `
        <a href="./index.html">Home</a>
        <a href="./login.html">Login</a>
        <a href="./project.html">My Projects</a>
        <a href="./projectInput.html">Set and Get</a>
        <a href="./admin.html">Admin Dashboard</a>
        <a href="./apge.html">Excel Converter</a>`;

  const openButton = document.getElementById("openSidebar");
  openButton.addEventListener("click", toggleSidebar);

  function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    const sidebarWidth = sidebar.style.width;

    if (sidebarWidth === "" || sidebarWidth === "0px") {
      sidebar.style.width = "250px";
      openButton.style.left = "270px"; // Adjust button position
    } else {
      sidebar.style.width = "0";
      openButton.style.left = "20px"; // Reset button position
    }
  }

  window.addEventListener("click", function (event) {
    const sidebarWidth = document.querySelector(".sidebar").style.width;
    const openButton = document.getElementById("openSidebar");
    if (
      event.target !== openButton &&
      sidebarWidth !== "0px" &&
      !document.querySelector(".sidebar").contains(event.target)
    ) {
      document.querySelector(".sidebar").style.width = "0";
      openButton.style.left = "20px"; // Reset button position
    }
  });
}
function checkIfAdmin() {
  if (!checkLoggedIn()) return bailout();
  if (localStorage.getItem("CurrentUser") != "admin") {
    bailout();
  }
}
//pages that need admin permission:
function bailout() {
  const url = "../../frontend/html/index.html";
  window.location.href = url;
}

const indexLoaded = async () => {
  //   navigator();
  const addBtn = document.getElementById("addProject");
  const gridrow = document.getElementById("gallery-container-row");
  const input = document.getElementById("projectInputID");
  let projects = [];

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
  const iddiv = document.getElementById("idtag");
  const gradeDiv = document.getElementById("gradeDiv");
  const btn = document.getElementById("gradeButton");
  const input = document.getElementById("gradeInput");

  // console.log(urlParams.toString());

  const user = localStorage.getItem("CurrentUser");
  const type = localStorage.getItem("UserType");
  console.log(type);
  if (typeof user == Judge || localStorage.getItem("CurrentUser") == "admin") {
    gradeDiv.style.visibility = "visible";
  } else {
    gradeDiv.style.visibility = "hidden";
  }

  const id = urlParams.get("id");
  // console.log(id);

  async function getProject(id) {
    const p = await getDocument(new Project(id));

    nameDiv.textContent = p.name;

    sumDiv.textContent = p.summary;

    iddiv.textContent = id;

    //   if(loginIsGuest) show likes
    //   else if(loginIsJudge) show grading
  }

  async function uploadGrade(grade, project, judge, round) {
    //judge sets grade, if they haven't yet, create new document, otherwise replace their old one
    // console.log("hello");
    const gradesQuery = gradeCollection
      .withConverter(gradeConverter)
      .where("judge", "==", judge)
      .where("project", "==", project)
      .where("round", "==", round);
    await gradesQuery.get().then((snapshot) => {
      if (snapshot.empty) {
        //if no current judge grade, make a new admin grade
        gradeCollection.add({ temp: "temp" }).then((docRef) => {
          gradeCollection
            .doc(docRef.id)
            .withConverter(gradeConverter)
            .set(new Grade(docRef.id, judge, project, grade, round));
        });
        // console.log("empty and done");
      } else {
        snapshot.forEach((doc) => {
          //otherwise replace it
          // console.log(doc.data());
          gradeCollection
            .doc(doc.id)
            .withConverter(gradeConverter)
            .set(new Grade(doc.id, judge, project, grade, round));
        });
        // console.log("not empty and done");
      }
    });
  }

  async function adminGrade(grade, project) {
    //add admin grade (round = 0, judge = "admin")
    // const grade;
    const gradesQuery = gradeCollection
      .withConverter(gradeConverter)
      .where("project", "==", project);
    // console.log("doing");
    await gradesQuery.get().then((snapshot) => {
      if (snapshot.empty) {
        //if no current admin grade, make a new admin grade
        gradeCollection.add({ temp: "temp" }).then((docRef) => {
          gradeCollection
            .doc(docRef.id)
            .withConverter(gradeConverter)
            .set(new Grade(docRef.id, "admin", project, grade, 0));
        });
        // console.log("empty and done");
      } else {
        snapshot.forEach((doc) => {
          //otherwise replace it
          // console.log(doc.data());
          gradeCollection
            .doc(doc.id)
            .withConverter(gradeConverter)
            .set(new Grade(doc.id, "admin", project, grade, 0));
        });
        // console.log("not empty and done");
      }
    });
  }

  getProject(id);

  btn.addEventListener("click", () => {
    adminGrade(parseInt(input.value), id);
  });
};

const AdminLoaded = async () => {
  checkIfAdmin();

  const div = document.getElementById("holdstuff");

  const ProjectTable = document.getElementById("ProjectBody");
  const ProjectRows = ProjectTable.getElementsByTagName("tr");

  const StudentTable = document.getElementById("StudentBody");
  const StudentRows = StudentTable.getElementsByTagName("tr");

  const JudgeTable = document.getElementById("JudgeBody");
  const JudgeRows = JudgeTable.getElementsByTagName("tr");

  const GuestTable = document.getElementById("GuestBody");
  const GuestRows = GuestTable.getElementsByTagName("tr");

  async function FindStudentsByProject(project) {
    const studentsQuery = studentCollection.where("project", "==", project.id);
    // console.log("before query");
    const list = [];
    await studentsQuery
      .withConverter(studentConverter)
      .get()
      .then((queryResult) => {
        queryResult.forEach((doc) => {
          list.push(doc.data());
        });
      });
    // console.log("after query");
    return list;
  }

  async function getAllProjects() {
    const projectsRef = await projectCollection
      .withConverter(projectConverter)
      .get();
    const projectsRefMapped = projectsRef.docs.map((doc) => doc.data());

    projectsRefMapped.forEach(async (project) => {
      project.name = project.name == " " ? "." : project.name;
      project.summary = project.summary == " " ? "." : project.summary;
      const row = document.createElement("tr");

      const header = document.createElement("th");
      header.textContent = project.id;

      const name = document.createElement("td");
      name.textContent = project.name;

      const summary = document.createElement("td");
      summary.textContent = project.summary;

      const students = document.createElement("td");
      students.textContent = "";
      await FindStudentsByProject(project).then((document) => {
        document.forEach((student) => {
          students.textContent += student.name + ", ";
        });
        // console.log("click");
      });

      const grade = document.createElement("td");
      grade.textContent = "10";

      row.appendChild(header);
      row.appendChild(name);
      row.appendChild(students);
      row.appendChild(grade);
      row.appendChild(summary);
      ProjectTable.appendChild(row);
      // ProjectTable.innerHTML += `<tr onclick="FindStudentsByProject(project)">
      //               <th scope="row">${project.id}</th>
      //               <td>${project.name}</td>
      //               <td>student name</td>
      //               <td>100</td>
      //               <td>${project.summary}</td>
      //           </tr>`;
      // console.log("projectssssss");
    });
  }
  async function getAllJudges() {
    const judgesRef = await judgeCollection.withConverter(judgeConverter).get();
    const judgesRefMapped = judgesRef.docs.map((doc) => doc.data());

    judgesRefMapped.forEach((judge) => {
      // console.log(judge.toString());
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
      // console.log(student);
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

const LoginLoaded = async () => {
  navigator();
  async function checkGuests(id, password) {
    const querySnapshot = await guestCollection
      .where("id", "==", id)
      .where("pass", "==", password)
      .withConverter(guestConverter)
      .get();

    if (querySnapshot.empty) {
      return null; // No user found
    } else {
      localStorage.setItem("UserType", "Guest");

      return querySnapshot.docs[0].data(); // Return user data from the first match
    }
  }

  async function checkJudges(id, password) {
    const querySnapshot = await judgeCollection
      .where("id", "==", id)
      .where("pass", "==", password)
      .withConverter(judgeConverter)
      .get();

    if (querySnapshot.empty) {
      return null; // No user found
    } else {
      localStorage.setItem("UserType", "Judge");

      return querySnapshot.docs[0].data(); // Return user data from the first match
    }
  }

  async function checkStudents(id, password) {
    const querySnapshot = await studentCollection
      .where("id", "==", id)
      .where("pass", "==", password)
      .withConverter(studentConverter)
      .get();

    if (querySnapshot.empty) {
      return null; // No user found
    } else {
      localStorage.setItem("UserType", "Student");
      return querySnapshot.docs[0].data(); // Return user data from the first match
    }
  }

  async function checkExist(id, password) {
    if (id === "admin" && password === "admin") {
      console.log("Admin login detected");
      localStorage.setItem("CurrentUser", "admin");
    } else {
      const user =
        (await checkGuests(id, password)) ||
        (await checkStudents(id, password)) ||
        (await checkJudges(id, password));

      if (user) {
        console.log("User found:", user.toString());
        localStorage.setItem("CurrentUser", user);
      } else {
        console.log("User not found");
      }
    }
  }

  document.getElementById("logBTN").addEventListener("click", () => {
    console.log("heeeeeeee");
    const usernameValue = document.getElementById("username").value;
    const passwordValue = document.getElementById("password").value;

    checkExist(usernameValue, passwordValue);
  });
};
