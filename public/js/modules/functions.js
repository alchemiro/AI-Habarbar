function redirectWithParams(id, key) {
  const url = `./${key}.html`;
  window.location.href = `${url}?id=${id}`;
}

async function createQRByPage() {
  return new QRCode("qr-code", {
    text: window.location.href,
    width: 256,
    height: 256,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });
}

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

async function FindJudgeByGrade(grade) {
  // console.log(grade.judge);
  let str = "";
  await judgeCollection
    .doc(`${grade.judge}`)
    .withConverter(judgeConverter)
    .get()
    .then((doc) => {
      // console.log(doc.data());
      const judge = doc.data();
      // console.log(judge.name);
      str += judge.name;
    }); //find judge associated with this grade
  return str;
}
async function searchProjects(what = "") {
  console.log(what);
  const gridrow = document.getElementById("gallery-container-row");
  gridrow.innerHTML = ``;
  const projectsRef = await projectCollection
    .withConverter(projectConverter)
    .get();
  const projects = projectsRef.docs.map((doc) => doc.data());
  projects.forEach(async (project) => {
    proj = project.id.toString() + " " + project.name.toString();
    stu = await FindStudentsByProject(project).then((list) => {
      names = [];
      list.forEach((stu) => {
        names.push(stu.name);
      });
      return names.toString();
    });

    if (proj.includes(what) || stu.includes(what)) {
      project.name = project.name == " " ? "N/A" : project.name;
      project.summary = project.summary == " " ? "NONE" : project.summary;
      const cardDiv = document.createElement("div");
      cardDiv.classList.add("card");
      cardDiv.style = "width: 18rem;";
      cardDiv.innerHTML = `
        <img src="${project.img}" class="img-thumbnail" style="width: 18rem; height: 18rem;" alt=".">
        <div style="background-color:${project.color}"class="card-body"> 
            <h3 class="card-title" style="color:${project.textColor}">Name: ${project.name}</h3>
            <h3 class="card-title" style="color:${project.textColor}">ID: ${project.id}</h3>
            <h5 class="card-text" style="color:${project.textColor}">Summary: ${project.summary}</h5>
            <div class="card-footer" style="color:${project.textColor}">Likes: ${project.likes}</div>
        </div>`;
      cardDiv.addEventListener("click", () => {
        redirectWithParams(project.id, "project");
      });
      gridrow.appendChild(cardDiv);
    }
  });
}
const isAdmin = localStorage.getItem("UserType") === "admin";
const isJudge = localStorage.getItem("UserType") === "judge";
const isGuest = localStorage.getItem("UserType") === "guest";
const isStudent = localStorage.getItem("UserType") === "student";

const isLoggedIn = !(!isJudge && !isGuest && !isStudent && !isAdmin);

function checkIfAdmin() {
  if (!isAdmin) return bailout();
}
//pages that need admin permission:
function bailout() {
  const url = "../public/index.html";
  window.location.href = url;
}

const indexLoaded = async () => {
  navigate();
  const inp = document.getElementById("SearchInput");
  const btn = document.getElementById("SearchButton");
  searchProjects();
  btn.addEventListener("click", () => {
    searchProjects(inp.value);
  });
  // console.log(projects);
};

const ProjectLoaded = async () => {
  navigate();
  const urlParams = new URLSearchParams(window.location.search);
  const nameDiv = document.getElementById("nametag");
  const sumDiv = document.getElementById("summarytag");
  // const iddiv = document.getElementById("idtag");
  const imgObject = document.getElementById("projectImg");
  const studentList = document.getElementById("studentList");
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

  var id = urlParams.get("id");
  if (!id) window.location.href = "?id=100";
  // console.log(urlParams);

  // console.log(id);
  let isOwnerStudent = false;
  async function getProject(id) {
    const p = await getDocument(new Project(id));
    await FindStudentsByProject(p).then((doc) => {
      doc.forEach((student) => {
        const li = document.createElement("li");
        li.textContent = `${student.id} - ${student.name}`;
        if (student.id == localStorage.getItem("CurrentUser"))
          isOwnerStudent = true;
        studentList.appendChild(li);
      });
    });
    nameDiv.textContent = p.name;

    sumDiv.textContent = p.summary;
    imgObject.src = p.img;

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
  const projectTableExport = document.getElementById("ProjectTable");
  const ProjectRows = ProjectTable.getElementsByTagName("tr");

  const StudentTable = document.getElementById("StudentBody");
  const StudentRows = StudentTable.getElementsByTagName("tr");

  const JudgeTable = document.getElementById("JudgeBody");
  const JudgeRows = JudgeTable.getElementsByTagName("tr");

  const GuestTable = document.getElementById("GuestBody");
  const GuestRows = GuestTable.getElementsByTagName("tr");

  async function FindGradesByProject(project) {
    // console.log(project.id);
    const gradesQuery = gradeCollection.where(
      "project",
      "==",
      project.id.toString()
    );
    // console.log(project.id);
    const list = [];
    // console.log("before query");
    await gradesQuery
      .withConverter(gradeConverter)
      .get()
      .then((result) => {
        console.log(result.empty);
        result.forEach((doc) => {
          // console.log(doc.data());
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
      project.name = project.name == " " ? "none" : project.name;
      project.summary = project.summary == " " ? "N/A" : project.summary;
      const row = document.createElement("tr");

      const header = document.createElement("th");
      header.textContent = project.id;
      header.style.color = project.textColor;
      header.style.backgroundColor = project.color;

      const name = document.createElement("td");
      name.textContent = project.name;
      name.style.color = project.textColor;
      name.style.backgroundColor = project.color;

      const categ = document.createElement("td");
      categ.textContent = project.category;
      categ.style.color = project.textColor;
      categ.style.backgroundColor = project.color;

      const summary = document.createElement("td");
      summary.textContent = project.summary;
      summary.style.color = project.textColor;
      summary.style.backgroundColor = project.color;

      const students = document.createElement("td");
      students.textContent = "";
      students.style.color = project.textColor;
      students.style.backgroundColor = project.color;

      await FindStudentsByProject(project).then((document) => {
        document.forEach((student) => {
          students.textContent += student.name + ", ";
        });
      });

      const gradeRow = document.createElement("td");
      gradeRow.textContent = "";
      gradeRow.style.color = project.textColor;
      gradeRow.style.backgroundColor = project.color;
      await FindGradesByProject(project).then((document) => {
        document.forEach(async (grade) => {
          await FindJudgeByGrade(grade).then((jName) => {
            console.log(jName);
            gradeRow.textContent += jName + ":";
          });
          gradeRow.textContent += grade.score; //only after that, add the grade
        });
      });

      row.appendChild(header);
      row.appendChild(name);
      row.appendChild(categ);
      row.appendChild(students);
      row.appendChild(gradeRow);
      row.appendChild(summary);
      row.addEventListener("click", () => {
        redirectWithParams(project.id, "project");
      });
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

      const judgeRow = document.createElement("tr");

      const judgeHeader = document.createElement("th");
      judgeHeader.textContent = judge.id;
      judgeHeader.scope = "row";

      const judgeName = document.createElement("td");
      judgeName.textContent = judge.name;

      const judgeProjects = document.createElement("td");
      judgeProjects.textContent = `[${judge.projects}]`;

      judgeRow.appendChild(judgeHeader);
      judgeRow.appendChild(judgeName);
      judgeRow.appendChild(judgeProjects);

      JudgeTable.appendChild(judgeRow);
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
      <td>[${student.likes}]</td>
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
    const adminFetch = await judgeCollection
      .doc("admin")
      .withConverter(judgeConverter)
      .get()
      .then((document) => {
        return document.data();
      });
    // console.log(adminFetch);
    if (password == adminFetch.pass && id == adminFetch.name) {
      console.log("admin detected from firebase.");
      localStorage.setItem("CurrentUser", "admin");
      localStorage.setItem("UserType", "admin");
      return Promise.resolve(true);
    } else {
      const user =
        (await checkGuests(id, password)) ||
        (await checkStudents(id, password)) ||
        (await checkJudges(id, password));

      if (user) {
        console.log("User found:", user.toString());
        localStorage.setItem("CurrentUser", JSON.stringify(user.id));
        return Promise.resolve(true);
      } else {
        console.log("User not found");
        return Promise.resolve(false);
      }
    }
  }

  document.getElementById("logBTN").addEventListener("click", () => {
    // console.log("I AM HERE");
    const usernameValue = document.getElementById("username").value;
    const passwordValue = document.getElementById("password").value;
    const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
    const appendAlert = (message, type) => {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = [
        `<div class="alert ${type}" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        "</div>",
      ].join("");
      alertPlaceholder.append(wrapper);
    };
    checkExist(usernameValue, passwordValue).then((result) => {
      if (result) {
        window.location.href = "./index.html";
      } else {
        appendAlert(
          "NO SUCH USER EXIST!",
          "alert-danger d-flex align-items-center alert-dismissible"
        );
      }
    });
  });
};

const MyPageLoaded = async () => {
  navigate();
  const gridrow = document.getElementById("judge-container-row");

  async function GetProjectToGrade() {
    const projectsRef = await projectCollection
      .withConverter(projectConverter)
      .get();
    const projectsRefMapped = projectsRef.docs.map((doc) => doc.data());

    projectsRefMapped.forEach((project) => {
      project.name = project.name == " " ? "N/A" : project.name;
      project.summary = project.summary == " " ? "NONE" : project.summary;
      projects.push(project);

      const cardDiv = document.createElement("div");
      cardDiv.classList.add("card");
      cardDiv.style = "width: 18rem;";
      cardDiv.innerHTML = `
        <img src="${project.img}" class="img-thumbnail" style="width: 18rem; height: 18rem;" alt=".">
        <div class="card-body"> 
            <h3 class="card-title">${project.name}</h3>
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

  await GetProjectToGrade();
};
