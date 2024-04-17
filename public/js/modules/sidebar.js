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
  login.href = "/login.html";
  login.textContent = "Sign In";

  const lo = document.createElement("a");
  lo.textContent = "Sign Out";
  lo.href = "/index.html";
  lo.addEventListener("click", () => {
    localStorage.setItem("CurrentUser", "anon");
    localStorage.setItem("UserType", "guest");
    localStorage.setItem("CurrentPassword", "");
  });

  const index = document.createElement("a");
  index.href = "/index.html";
  index.textContent = "Home";

  const apge = document.createElement("a");
  apge.href = "/apge.html";
  apge.textContent = "Upload";

  let flag = false;
  const profile = document.createElement("a");
  profile.href = "/login.html";
  profile.textContent = "Profile";
  // console.log(localStorage.getItem("CurrentUser"));
  if (isAStudent || isAJudge) {
    profile.addEventListener("click", () => {
      profile.href = "#";
      if (isAStudent) {
        profile.href = "/profiles/student.html";
      }
      if (isAJudge) {
        profile.href = "/profiles/judge.html";
      }
    });
  } else if (isAnAdmin) {
    profile.textContent = "Admin Dashboard";
    profile.href = "/admin.html";
    flag = true;
  }

  const qrcode = document.createElement("a");
  qrcode.href = "/qrcode.html";
  qrcode.textContent = "Scan QR";

  head.appendChild(index);
  if (localStorage.getItem("CurrentUser") != "anon") {
    head.appendChild(lo);
  } else {
    head.appendChild(login);
  }
  if (isUserLoggedIn && !isAGuest) {
    head.appendChild(profile);
    if (flag) {
      head.appendChild(apge);
    }
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
