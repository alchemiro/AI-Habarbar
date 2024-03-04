const nameDiv = document.getElementById("nametag");
const studentList = document.getElementById("studentList");
const sumDiv = document.getElementById("summarytag");
const imgObject = document.getElementById("projectImg");
const btn = document.getElementById("gradeButton");
const input = document.getElementById("gradeInput");

const isAdmin = localStorage.getItem("UserType") === "admin";
const isJudge = localStorage.getItem("UserType") === "judge";
const isGuest = localStorage.getItem("UserType") === "guest";
const isStudent = localStorage.getItem("UserType") === "student";

const table = document.getElementById("adminProjectGradeTable");

function checkIfAdmin() {
  if (!isAdmin) return bailout();
}

async function getProject(id, nameDiv, sumDiv, imgObject, studentList) {
  const p = await getDocument(new Project(id));
  await find_students_project_in_admin(p).then((doc) => {
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

//pages that need admin permission:
function admin_project_bailout() {
  const url = "../index.html";
  window.location.href = url;
}

const urlParams = new URLSearchParams(window.location.search);
var id = urlParams.get("id");
console.log(id);

async function find_students_project_in_admin(project) {
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

async function find_project_profile_grades(id) {
  // console.log(project.id);
  const gradesQuery = gradeCollection.where("project", "==", id.toString());
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

  return Promise.resolve(list);
}

async function find_judge_in_project_profile(grade) {
  // console.log(grade.judge);
  let str = "";
  var id;
  await judgeCollection
    .doc(`${grade.judge}`)
    .withConverter(judgeConverter)
    .get()
    .then((doc) => {
      console.log(doc.data());
      const judge = doc.data();
      // console.log(judge.name);
      str += judge.name;
      id = judge.id;
    }); //find judge associated with this grade
  return { name: str, id: id };
}

async function uploadGrade(score, project, judge) {
  const gradesQuery = gradeCollection
    .withConverter(gradeConverter)
    .where("judge", "==", judge)
    .where("project", "==", project);
  // console.log("hello!");
  await gradesQuery.get().then((snapshot) => {
    if (snapshot.empty) {
      //if no current judge grade, make a new admin grade
      gradeCollection.add({ temp: "temp" }).then((docRef) => {
        gradeCollection
          .doc(docRef.id)
          .withConverter(gradeConverter)
          .set(new Grade(docRef.id, judge, project, score));
        // console.log("hello 2");
      });
      // console.log("empty and done");
    } else {
      snapshot.forEach((doc) => {
        //otherwise replace it
        // console.log(doc.data());
        gradeCollection
          .doc(doc.id)
          .withConverter(gradeConverter)
          .set(new Grade(doc.id, judge, project, score));
        // console.log("hello 3");
      });
      console.log("not empty and done");
    }
  });
}

async function project_admin_load() {
  await find_project_profile_grades(id).then((list) => {
    console.log(list);
    list.forEach(async (grade) => {
      const gradeRow = document.createElement("tr");
      const judgeNameTD = document.createElement("td");
      const judgeIDTD = document.createElement("td");
      const judgeGradeTD = document.createElement("td");

      await find_judge_in_project_profile(grade).then((jName) => {
        console.log(jName);
        judgeNameTD.textContent = jName.name;
        judgeIDTD.textContent = jName.id;
      });
      console.log(grade);
      judgeGradeTD.textContent = grade.score;
      gradeRow.appendChild(judgeIDTD);
      gradeRow.appendChild(judgeNameTD);
      gradeRow.appendChild(judgeGradeTD);

      table.appendChild(gradeRow);
    });
  });

  await getProject(id, nameDiv, sumDiv, imgObject, studentList);

  btn.addEventListener("click", () => {
    console.log("test");
    uploadGrade(parseInt(input.value), id, "0");
    window.location.reload();
  });
}
