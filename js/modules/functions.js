let projects = [];
function redirectWithParams(id, key) {
  const url = `../../frontend/html/${key}.html`;
  window.location.href = `${url}?id=${id}`;
}
function searchProjects(what) {
  for (const project in projects) {
    const values = Object.values(projects[project]);
    for (const value of values) {
      if (value.includes(what)) {
        console.log(`Found '${what}' in project '${project}'`);
        return true;
      }
    }
  }
  console.log(`'${what}' not found in any project`);
  return false;
}
const isAdmin = localStorage.getItem("UserType") === "admin";
const isJudge = localStorage.getItem("UserType") === "judge";
const isGuest = localStorage.getItem("UserType") === "guest";
const isStudent = localStorage.getItem("UserType") === "student";

const isLoggedIn = !(!isJudge && !isGuest && !isStudent && !isAdmin);

function navigate() {
  const head = document.getElementById("sidebar");
  head.innerHTML = "";

  const login = document.createElement("a");
  login.href = "./login.html";
  login.textContent = "Sign In";

  const lo = document.createElement("a");
  lo.textContent = "Sign Out";
  lo.href = "./index.html";
  lo.addEventListener("click", () => {
    logout();
  });

  const index = document.createElement("a");
  index.href = "./index.html";
  index.textContent = "Home";

  const profile = document.createElement("a");
  profile.textContent = "Profile";
  console.log(localStorage.getItem("CurrentUser"));
  if (isStudent || isJudge) {
    profile.addEventListener("click", () => {
      redirectWithParams(
        localStorage.getItem("CurrentUser"),
        localStorage.getItem("UserType")
      );
    });
  } else if (isAdmin) {
    profile.textContent = "Admin Dashboard";
    profile.href = "./admin.html";
  }

  const input = document.createElement("a");
  input.href = "./projectInput.html";
  input.textContent = "Project Input";

  head.appendChild(index);
  // if (isLoggedIn){head.appendChild(lo)};
  // else {head.appendChild(login)};
  console.log(isLoggedIn);
  if (isLoggedIn) {
    // console.log("I am signed in");
    head.appendChild(lo);
  } else {
    // console.log("I am not signed in");

    head.appendChild(login);
  }

  if (isLoggedIn && !isGuest) {
    // console.log("I am signed in but not a guest");

    head.appendChild(profile);
  }

  if (isAdmin) {
    // console.log("I am signed in as admin");

    head.appendChild(input);
  }

  // head.innerHTML = `
  //       <a href="./index.html">Home</a>
  //       <a href="./login.html">Login</a>
  //       <a href="./MyPage.html">My page</a>
  //       <a href="./projectInput.html">Set and Get</a>
  //       <a href="./admin.html">Admin Dashboard</a>
  //       <a href="./apge.html">Excel Converter</a>`;

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
  if (!isAdmin) return bailout();
}
//pages that need admin permission:
function bailout() {
  const url = "../../frontend/html/index.html";
  window.location.href = url;
}

const indexLoaded = async () => {
  navigate();
  const addBtn = document.getElementById("addProject");
  const gridrow = document.getElementById("gallery-container-row");
  const input = document.getElementById("projectInputID");

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
        redirectWithParams(project.id, "project");
      });
      gridrow.appendChild(cardDiv);
    });
  }

  await getGallery();

  // console.log(projects);
};

const ProjectLoaded = async () => {
  navigate();
  const urlParams = new URLSearchParams(window.location.search);
  const nameDiv = document.getElementById("nametag");
  const sumDiv = document.getElementById("summarytag");
  // const iddiv = document.getElementById("idtag");
  const gradeDiv = document.getElementById("gradeDiv");
  const btn = document.getElementById("gradeButton");
  const input = document.getElementById("gradeInput");

  // console.log(urlParams.toString());

  const user = localStorage.getItem("CurrentUser");
  const type = localStorage.getItem("UserType");
  if (isJudge || isAdmin) {
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

    // iddiv.textContent = id;

    //   if(loginIsGuest) show likes
    //   else if(loginIsJudge) show grading
  }

  async function uploadGrade(grade, project, judge) {
    //judge sets grade, if they haven't yet, create new document, otherwise replace their old one
    // console.log("hello");
    const gradesQuery = gradeCollection
      .withConverter(gradeConverter)
      .where("judge", "==", judge)
      .where("project", "==", project);
    await gradesQuery.get().then((snapshot) => {
      if (snapshot.empty) {
        //if no current judge grade, make a new admin grade
        gradeCollection.add({ temp: "temp" }).then((docRef) => {
          gradeCollection
            .doc(docRef.id)
            .withConverter(gradeConverter)
            .set(new Grade(docRef.id, judge, project, grade));
        });
        // console.log("empty and done");
      } else {
        snapshot.forEach((doc) => {
          //otherwise replace it
          // console.log(doc.data());
          gradeCollection
            .doc(doc.id)
            .withConverter(gradeConverter)
            .set(new Grade(doc.id, judge, project, grade));
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
    uploadGrade(parseInt(input.value), id, localStorage.getItem("CurrentUser"));
  });
};

const AdminLoaded = async () => {
  navigate();
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
    const list = [];
    await studentsQuery
      .withConverter(studentConverter)
      .get()
      .then((queryResult) => {
        queryResult.forEach((doc) => {
          list.push(doc.data());
        });
      });
    return list;
  }

  async function FindGradesByProject(project) {
    const gradesQuery = gradeCollection.where("project", "==", project.id);
    const list = [];
    await gradesQuery
      .withConverter(gradeConverter)
      .get()
      .then((result) => {
        result.forEach((doc) => {
          console.log(doc.data());
          list.push(doc.data());
        });
      });
    return list;
  }

  async function getAllProjects() {
    const projectsRef = await projectCollection
      .withConverter(projectConverter)
      .get();
    const projectsRefMapped = projectsRef.docs.map((doc) => doc.data());

    projectsRefMapped.forEach(async (project) => {
      project.name = project.name == " " ? "none" : project.name;
      project.summary = project.summary == " " ? "N/A" : project.summary;
      const row = document.createElement("tr");

      const header = document.createElement("th");
      header.textContent = project.id;

      const name = document.createElement("td");
      name.textContent = project.name;

      const summary = document.createElement("td");
      summary.textContent = project.summary;

      const students = document.createElement("td");
        students.textContent = "";

        const grade = document.createElement("td");
        grade.textContent = "";

      await FindStudentsByProject(project).then((document) => {
        document.forEach((student) => {
          students.textContent += student.name + ", ";
        });
      });

      
      await FindGradesByProject(project).then((document) => {
        document.forEach((grade) => {
          grade.textContent += grade.score + ",";
        });
      });

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
      guest.name = guest.name == " " ? "none" : guest.name;
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

function logout() {
  localStorage.setItem("CurrentUser", "logout");
  localStorage.setItem("UserType", "logout");
}
const LoginLoaded = async () => {
  navigate();
  async function checkGuests(id, password) {
    const querySnapshot = await guestCollection
      .where("id", "==", id)
      .where("pass", "==", password)
      .withConverter(guestConverter)
      .get();

    if (querySnapshot.empty) {
      return null; // No user found
    } else {
      localStorage.setItem("UserType", "guest");

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
      localStorage.setItem("UserType", "judge");

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
      localStorage.setItem("UserType", "student");
      return querySnapshot.docs[0].data(); // Return user data from the first match
    }
  }

  async function checkExist(id, password) {
    if (id === "admin" && password === "admin") {
      console.log("Admin login detected");
      localStorage.setItem("CurrentUser", "admin");
      localStorage.setItem("UserType", "admin");
    } else {
      const user =
        (await checkGuests(id, password)) ||
        (await checkStudents(id, password)) ||
        (await checkJudges(id, password));

      if (user) {
        console.log("User found:", user.toString());
        localStorage.setItem("CurrentUser", user.id);
      } else {
        console.log("User not found");
      }
    }
  }

  document.getElementById("logBTN").addEventListener("click", () => {
    const usernameValue = document.getElementById("username").value;
    const passwordValue = document.getElementById("password").value;

    checkExist(usernameValue, passwordValue);
  });
};

const MyPageLoaded = async () => {
  navigate();
};
