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
    grid.innerHTML += `
    <div class="col-xl-3 col-md-4 col-sm-6">
                    <div class="card" style="width: 18rem;">
                        <img src= ${project.Photo} class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${project.name}</h5>
                            <p class="card-text">${project.summary}</p>
                            <div class="card-footer"> ${project.likes} </div>
                        </div>
                    </div>
                </div>
    `;
  });
});
