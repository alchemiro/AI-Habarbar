//pages that need admin permission:
function bailout() {
  const url = "./index.html";
  window.location.href = url;
}
async function checkGuests(id, password) {
  console.log(id, password);
  const querySnapshot = await guestCollection
    .where("id", "==", id)
    .where("pass", "==", password)
    .withConverter(guestConverter)
    .get();

  if (querySnapshot.empty) {
    return null; // No user found
  } else {
    localStorage.setItem("UserType", "guest");

    return querySnapshot.docs[0].data(); // Return user data from the first match
  }
}

async function checkJudges(id, password) {
  console.log(id, password);

  const querySnapshot = await judgeCollection
    .where("id", "==", id)
    .where("pass", "==", password)
    .withConverter(judgeConverter)
    .get();

  if (querySnapshot.empty) {
    console.log("no judge found");

    return null; // No user found
  } else {
    localStorage.setItem("UserType", "judge");

    return querySnapshot.docs[0].data(); // Return user data from the first match
  }
}

async function checkStudents(id, password) {
  const querySnapshot = await studentCollection
    .where("id", "==", id)
    .where("pass", "==", password)
    .withConverter(studentConverter)
    .get();

  if (querySnapshot.empty) {
    console.log("no student found");
    return null; // No user found
  } else {
    localStorage.setItem("UserType", "student");
    return querySnapshot.docs[0].data(); // Return user data from the first match
  }
}

async function checkIfAdmin() {
  const adminFetch = await judgeCollection
    .doc("admin")
    .withConverter(judgeConverter)
    .get()
    .then((document) => {
      return document.data();
    });
  if (
    localStorage.getItem("CurrentUser") != adminFetch.name ||
    adminFetch.pass != localStorage.getItem("CurrentPassword")
  ) {
    // bailout();
  }
}

async function checkAdmin(id, password) {
  const adminFetch = await judgeCollection
    .doc("admin")
    .withConverter(judgeConverter)
    .get()
    .then((document) => {
      return document.data();
    });
  if (password == adminFetch.pass && id == adminFetch.name) {
    localStorage.setItem("CurrentUser", adminFetch.name);
    localStorage.setItem("UserType", "admin");
    localStorage.setItem("CurrentPassword", adminFetch.pass);
    return {
      id: adminFetch.name,
      pass: adminFetch.pass,
    };
  } else {
    return null;
  }
}

async function checkExist(id, password) {
  const user =
    (await checkGuests(id, password)) ||
    (await checkStudents(id, password)) ||
    (await checkAdmin(id, password)) ||
    (await checkJudges(id, password));

  if (user) {
    console.log("User found:", user.toString());
    localStorage.setItem("CurrentUser", JSON.stringify(user.id));
    localStorage.setItem("CurrentPassword", JSON.stringify(user.password));
    return Promise.resolve(true);
  } else {
    console.log("User not found");
    return Promise.reject(false);
  }
}

async function authenticate() {
  const loggedIn = await checkExist(
    localStorage.getItem("CurrentUser"),
    localStorage.getItem("CurrentPassword")
  ).then(() => {
    console.log;
  });
  switch (userType) {
    case "judge":
      // check creds in judge collection
      //if not real then log them out
      if (blah) {
        return false;
      } else break;
    case "guest":
      //check creds in guest collection
      //if not real then log them out
      if (blah) {
        return false;
      } else break;
    case "student":
      //check creds in student collection
      if (blah) {
        return false;
      } else break;
    case "admin":
      //check admin credentials
      if (blah) {
        return false;
      } else break;
    default:
      return false;
  }

  return true;
}
