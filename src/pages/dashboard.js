import { deleteCode } from "../utils/api";
import eventEmitter from "../utils/event-emitter";

class Dashboard {
  constructor(el) {
    this.el = el;
  }

  componentMounted() {
    document.querySelector("body").addEventListener("click", (e) => {
      let t = e.target;
      // console.log("hello");
      if (t.classList.contains("btn-delete")) {
        let id = t.dataset.id;
        let confirmDelete = confirm(
          "Are you sure you want to delete this codepen?"
        );
        if (confirmDelete) {
          // eventEmitter.emit("code-delete", id);
          deleteCode(id);
          t.parentNode.remove();
        }
      } else if (t.classList.contains("card")) {
        let id = t.dataset.id;
        onNavigate(`/code/${id}`, true);
      }
    });
  }

  render(files) {
    const h = `
        <div class="dashboard-container">
        ${
          files && files.length
            ? files
                .map(
                  (f) =>
                    `
                    <div class="card" data-id="${f.id}">
                      <div class="hanger"></div>
                      <h2>${f.pageTitle}</h2>
                      <button class="btn-delete" data-id="${f.id}">&#10060;</button>
                    </div>
                    `
                )
                .join("")
            : `<h1>Create new codepen!</h1>`
        }
        </div>
        `;

    document.querySelector(this.el).innerHTML = h;
    this.componentMounted();
    return this;
  }
}

export default Dashboard;
