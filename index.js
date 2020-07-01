const { BrowserWindow, app, Menu, ipcMain } = require("electron");
const fs = require("fs-extra");
const { FileManager } = require("./lib/FileManager");

app.on("ready", build_app);

async function build_app() {
  const app_window = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
  });

  app_window.loadFile("asset/index.html");

  const fileManager = new FileManager(app_window);

  // set open recent submenu
  let submenuOfOpenRecent = [];
  let paths = fileManager.readHistory();
  const allPaths = await paths;
  if (allPaths !== undefined) {
      allPaths.paths.map((path) => {
          submenuOfOpenRecent.push({ label: path, click: function () { fileManager.openRecentFile(path) } }, { type: 'separator' });
      })
  }

  // Declare all menu
  let menu_list = [
    {
      label: "File",
      submenu: [
        {
          label: "Open File...",
          click: function () {
            fileManager.openFileWindow();
          },
        },
        {
          label: "Open recent...",
          submenu: submenuOfOpenRecent,
        },
      ],
    },
  ];

  // set the menu to desktop app
  const menu_design = Menu.buildFromTemplate(menu_list);
  Menu.setApplicationMenu(menu_design);

  // recieve new file data and path throught main and renderer method
  ipcMain.on("newdata", (e, arg) => {
    fs.writeFile(arg.path, arg.file, (err) => {
      if (err) {
        throw err;
      }
      console.log("data saved");
    });
  });
}
