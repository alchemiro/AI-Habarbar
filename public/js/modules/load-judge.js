const nameDiv = document.getElementById("nametag");
const studentList = document.getElementById("studentList");
const sumDiv = document.getElementById("summarytag");
const imgObject = document.getElementById("projectImg");
const btn = document.getElementById("gradeButton");
const input = document.getElementById("gradeInput");
const thisJudgeGrade = document.getElementById("CurrentJudgeGrade");

const isAdmin = localStorage.getItem("UserType") === "admin";
const isJudge = localStorage.getItem("UserType") === "judge";
const isGuest = localStorage.getItem("UserType") === "guest";
const isStudent = localStorage.getItem("UserType") === "student";

const user_id = JSON.parse(localStorage.getItem("CurrentUser"));

function bailout() {
  window.location.href = "../../index.html";
}
function checkIfJudge() {
  if (!isJudge) return bailout();
}

async function getProject(id, nameDiv, sumDiv, imgObject, studentList) {
  const p = await getDocument(new Project(id));
  await find_students_project_in_judge(p).then((doc) => {
    doc.forEach((student) => {
      const li = document.createElement("li");
      li.textContent = `${student.id} - ${student.name}`;
      if (student.id == user_id) isOwnerStudent = true;
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
function judge_bailout() {
  const url = "../index.html";
  window.location.href = url;
}

const urlParams = new URLSearchParams(window.location.search);
var id = urlParams.get("id");
console.log(id);

async function find_students_project_in_judge(project) {
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

async function find_project_profile_grade(id) {
  // console.log(project.id);

  const gradesQuery = gradeCollection
    .where("project", "==", id.toString())

    .where("judge", "==", user_id.toString());

  // console.log(project.id);
  //   console.log("before query");
  var currentGrade;
  await gradesQuery
    .withConverter(gradeConverter)
    .get()
    .then((result) => {
      //   console.log(`🚀 ~ .then ~ result:`, result.empty);

      result.forEach((doc) => {
        console.log(doc.data());
        currentGrade = doc.data();
      });
    });
  //   console.log("after query");

  return Promise.resolve(currentGrade);
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

async function project_judge_load() {
  await find_project_profile_grade(id).then(
    (grade) => (thisJudgeGrade.textContent = grade.score)
  );

  await getProject(id, nameDiv, sumDiv, imgObject, studentList);

  btn.addEventListener("click", () => {
    console.log("test");
    uploadGrade(parseInt(input.value), id, user_id);
    window.location.reload();
  });
}
