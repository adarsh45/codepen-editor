import eventEmitter from "../utils/event-emitter";

class Header {
  constructor(el) {
    this.el = el;
  }

  // called after mounting
  componentMounted() {
    // TODO: solve multiple time click on save btn
    document.querySelector("#btnSaveCode").addEventListener("click", () => {
      eventEmitter.emit("save-code", Math.random() * 10);
    });
  }

  render() {
    const h = `
    <div class="crud-buttons">
        <h4 class="logo"><a data-route href="/#/">\<_CodePen\/\></a></h4>
        <span id="pageTitle"></span>
        <button id="btnNew" title="New Code Block" class="button secondary noborder">
            <a data-route href="#/new">&#x2795;</a>
        </button>
        <button id="btnSaveCode" title="Save Code Block" class="button secondary noborder">
            &#x1F4BE;
        </button>
      </div>
    `;

    document.querySelector(this.el).innerHTML = h;
    this.componentMounted();
    return this;
  }
}

export default Header;
