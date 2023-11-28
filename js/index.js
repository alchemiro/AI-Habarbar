
// console.log(studentCol);
function controlSidebar() {
  const navigation = document.getElementById("navigation");
  const sidebar = document.getElementById("mySidebar");
  const wheel = document.getElementById("wheel");
  const wheeltext = document.getElementById("wheeltext");

  console.log(document.getElementById("mySidebar").style.width);
  if (sidebar.style.width == "0px" || sidebar.style.width == "") {
    // wheel.style;
    wheel.classList.remove("fa-bars");
    wheel.classList.add("fa-arrow-right-to-bracket");
    sidebar.style.width = "40vw";
    navigation.style.marginLeft = "40vw";

    console.log("true");
  } else {
    // wheel.style.transform = "rotate(-270deg)";
    wheel.classList.remove("fa-arrow-right-to-bracket");
    wheel.classList.add("fa-bars");
    sidebar.style.width = "0px";
    navigation.style.marginLeft = "0px";
    console.log("false");
  }
}

