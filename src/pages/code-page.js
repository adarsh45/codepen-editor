import { getCodeById, savePreviewImage } from "../utils/api";
import { debounce } from "../utils/common";
import eventEmitter from "../utils/event-emitter";

class CodePage {
  constructor(el) {
    this.el = el;
    this.pageTitle = "";
    this.id = undefined;
    this.previewImage = undefined;

    eventEmitter.on("save-code", (r) => {
      console.log("saving", r);
      this.saveCode();
    });
  }

  loadFile(file) {
    this.id = file.id;
    this.pageTitle = file.pageTitle || "";
    document.title = "CodePen - " + this.pageTitle;
    this.htmlEditor.getDoc().setValue(file.html);
    this.cssEditor.getDoc().setValue(file.css);
    this.jsEditor.getDoc().setValue(file.js);
    this.executeCode();
  }

  saveCode() {
    console.log(this.id);
    if (!this.id) {
      // this is new file
      let title = prompt("Please enter a title!");
      if (!title) return alert("Invalid title!");

      this.id = new Date().getTime();

      let code = {
        id: this.id,
        pageTitle: title,
        html: this.htmlEditor.getValue(),
        css: this.cssEditor.getValue(),
        js: this.jsEditor.getValue(),
      };

      console.log(code);
      this.pageTitleElement.textContent = this.pageTitle;
      document.title = this.pageTitle;

      eventEmitter.emit("create-code", code);
    } else {
      //update existing code
      let code = getCodeById(this.id);
      code.html = this.htmlEditor.getValue();
      code.css = this.cssEditor.getValue();
      code.js = this.jsEditor.getValue();

      console.log("updating the code");
      eventEmitter.emit("update-code", code);
    }
    savePreviewImage(this.id, this.previewImage);
  }

  executeCode() {
    const iframeDocument = this.previewFrame.contentDocument;

    const content = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.pageTitle}</title>
    <style>
    ${this.cssEditor.getValue()}
    </style>
</head>
<body>
    ${this.htmlEditor.getValue()}
    <script>
    ${this.jsEditor.getValue()}
    </script>
</body>
</html>
    `;
    iframeDocument.open();
    iframeDocument.write(content);
    iframeDocument.close();

    html2canvas(iframeDocument.body).then((canvas) => {
      canvas.style.width = canvas.width / 2; // show at 50% on screen
      canvas.style.height = canvas.height / 2;
      const dataURL = canvas.toDataURL("image/png");
      this.previewImage = dataURL;
    });
  }

  componentMounted() {
    this.htmlCode = document.querySelector("#htmlCode");
    this.cssCode = document.querySelector("#cssCode");
    this.jsCode = document.querySelector("#jsCode");
    this.previewFrame = document.querySelector("#resultIframe");
    this.pageTitleElement = document.querySelector("#pageTitle");

    this.htmlEditor = CodeMirror.fromTextArea(this.htmlCode, {
      lineNumbers: true,
      mode: "htmlmixed",
      tabSize: 2,
      lineWrapping: false,
      theme: "material",
    });

    this.cssEditor = CodeMirror.fromTextArea(this.cssCode, {
      lineNumbers: true,
      mode: "css",
      tabSize: 2,
      lineWrapping: false,
      theme: "material",
    });

    this.jsEditor = CodeMirror.fromTextArea(this.jsCode, {
      lineNumbers: true,
      mode: "javascript",
      tabSize: 2,
      lineWrapping: false,
      theme: "material",
    });

    const delayedFunc = debounce((e) => {
      // console.log(e.target.value);
      this.executeCode();
    }, 500);

    [this.htmlEditor, this.cssEditor, this.jsEditor].forEach((code) => {
      code.on("keyup", delayedFunc);
    });

    this.executeCode();
  }

  render() {
    const h = `
    <div class="app-area" data-app>
        <div class="code-area-container">
          <div class="code-area code-area-html ">
            <h4 class="code-title">HTML</h4>
            <div>
              <textarea id="htmlCode" rows="10"><h1>Welcome</h1></textarea>
            </div>
          </div>
        
          <div class="code-area code-area-css">
            <h4 class="code-title">CSS</h4>
            <div>
              <textarea id="cssCode" rows="10"></textarea>
            </div>
          </div>
        
          <div class="code-area code-area-js">
            <h4 class="code-title">JAVASCRIPT</h4>
            <div>
              <textarea id="jsCode" rows="10"></textarea>
            </div>
          </div>
        </div>
        <div id="resize-preview" class="resizer" data-direction="horizontal">
        </div>
        <div class="code-preview">
          <iframe id="resultIframe"></iframe>
        </div>
      </div>
          `;

    document.querySelector(this.el).innerHTML = h;
    this.componentMounted();
    return this;
  }
}

export default CodePage;
