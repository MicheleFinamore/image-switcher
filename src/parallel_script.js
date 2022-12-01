const parallel_start_button = document.getElementById("parallel-start-button"); // inizio parallel mode
const parallel_input_1 = document.getElementById("parallel-input-1"); // input 1
const parallel_input_2 = document.getElementById("parallel-input-2"); // input 2
const parallel_input_index = document.getElementById("parallel-input-index"); // input index
const parallel_input_offset = document.getElementById("parallel-input-offset"); // input offset
const parallel_clear_button = document.getElementById("parallel-clear-button"); // clear button
const parallel_left_arrow = document.getElementById("parallel-left-arrow"); // left arrow
const parallel_right_arrow = document.getElementById("parallel-right-arrow"); // right arrow
const parallel_img_1 = document.getElementById("parallel-img-1"); // image
const parallel_compare_button = document.getElementById("compare-button"); // compare button
const current_folder_p = document.getElementById("current_folder"); // p tag per il folder corrente
const double_button = document.getElementById("parallel-double-button"); // button per double mode
const jump_button = document.getElementById("jump-button"); // button per usare l'offset e saltare
const {ipcRenderer} = window.require('electron')
ipcRenderer.on('message', function(event, text) {
console.log('messages from main', text);
})

let mainPath = 1;
parallel_input_index.value = "0";
parallel_input_offset.value = "2";

parallel_compare_button.addEventListener("click", compareHandler);
parallel_right_arrow.addEventListener("click", () => parallelRightArrowHandler(null));
parallel_left_arrow.addEventListener("click", () => parallelLeftArrowHandler(null));
parallel_clear_button.addEventListener("click", clearButtonHandler);
parallel_start_button.addEventListener("click", startButtonHandler);

double_button.addEventListener("click", () => {
  window.ipc_renderer.invoke("start_double_mode");
});

// handler bottone di start
async function startButtonHandler() {
  let path;

  if (parallel_input_1.value === "" || parallel_input_2.value === "" || parallel_input_index.value === "" || parallel_input_offset === "") {
    await window.ipc_renderer.invoke("showMessageBox", { msg: "Compila tutti i campi necessari", type: "warning", window: "parallel" });
    return;
  }

  if (mainPath === 1) {
    path = parallel_input_1.value;
  } else path = parallel_input_2.value;

  const folderName = path.substring(path.lastIndexOf("\\") + 1);
  current_folder_p.innerText = folderName;

  let index = parseInt(parallel_input_index.value);

  const res = await window.ipc_renderer.invoke("parallel_display_first_image", {
    path,
    index,
  });
  // if (res) console.log("res", res);

  parallel_img_1.src = `data:image/png;base64,${res.image}`;
}

//handler clear
function clearButtonHandler() {
  parallel_input_index.value = "";
  parallel_input_offset.value = "";
  parallel_input_1.value = "";
  parallel_input_2.value = "";

  parallel_img_1.src = "";
}

// parallel right arrow handler
async function parallelRightArrowHandler(offset) {
  if (parallel_input_1.value === "" || parallel_input_2.value === "") {
    await window.ipc_renderer.invoke("showMessageBox", { msg: "Compila tutti i campi necessari", type: "warning", window: "parallel" });
    return;
  }

  let path;
  let effectiveOffset;
  if (mainPath === 1) {
    path = parallel_input_1.value;
  } else {
    path = parallel_input_2.value;
  }
  console.log("offset in right arrow", offset);

  if (offset != null) {
    effectiveOffset = offset;
  } else {
    effectiveOffset = parseInt(parallel_input_offset.value);
  }

  let index = parseInt(parallel_input_index.value);
  let new_index = index + effectiveOffset;
  console.log("index", new_index);

  const res = await window.ipc_renderer.invoke("parallel_next_images", { path, effectiveOffset });

  // if (res) console.log("res in next images", res);

  parallel_img_1.src = `data:image/png;base64,${res.image1}`;
  parallel_input_index.value = new_index.toString();
}

// parallel left arrow handler
async function parallelLeftArrowHandler(offset = null) {
  if (parallel_input_1.value === "" || parallel_input_2.value === "") {
    await window.ipc_renderer.invoke("showMessageBox", { msg: "Compila tutti i campi necessari", type: "warning", window: "parallel" });
    return;
  }
  let path;
  let effectiveOffset;

  if (offset) {
    effectiveOffset = offset;
  } else {
    effectiveOffset = parseInt(parallel_input_offset.value);
  }

  let index = parseInt(parallel_input_index.value);
  let new_index = index - effectiveOffset;
  if (new_index < 0) {
    await window.ipc_renderer.invoke("showMessageBox", { msg: "Raggiunto index negativo", type: "error", window: "parallel" });
    return;
  }

  if (mainPath === 1) {
    path = parallel_input_1.value;
  } else {
    path = parallel_input_2.value;
  }

  parallel_input_index.value = new_index.toString();

  const res = await window.ipc_renderer.invoke("parallel_previous_images", { path, effectiveOffset });

  // if (res) console.log("res in next images", res);

  parallel_img_1.src = `data:image/png;base64,${res.image}`;
}

// switcha immagine e mostra quella della cartella opposta
async function compareHandler() {


  if (parallel_input_1.value === "" || parallel_input_2.value === "" || parallel_input_index.value === "" || parallel_input_offset === "") {
    await window.ipc_renderer.invoke("showMessageBox", { msg: "Compila tutti i campi necessari", type: "warning", window: "parallel" });
    return;
  }


  let path;
  let offset = parseInt(parallel_input_offset.value);
  let index = parseInt(parallel_input_index.value);

  if (mainPath === 1) {
    mainPath = 2;
    path = parallel_input_2.value;
  } else {
    mainPath = 1;
    path = parallel_input_1.value;
  }

  const lastItem = path.substring(path.lastIndexOf("\\") + 1);
  current_folder_p.innerText = lastItem;

  current_folder_p.style.transform = 'scale(1.2)'

  const res = await window.ipc_renderer.invoke("parallel_compare", {
    path
  });

  // if (res) console.log("res", res);
  parallel_img_1.src = `data:image/png;base64,${res.image}`;

  setTimeout(() => {
    current_folder_p.style.transform = 'scale(1)'
  },500)
}

document.onkeydown = checkKey;

function checkKey(e) {
  e = e || window.event;
  // console.log("checkKey", e);

  if (e.keyCode == "38") {
    // up arrow
  } else if (e.keyCode == "40") {
    // down arrow
  } else if (e.keyCode == "37") {
    parallelLeftArrowHandler(1);
  } else if (e.keyCode == "39") {
    parallelRightArrowHandler(1);
  } else if (e.keyCode == "33") {
    e.preventDefault();
    parallelRightArrowHandler(null);
  } else if (e.keyCode == "34") {
    e.preventDefault();
    parallelLeftArrowHandler(null);
  }
}
