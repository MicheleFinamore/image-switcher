const { app, BrowserWindow, dialog } = require("electron");
const path = require("path");
const { ipcMain } = require("electron/main");
const fs = require("fs").promises;
import { autoUpdater } from "electron-updater";
const {
  readDirectoryAsync,
  readFileAsync,
} = require("../utilities/AsyncMethods");

let state = {
  current_index: 0,
  parallel_current_index: 0,
  doubleFlag: false,
};
let mainWindow;
let parallel_current_index;
let parallelWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    title: "Images Comparator",
    width: 1300,
    height: 1000,
    minHeight : 850, 
    minWidth : 850,
    webPreferences: {
      // nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
      // devTools: isDev,
      contextIsolation: true,
    },
  });

  mainWindow.webContents.on('did-finish-load',() => {
    mainWindow.setTitle('Parallel Mode')
    // mainWindow.setMenu(null)
  })

  mainWindow.loadURL(`file://${path.join(__dirname, "../src/parallel.html")}`);
};

app.whenReady().then(() => {
  createWindow();

  autoUpdater.checkForUpdates();

});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})

autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
})

autoUpdater.on('update-downloaded', (info) => {
  autoUpdater.quitAndInstall();
})

function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send('message', text);
}

//************* DOUBLE MODE ************************
ipcMain.handle("display_first_images", async (event, args) => {
  const { path1, path2, index } = args;

  state.current_index = index;

  let image1;
  let image2;

  const folder1_files = await readDirectoryAsync(path1);
  console.log('folder_1_files', folder1_files);
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
  const { effectiveOffset, path1, path2 } = args;
  let image1;
  let image2;

  const current_image = state.current_index + effectiveOffset;
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
  const { effectiveOffset, path1, path2 } = args;
  let image1, image2;

  const current_image = state.current_index - effectiveOffset;
  state.current_index = current_image;

  const folder1_files = await readDirectoryAsync(path1);
  image1 = await readFileAsync(path1 + "/" + folder1_files[current_image]);

  const folder2_files = await readDirectoryAsync(path2);
  image2 = await readFileAsync(path2 + "/" + folder2_files[current_image]);

  return { status: "ok", image1, image2 };
});

ipcMain.handle("start_double_mode", (event, args) => {
  doubleWindow = new BrowserWindow({
    width: 1200,
    height: 1000,
    minWidth: 800,
    minHeight: 800,
    show: false,
    title : 'Parallel Mode',
    webPreferences: {
      // nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
      // devTools: isDev,
      contextIsolation: true,
    },
  });

  doubleWindow.loadURL(`file://${path.join(__dirname, "../src/double.html")}`);

  doubleWindow.webContents.on('did-finish-load',() => {
    doubleWindow.setTitle('Double Mode')
    // doubleWindow.setMenu(null)
  })
  doubleWindow.show();
  state.doubleFlag = true;
  return true;
});

//************* PARALLEL MODE ************************

ipcMain.handle("parallel_display_first_image", async (event, args) => {
  const { path, index } = args;
  state.parallel_current_index = index;

  let image;
  const folder = await readDirectoryAsync(path);
  image = await readFileAsync(path + "/" + folder[index]);

  return { status: "ok", parallel_current_index, image };
});

ipcMain.handle("parallel_next_images", async (event, args) => {
  const { path, effectiveOffset } = args;
  console.log('offset', effectiveOffset);

  let image1;

  const current_image = state.parallel_current_index + effectiveOffset;
  state.parallel_current_index = current_image;

  const folder_files = await readDirectoryAsync(path);
  // console.log(
  //   "parallel_mode_files",
  //   folder_files[state.parallel_current_index]
  // );

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
  const { effectiveOffset, path } = args;
  let image;
  const current_parallel_image = state.parallel_current_index - effectiveOffset;
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


//************* COMMON HANDLERS ************************

ipcMain.handle("showMessageBox", (event,args) => {

  if(args.window === 'parallel'){
    wind = mainWindow
  } else if(args.window === 'double'){
    wind = doubleWindow
  }


  dialog.showMessageBox(wind, {
    title: "Attenzione!",
    message: args.msg,
    type: args.type,
  });
  return;
})
