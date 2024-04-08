function returnType() {
  const userName = localStorage.getItem("CurrentUser");
  const userType = localStorage.getItem("UserType");
  const passed = false;
  // const userPass = localStorage.getItem("UserPassword");

  if (!passed) {
    //bailout function
  }

  switch (userType) {
  }
}

function redirectUser() {
  const userType = localStorage.getItem("UserType");
  try {
    authenticate();
  } catch (e) {
    console.log(e);
  } finally {
    const up = new URLSearchParams(window.location.search);

    // console.log(`🚀 ~ redirectUser ~ up:`, up);
    let projectID = up.get("id");
    if (!projectID) projectID = 0;

    // console.log(`🚀 ~ redirectUser ~ projectID:`, projectID);

    window.location.href = `../projects/project-${userType}.html?id=${projectID}`;
  }
}
