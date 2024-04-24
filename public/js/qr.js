const fs = require("fs");

// Data which will write in a file.
let data = "Learning how to write in a file.";

// Write data in 'Output.txt' .
fs.writeFile("Output.txt", data, (err) => {
  // In case of a error throw err.
  if (err) throw err;
});

function domReady(fn) {
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    setTimeout(fn, 1000);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

domReady(function () {
  // If found you qr code
  function onScanSuccess(decodeText, decodeResult) {
    window.location.href = decodeText;
  }

  let htmlscanner = new Html5QrcodeScanner("my-qr-reader", {
    fps: 10,
    qrbos: 250,
  });
  htmlscanner.render(onScanSuccess);
});

async function exportQRs() {
  const projectsRef = await projectCollection
    .withConverter(projectConverter)
    .get();
  const projects = projectsRef.docs.map((doc) => doc.data());
  const projectlinks = [];
  projects.forEach((project) => {
    projectlinks.push(
      `https://ai-habarbar.web.app/projects/project.html?id=${project.id}`
    );
  });
  console.log(`🚀 projectlinks:`, JSON.stringify(projectlinks));
}
