// const firefile = document.getElementById("local-firefile");
// console.log(firefile);
// window.getCollectionType();

const addBtn = document.getElementById("addProject");
const grid = document.getElementById("masonry-grid");
const input = document.getElementById("projectInputID");

addBtn.addEventListener("click", async () => {
  // if (!input.value) return console.log("break!");
  // let proj = new Project(input.value);

  // getDocument(proj).then((project) => {
  //   // console.log(gotProj.toString());
  //   grid.innerHTML += `<div class="grid-item special">
  //   <img src="../img/america.png" alt="pizza" />
  //   <p>${project.name}</p>
  //   <p>${project.summary}</p>
  //   <p>${project.likes}</p>
  //   </div>`;
  // });

  const projectsRef = await projectCollection
    .withConverter(projectConverter)
    .get();
  const projectsRefMapped = projectsRef.docs.map((doc) => doc.data());

  projectsRefMapped.forEach((element) => {
    console.log(element.toString());
    grid.innerHTML += `<div class="grid-item special">
      <img src="../img/america.png" alt="pizza" />
      <p>${element.name}</p>
      <p>${element.summary}</p>
      <p>${element.likes}</p>
      </div>`;
  });
});
