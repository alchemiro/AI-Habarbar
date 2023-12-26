// const firefile = document.getElementById("local-firefile");
// console.log(firefile);
// window.getCollectionType();

const addBtn = document.getElementById("addProject");
const grid = document.getElementById("masonry-grid");
const input = document.getElementById("projectInputID");

addBtn.addEventListener("click", () => {
  if (!input.value) return console.log("break!");
  let proj = new Project(input.value);

  getDocument(proj).then((project) => {
    // console.log(gotProj.toString());
    grid.innerHTML += `<div class="grid-item special">
    <img src="../img/america.png" alt="pizza" />
    <p>${project.name}</p>
    <p>${project.summary}</p>
    <p>${project.likes}</p>
    </div>`;
  });
});
