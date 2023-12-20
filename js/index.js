// const firefile = document.getElementById("local-firefile");
// console.log(firefile);
// window.getCollectionType();

const addBtn = document.getElementById("addProject");
const grid = document.getElementById("masonry-grid");

addBtn.addEventListener("click", () => {
  let proj = new Project("1");

  getDocument(proj).then((gotProj) => {
    console.log(gotProj.toString());
    grid.innerHTML += `<div class="grid-item special">
  <img src="../img/america.png" alt="pizza" />
  <p>${gotProj.name}</p>
  <p>${gotProj.summary}</p>
  <p>${gotProj.likes}</p>
  </div>`;
  });
});
