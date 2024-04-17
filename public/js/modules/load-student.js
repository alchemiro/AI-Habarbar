const project_student_loaded = async () => {
  navigate();
  function checkIfStudent(id) {
    if (localStorage.getItem("UserType") != "student") {
      window.location.href = `./projects/project-${localStorage.getItem(
        "UserType"
      )}.html?id=${id}`;
    }
  }

  const urlParams = new URLSearchParams(window.location.search);
  const nameDiv = document.getElementById("nametag");
  const sumDiv = document.getElementById("summarytag");
  // const iddiv = document.getElementById("idtag");
  const imgObject = document.getElementById("projectImg");
  const studentList = document.getElementById("studentList");
  const btn = document.getElementById("likeBtn");
  // console.log(urlParams.toString());

  const user = localStorage.getItem("CurrentUser");
  const type = localStorage.getItem("UserType");
  const currentStudent = await getDocument(new Student(user));

  var id = urlParams.get("id");
  if (!id) id = 0;

  checkIfStudent(id);

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

    return Promise.resolve(p);
  }

  const project = await getProject(id).then((doc) => {
    return doc;
  });

  if (currentStudent.likes.includes(project.id)) {
    btn.classList.remove("fa-regular");
    btn.classList.add("fa-solid");
  }

  btn.addEventListener("click", async () => {
    if (!currentStudent.likes.includes(id)) {
      btn.classList.remove("fa-regular");
      btn.classList.add("fa-solid");

      if (currentStudent.likes.length >= 5) {
        //EXAMPLE VALUE, CHECK WITH EYAL
        return alert(
          "You've reached the maximum number of likes, please unlike other projects in order to like this one."
        );
      }
      project.likes += 1;
      currentStudent.likes.push(project.id);

      await projectCollection
        .doc(project.id)
        .withConverter(projectConverter)
        .set(project);

      await studentCollection
        .doc(currentStudent.id)
        .withConverter(studentConverter)
        .set(currentStudent);
    } else {
      btn.classList.add("fa-regular");
      btn.classList.remove("fa-solid");

      project.likes -= 1;
      currentStudent.likes = currentStudent.likes.filter(
        (like) => like !== project.id
      );

      await projectCollection
        .doc(project.id)
        .withConverter(projectConverter)
        .set(project);

      await studentCollection
        .doc(currentStudent.id)
        .withConverter(studentConverter)
        .set(currentStudent);
    }
  });
};
