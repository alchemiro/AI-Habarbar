document.getElementById("convertButton").addEventListener("click", () => {
  const fileInput = document.getElementById("excelFile");
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

        // You can now use 'jsonData' as needed
        // document.getElementById("jsonResult").textContent = JSON.stringify(
        //   jsonData,
        //   null,
        //   2
        // );

        jsonData.forEach(async (project) => {
          console.log(project);
          const summary = project.summary ? project.summary : ".";
          const name = project.name ? project.name : ".";
          const likes = project.likes ? project.likes : 0;
          const image = project.img ? project.img : ".";
          const cat = project.category ? project.category : ".";
          const projectObj = new Project(
            `${project.id}`,
            name,
            likes,
            summary,
            image,
            cat
          );
          projectCollection
            .doc(projectObj.id)
            .withConverter(projectConverter)
            .set(projectObj);
        });

        console.log("done");

        // studentsJson[0]
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    reader.readAsArrayBuffer(file);
  }
});
