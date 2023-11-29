// Create a class for the element
class ProjectElement extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });

    const title = document.createElement("project-title");
    title.setAttribute("title", "project title example");

    const subtitle = document.createElement("project-subtitle");
    subtitle.setAttribute("subtitle", "ppap");

    const projImg = document.createElement("project-image");

    let imgUrl;
    imgUrl = projImg.hasAttribute("src")
      ? projImg.getAttribute("src")
      : "../../frontend/img/pizza.jpg";

    projImg.src = imgUrl;
    const linkElem = document.createElement("link");
    console.log("created link element");
    linkElem.setAttribute("rel", "stylesheet");
    console.log("set rel attribute");
    linkElem.setAttribute("href", "../../frontend/css/project.css");
    console.log("set href attribute");
    shadow.appendChild(linkElem);
    console.log("Custom element added to page.");
  }

  disconnectedCallback() {
    console.log("Custom element removed from page.");
  }

  adoptedCallback() {
    console.log("Custom element moved to new page.");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} has changed.`);
  }
}
class ProjectImage extends HTMLImageElement {
  static observedAttributes = ["src"];
  constructor() {
    // Always call super first in constructor
    super();
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    let imgUrl;
    imgUrl = this.hasAttribute("src")
      ? this.getAttribute("src")
      : "../../frontend/img/pizza.jpg";

    const img = document.createElement("img");
    img.src = imgUrl;

    shadow.appendChild(img);
    console.log("Custom element added to page.");
  }

  disconnectedCallback() {
    console.log("Custom element removed from page.");
  }

  adoptedCallback() {
    console.log("Custom element moved to new page.");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} has changed.`);
  }
}

class ProjectTitle extends HTMLParagraphElement {
  static observedAttributes = ["title"];
  constructor() {
    // Always call super first in constructor
    super();
  }

  connectedCallback() {
    console.log("Custom element added to page.");
  }

  disconnectedCallback() {
    console.log("Custom element removed from page.");
  }

  adoptedCallback() {
    console.log("Custom element moved to new page.");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} has changed.`);
  }
}

class ProjectSubtitle extends HTMLParagraphElement {
  static observedAttributes = ["subtitle"];
  constructor() {
    // Always call super first in constructor
    super();
  }

  connectedCallback() {
    console.log("Custom element added to page.");
  }

  disconnectedCallback() {
    console.log("Custom element removed from page.");
  }

  adoptedCallback() {
    console.log("Custom element moved to new page.");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} has changed.`);
  }
}

customElements.define("student-project", ProjectElement);
customElements.define("project-title", ProjectTitle, { extends: "p" });
customElements.define("project-subtitle", ProjectSubtitle, { extends: "p" });
customElements.define("project-image", ProjectImage, { extends: "img" });
