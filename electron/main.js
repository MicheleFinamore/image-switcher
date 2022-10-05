const { app, BrowserWindow } = require("electron");
const path = require("path");
const { ipcMain } = require("electron/main");
const fs = require("fs").promises;
const fsSync = require('fs')


let current_images = {};
let current_index;

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
};

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

//* listener per i path dal frontend
ipcMain.handle("display_first_images", async (event, args) => {
  const { path1, path2,index} = args;
  
  if(!current_index) current_index = index

  let image1;
  let image2;

  const folder1_files = await  readDirectoryAsync(path1)
  image1 = await readFileAsync(path1 + '/' + folder1_files[current_index])
  // fsSync.writeFileSync(path.join(__dirname,"../images/current_1.jpg"), image1);

  const folder2_files = await readDirectoryAsync(path2)
  image2 = await readFileAsync(path2 + '/' + folder2_files[current_index])
  // fsSync.writeFileSync(path.join(__dirname,"../images/current_2.jpg"), image2);

  return {status : 'ok',current_index, image1, image2}
});

ipcMain.handle("next_images",async (event, args) => {
  const {offset,path1,path2} = args
  let image1;
  let image2;

  const current_image = current_index + offset
  current_index = current_image

  
  const folder1_files = await  readDirectoryAsync(path1)
  console.log('folder 1 files',folder1_files[current_index]);
  image1 = await readFileAsync(path1 + '/' + folder1_files[current_index])
  // fsSync.writeFileSync(path.join(__dirname,"../images/current_1.jpg"), image1);
  
  const folder2_files = await readDirectoryAsync(path2)
  console.log('folder 2 files',folder2_files[current_index]);
  image2 = await readFileAsync(path2 + '/' + folder2_files[current_index])
  // fsSync.writeFileSync(path.join(__dirname,"../images/current_2.jpg"), image2);

  return {status : 'ok', current_index,image1,image2}

});



const readDirectoryAsync = async (dirPath) => {
  try{
    const data = await fs.readdir(dirPath)
    return data
  }catch(error) {
    console.error(`Got an error trying to read the directory: ${error.message}`)
  }
}

const readFileAsync = async (filePath) => {
  try {
    const data = await fs.readFile(filePath)
    // console.log(data.toString('base64'));
    return data.toString('base64')
  }catch(error) {
    console.error(`Got an error trying to read the file: ${error.message}`);
  }
}


async function readFile(filePath) {
  try {
    const data = await fs.readFile(filePath);
    console.log(data.toString());
  } catch (error) {
    console.error(`Got an error trying to read the file: ${error.message}`);
  }
}
