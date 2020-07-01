const { ipcRenderer } = require("electron");

let path = "";

ipcRenderer.on("filedata", (event, data) => {
  document.getElementById("editor").value = data.data;
  path = data.path;
});

document.addEventListener("keydown", function (e) {
  if (e.ctrlKey && e.which == 83) {
    let fileNewData = document.getElementById("editor").value;
    ipcRenderer.send("newdata", { path: path, file: fileNewData });
  }
});
