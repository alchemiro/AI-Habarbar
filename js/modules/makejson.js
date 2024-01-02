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
        jsonData.forEach((student) => {
          const studentObj = new Student(
            `${student.id}`,
            `${student.name}`,
            `${student.pass}`,
            student.amount,
            [],
            `${student.projectID}`
          );
          studentCollection
            .doc(studentObj.id)
            .withConverter(studentConverter)
            .set(studentObj);
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
