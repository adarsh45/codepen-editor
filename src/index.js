import Header from "./components/header.js";
import Dashboard from "./pages/dashboard.js";
import CodePage from "./pages/code-page.js";

import eventEmitter from "./utils/event-emitter";
import {
  getAllCodes,
  getCodeById,
  saveCodeToDB,
  updateCode,
} from "./utils/api";

const header = new Header("#header");
header.render();

const routes = {
  "/": function () {
    const view = new Dashboard("#root");
    const files = getAllCodes();
    view.render(files);
  },
  "/new": function () {
    const codePage = new CodePage("#root");
    codePage.render();
  },
  "/code/:id": function (id) {
    const codePage = new CodePage("#root");
    codePage.render();
    const file = getCodeById(id);
    codePage.loadFile(file);
  },
};

// listen for events
eventEmitter.on("create-code", (newCode) => {
  saveCodeToDB(newCode);
  alert("New code created!");
});

eventEmitter.on("update-code", (newCode) => {
  updateCode(newCode);
  alert("Code updated!");
});

// eventEmitter.on("code-delete", (id) => {
//   deleteCode(id);
//   const view = routes["/"];
//   if (view !== undefined) view();
// });

function parseRequestUrl(url) {
  const request = url.split("/");
  return {
    resource: request[1],
    id: request[2],
  };
}

window.onNavigate = (pathname, addToHistory = false) => {
  const req = parseRequestUrl(pathname);

  const parseUrl =
    (req.resource ? `/${req.resource}` : "/") + (req.id ? `/:id` : "");

  if (addToHistory) {
    window.history.pushState({}, pathname, window.location.origin + pathname);
  }

  let view = routes[parseUrl];
  if (view !== undefined) view(req.id);
};

window.onpopstate = () => {
  onNavigate(window.location.pathname, false);
};

const router = (e) => {
  console.log(window.location.pathname);

  document.querySelector("body").addEventListener("click", (e) => {
    if (e.target.hasAttribute("data-route")) {
      e.preventDefault();
      let hash = e.target.hash.substr(1);
      onNavigate(hash, true);
    }
  });

  onNavigate(window.location.pathname);
};

// window.addEventListener("locationchange", (e) => {
//   e.preventDefault();
//   console.log("nav called");
//   onNavigate(window.location.pathname, false);
// });

window.addEventListener("DOMContentLoaded", router);
