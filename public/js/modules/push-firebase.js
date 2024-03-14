//use with init-firebase.js and converters.js to send objects to firebase

async function sendProject(project) {
  await projectCollection
    .doc(project.id)
    .withConverter(projectConverter)
    .set(project)
    .then(() => {
      console.log("successfully sent project!");
    });
}
async function sendStudent(student) {
  await studentCollection
    .doc(student.id)
    .withConverter(studentConverter)
    .set(student)
    .then(() => {
      console.log("successfully sent student!");
    });
}
async function sendJudge(judge) {
  await judgeCollection
    .doc(judge.id)
    .withConverter(judgeConverter)
    .set(judge)
    .then(() => {
      console.log("successfully sent judge!");
    });
}
async function sendGuest(guest) {
  await guestCollection
    .doc(guest.id)
    .withConverter(guestConverter)
    .set(guest)
    .then(() => {
      console.log("successfully sent guest!");
    });
}
async function sendGrade(grade) {
  await gradeCollection
    .doc(grade.id)
    .withConverter(gradeConverter)
    .set(grade)
    .then(() => {
      console.log("successfully sent grade!");
    });
}

async function sendAny(object) {
  switch (true) {
    case object instanceof Project:
      //   console.log("click");
      await sendProject(object);
      return object;
    case object instanceof Student:
      await sendStudent(object);
      return object;
    case object instanceof Judge:
      await sendJudge(object);
      return object;
    case object instanceof Guest:
      await sendGuest(object);
      return object;
    case object instanceof Grade:
      await sendGrade(object);
      return object;
  }
}

// sendAny(new Project("10000"));
