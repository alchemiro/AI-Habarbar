const isAnAdmin = localStorage.getItem("UserType") === "admin";
const isAJudge = localStorage.getItem("UserType") === "judge";
const isAGuest = localStorage.getItem("UserType") === "guest";
const isAStudent = localStorage.getItem("UserType") === "student";

const isUserLoggedIn = !(!isAnAdmin && !isAJudge && !isAGuest && !isAStudent);
// console.log(studentCol);
function controlSidebar() {
  const navigation = document.getElementById("navigation");
  const sidebar = document.getElementById("mySidebar");
  const wheel = document.getElementById("wheel");

  // console.log(document.getElementById("mySidebar").style.width);
  if (sidebar.style.width == "0px" || sidebar.style.width == "") {
    // wheel.style;
    wheel.classList.remove("fa-bars");
    wheel.classList.add("fa-arrow-right-to-bracket");
    sidebar.style.width = "40vw";
    navigation.style.marginLeft = "40vw";

    // console.log("true");
  } else {
    // wheel.style.transform = "rotate(-270deg)";
    wheel.classList.remove("fa-arrow-right-to-bracket");
    wheel.classList.add("fa-bars");
    sidebar.style.width = "0px";
    navigation.style.marginLeft = "0px";
    // console.log("false");
  }
}

function navigate() {
  const head = document.getElementById("sidebar");
  head.innerHTML = "";

  const login = document.createElement("a");
  login.href = "/public/login.html";
  login.textContent = "Sign In";

  const lo = document.createElement("a");
  lo.textContent = "Sign Out";
  lo.href = "/public/index.html";
  lo.addEventListener("click", () => {
    logout();
  });

  const index = document.createElement("a");
  index.href = "/public/index.html";
  index.textContent = "Home";

  const profile = document.createElement("a");
  profile.href = "/public/login.html";
  profile.textContent = "Profile";
  // console.log(localStorage.getItem("CurrentUser"));
  if (isAStudent || isAJudge) {
    profile.addEventListener("click", () => {
      profile.href = "#";
      if (isAStudent) {
        profile.href = "/public/profiles/student.html";
      }
      if (isAJudge) {
        profile.href = "/public/profiles/judge.html";
      }
    });
  } else if (isAnAdmin) {
    profile.textContent = "Admin Dashboard";
    profile.href = "/public/admin.html";
  }

  const input = document.createElement("a");
  input.href = "/public/projectInput.html";
  input.textContent = "Project Input";

  const qrcode = document.createElement("a");
  qrcode.href = "/public/qrcode.html";
  qrcode.textContent = "Scan QR";

  head.appendChild(index);
  // if (isLoggedIn){head.appendChild(lo)};
  // else {head.appendChild(login)};
  // console.log(isUserLoggedIn);
  if (localStorage.getItem("CurrentUser") != "anon") {
    // console.log("I am signed in");
    head.appendChild(lo);
  } else {
    // console.log("I am not signed in");

    head.appendChild(login);
  }

  if (isUserLoggedIn && !isAGuest) {
    // console.log("I am signed in but not a guest");

    head.appendChild(profile);
  }

  if (isAnAdmin) {
    // console.log("I am signed in as admin");

    head.appendChild(input);
  }

  head.appendChild(qrcode);

  const openButton = document.getElementById("openSidebar");
  openButton.addEventListener("click", toggleSidebar);

  function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    const sidebarWidth = sidebar.style.width;

    if (sidebarWidth === "" || sidebarWidth === "0px") {
      sidebar.style.width = "250px";
      openButton.style.left = "270px"; // Adjust button position
    } else {
      sidebar.style.width = "0";
      openButton.style.left = "20px"; // Reset button position
    }
  }

  window.addEventListener("click", function (event) {
    const sidebarWidth = document.querySelector(".sidebar").style.width;
    const openButton = document.getElementById("openSidebar");
    if (
      event.target !== openButton &&
      sidebarWidth !== "0px" &&
      !document.querySelector(".sidebar").contains(event.target)
    ) {
      document.querySelector(".sidebar").style.width = "0";
      openButton.style.left = "20px"; // Reset button position
    }
  });
}
