const { app, BrowserWindow } = require("electron");
const path = require("path");
const { ipcMain } = require("electron/main");
const fs = require("fs").promises;
const fsSync = require("fs");
const {readDirectoryAsync,readFileAsync} = require('../utilities/AsyncMethods')

let current_images = {};
let current_index;
let parallel_current_index;
let redirectWindow;

const createWindow = () => {
  const win = new BrowserWindow({
    title: "Images Switcher",
    width: 1300,
    height: 1000,
    webPreferences: {
      // nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
      // devTools: isDev,
      contextIsolation: true,
    },
  });

  win.loadURL(`file://${path.join(__dirname, "../index.html")}`);

  redirectWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 600,
    minHeight: 600,
    show : false
  });

  redirectWindow.loadURL(`file://${path.join(__dirname, "../parallel.html")}`);



};

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

//* listener per i path dal frontend
ipcMain.handle("display_first_images", async (event, args) => {
  const { path1, path2, index } = args;

  if (!current_index) current_index = index;

  let image1;
  let image2;

  const folder1_files = await readDirectoryAsync(path1);
  image1 = await readFileAsync(path1 + "/" + folder1_files[current_index]);
  // fsSync.writeFileSync(path.join(__dirname,"../images/current_1.jpg"), image1);

  const folder2_files = await readDirectoryAsync(path2);
  image2 = await readFileAsync(path2 + "/" + folder2_files[current_index]);
  // fsSync.writeFileSync(path.join(__dirname,"../images/current_2.jpg"), image2);

  return { status: "ok", current_index, image1, image2 };
});

ipcMain.handle("next_images", async (event, args) => {
  const { offset, path1, path2 } = args;
  let image1;
  let image2;

  const current_image = current_index + offset;
  current_index = current_image;

  const folder1_files = await readDirectoryAsync(path1);
  console.log("folder 1 files", folder1_files[current_index]);
  image1 = await readFileAsync(path1 + "/" + folder1_files[current_index]);
  // fsSync.writeFileSync(path.join(__dirname,"../images/current_1.jpg"), image1);

  const folder2_files = await readDirectoryAsync(path2);
  console.log("folder 2 files", folder2_files[current_index]);
  image2 = await readFileAsync(path2 + "/" + folder2_files[current_index]);
  // fsSync.writeFileSync(path.join(__dirname,"../images/current_2.jpg"), image2);

  return { status: "ok", current_index, image1, image2 };
});



//************* PARALLEL MODE ************************

ipcMain.handle("start_parallel_mode",(event,args) => {
  redirectWindow.show()
  return true
})


ipcMain.handle("parallel_next_images",async (event,args) => {
  const {path, offset} = args

  // prendi il path corrente, prendi index corrente prendi offset
  // leggi cartella
  // prendi immagine
  // ritorna immagine 

  let image1;

  const current_image = parallel_current_index + offset;
  parallel_current_index = current_image;

  const folder1_files = await readDirectoryAsync(path);
  console.log("parallel_mode_files", folder1_files[parallel_current_index]);
  image1 = await readFileAsync(path + "/" + folder1_files[parallel_current_index]);

  return { status: "ok", parallel_current_index, image1 };
})





async function readFile(filePath) {
  try {
    const data = await fs.readFile(filePath);
    console.log(data.toString());
  } catch (error) {
    console.error(`Got an error trying to read the file: ${error.message}`);
  }
}
