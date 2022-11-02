const { app, BrowserWindow, dialog } = require("electron");
const path = require("path");
const { ipcMain } = require("electron/main");
const fs = require("fs").promises;
const {
  readDirectoryAsync,
  readFileAsync,
} = require("../utilities/AsyncMethods");

let state = {
  current_index: 0,
  parallel_current_index: 0,
  parallelFlag: false,
};
let mainWindow;
let parallel_current_index;
let parallelWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    title: "Images Comparator",
    width: 1300,
    height: 1000,
    webPreferences: {
      // nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
      // devTools: isDev,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL(`file://${path.join(__dirname, "../index.html")}`);
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

  state.current_index = index;

  let image1;
  let image2;

  const folder1_files = await readDirectoryAsync(path1);
  image1 = await readFileAsync(
    path1 + "/" + folder1_files[state.current_index]
  );
  // fsSync.writeFileSync(path.join(__dirname,"../images/current_1.jpg"), image1);

  const folder2_files = await readDirectoryAsync(path2);
  image2 = await readFileAsync(
    path2 + "/" + folder2_files[state.current_index]
  );
  // fsSync.writeFileSync(path.join(__dirname,"../images/current_2.jpg"), image2);

  return { status: "ok", image1, image2 };
});

ipcMain.handle("next_images", async (event, args) => {
  const { offset, path1, path2 } = args;
  let image1;
  let image2;

  const current_image = state.current_index + offset;
  state.current_index = current_image;

  const folder1_files = await readDirectoryAsync(path1);
  console.log("folder 1 files", folder1_files[current_image]);

  if (current_image > folder1_files.length) {
    console.log("raggiunto limite file");
    dialog.showMessageBox(mainWindow, {
      title: "Attenzione!",
      message: "Non ci sono più immagini nella cartella",
      type: "error",
    });
    return;
  }
  image1 = await readFileAsync(path1 + "/" + folder1_files[current_image]);
  // fsSync.writeFileSync(path.join(__dirname,"../images/current_1.jpg"), image1);

  const folder2_files = await readDirectoryAsync(path2);
  console.log("folder 2 files", folder2_files[current_image]);
  image2 = await readFileAsync(path2 + "/" + folder2_files[current_image]);
  // fsSync.writeFileSync(path.join(__dirname,"../images/current_2.jpg"), image2);

  return { status: "ok", image1, image2 };
});

ipcMain.handle("previous_images", async (event, args) => {
  const { offset, path1, path2 } = args;
  let image1, image2;

  const current_image = state.current_index - offset;
  state.current_index = current_image;

  const folder1_files = await readDirectoryAsync(path1);
  image1 = await readFileAsync(path1 + "/" + folder1_files[current_image]);

  const folder2_files = await readDirectoryAsync(path2);
  image2 = await readFileAsync(path2 + "/" + folder2_files[current_image]);

  return { status: "ok", image1, image2 };
});

//************* PARALLEL MODE ************************

ipcMain.handle("start_parallel_mode", (event, args) => {
  parallelWindow = new BrowserWindow({
    width: 1200,
    height: 1000,
    minWidth: 600,
    minHeight: 600,
    show: false,
    webPreferences: {
      // nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
      // devTools: isDev,
      contextIsolation: true,
    },
  });

  parallelWindow.loadURL(`file://${path.join(__dirname, "../parallel.html")}`);
  parallelWindow.show();
  state.parallelFlag = true;
  return true;
});

ipcMain.handle("parallel_display_first_image", async (event, args) => {
  const { path, index } = args;
  state.parallel_current_index = index;

  let image;
  const folder = await readDirectoryAsync(path);
  image = await readFileAsync(path + "/" + folder[index]);

  return { status: "ok", parallel_current_index, image };
});

ipcMain.handle("parallel_next_images", async (event, args) => {
  const { path, offset } = args;

  let image1;

  const current_image = state.parallel_current_index + offset;
  state.parallel_current_index = current_image;

  const folder_files = await readDirectoryAsync(path);
  console.log(
    "parallel_mode_files",
    folder_files[state.parallel_current_index]
  );

  if (current_image > folder_files.length) {
    dialog.showMessageBox(parallelWindow, {
      title: "Attenzione!",
      message: "Non ci sono più immagini nella cartella",
      type: "error",
    });
    return;
  }
  image1 = await readFileAsync(
    path + "/" + folder_files[state.parallel_current_index]
  );

  return { status: "ok", image1 };
});

ipcMain.handle("parallel_previous_images", async (event, args) => {
  const { offset, path } = args;
  let image;
  const current_parallel_image = state.parallel_current_index - offset;
  state.parallel_current_index = current_parallel_image;

  const folder_files = await readDirectoryAsync(path);
  image = await readFileAsync(
    path + "/" + folder_files[current_parallel_image]
  );

  return { status: "ok", image };
});

ipcMain.handle("parallel_compare", async (event, args) => {
  const { path } = args;
  let image;
  const current_image = state.parallel_current_index;
  const folder_files = await readDirectoryAsync(path);
  image = await readFileAsync(path + "/" + folder_files[current_image]);

  return { status: "ok", image };

  // prendi path index offset
  // apro cartella
  // leggo immagine
  // torno ok e immagine
});
