function sendProjectsToFirebase() {
  const fileInput = document.getElementById("excelFileProject");
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Assume the first sheet contains your data
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        jsonData.forEach(async (project) => {
          console.log(project);
          const summary = project.summary ? project.summary : ".";
          const name = project.name ? project.name : ".";
          const likes = project.likes ? project.likes : 0;
          const image = project.img ? project.img : ".";
          const cat = project.category ? project.category : ".";
          const projectObj = new Project(
            project.id,
            name,
            likes,
            summary,
            image,
            cat
          );
          projectCollection
            .doc(projectObj.id.toString())
            .withConverter(projectConverter)
            .set(projectObj);
        });
        console.log("done");
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };
    reader.readAsArrayBuffer(file);
  }
}
function sendStudentsToFirebase() {
  const fileInput = document.getElementById("excelFileStudent");
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Assume the first sheet contains your data
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        jsonData.forEach(async (student) => {
          console.log(student);

          const name = student.name;
          const id = student.id;
          const project = student.project;

          const studentObj = new Student(id, name, id, 0, project);

          studentCollection
            .doc(studentObj.id.toString())
            .withConverter(studentConverter)
            .set(studentObj);
        });
        console.log("done");
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };
    reader.readAsArrayBuffer(file);
  }
}
function sendJudgesToFirebase() {
  const fileInput = document.getElementById("excelFileJudge");
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Assume the first sheet contains your data
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        jsonData.forEach(async (judge) => {
          console.log(judge);

          const id = judge.id;
          const name = judge.name;

          const judgeObj = new Judge(id, name, id, []);

          judgeCollection
            .doc(judgeObj.id.toString())
            .withConverter(judgeConverter)
            .set(judgeObj);
        });
        console.log("done");
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };
    reader.readAsArrayBuffer(file);
  }
}
