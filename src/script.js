let current_images = {};
const input_1 = document.getElementById("input-1");
const input_2 = document.getElementById("input-2");
const input_index = document.getElementById("input-index");
const input_offset = document.getElementById("input-offset");
const start_button = document.getElementById("start-button");
const clear_button = document.getElementById("clear-button");
// const parallel_button = document.getElementById("parallel-button");
const left_arrow = document.getElementById("left-arrow");
const right_arrow = document.getElementById("right-arrow");
const img_1 = document.getElementById("img-1");
const img_2 = document.getElementById("img-2");



input_index.value = "0";
input_offset.value = "2";

start_button.addEventListener("click", startButtonHandler);
clear_button.addEventListener("click", clearButtonHandler);
right_arrow.addEventListener("click", rightArrowHandler);
left_arrow.addEventListener("click", leftArrowHandler);


// parallel_button.addEventListener('click', () => {
//   window.ipc_renderer.invoke('start_double_mode')
// })


async function leftArrowHandler(offset) {

  if(input_1.value === '' || input_2.value === '' || input_index.value === '' || input_offset.value === '' ){
    await window.ipc_renderer.invoke('showMessageBox', {msg : "Compila tutti i campi necessari", type : 'warning', window : 'double'})
    return
  } 

  let effectiveOffset;

  if(offset === null){
    effectiveOffset = parseInt(input_offset.value);
  } else {
    effectiveOffset = offset
  }
  let path1 = input_1.value;
  let path2 = input_2.value;
  let index = parseInt(input_index.value)
  let new_index = index - effectiveOffset
  if(new_index < 0){
    await window.ipc_renderer.invoke("showMessageBox", {msg : "Raggiunto index negativo", type : 'error', window : 'double'})
    return;
  } 
  input_index.value = (new_index).toString()


  const res = await window.ipc_renderer.invoke("previous_images", { path1, path2, effectiveOffset });

  // if (res) console.log("res in next images", res);

  img_1.src = `data:image/png;base64,${res.image1}`;
  img_2.src = `data:image/png;base64,${res.image2}`;
}

// handler freccia destra
async function rightArrowHandler(offset) {

  if(input_1.value === '' || input_2.value === '' || input_index.value === '' || input_offset.value === '' ){
    await window.ipc_renderer.invoke('showMessageBox', {msg : "Compila tutti i campi necessari", type : 'warning', window : 'double'})
    return
  } 

  let effectiveOffset;

  if(offset === null){
    effectiveOffset = parseInt(input_offset.value);
  } else {
    effectiveOffset = offset
  }

  let path1 = input_1.value;
  let path2 = input_2.value;
  
  let index = parseInt(input_index.value)
  
  const res = await window.ipc_renderer.invoke("next_images", { path1, path2, effectiveOffset, });
  
  if (res) console.log("res in next images", res);
  
  img_1.src = `data:image/png;base64,${res.image1}`;
  img_2.src = `data:image/png;base64,${res.image2}`;
  input_index.value = (effectiveOffset + index).toString()
}

// handler bottone di start
async function startButtonHandler() {

  if(input_1.value === '' || input_2.value === '' || input_index.value === ''){
    await window.ipc_renderer.invoke('showMessageBox', {msg : "Compila tutti i campi necessari", type : 'warning', window : 'double'})
    return 
  }

  let path1 = input_1.value;
  let path2 = input_2.value;
  let index = parseInt(input_index.value);

  // console.log(`value_1 : ${path1} `);
  // console.log(`value_2 : ${path2} `);
  // console.log(`index : ${index} `);

  const res = await window.ipc_renderer.invoke("display_first_images", {
    path1,
    path2,
    index,
  });
  if (res) console.log("res", res);

  img_1.src = `data:image/png;base64,${res.image1}`;
  img_2.src = `data:image/png;base64,${res.image2}`;
}


function clearButtonHandler() {

  input_index.value = "";
  input_offset.value = "";
  input_1.value = "";
  input_2.value = "";

  img_1.src = "";
  img_2.src = "";
}


document.onkeydown = checkKey;

function checkKey(e) {
  e = e || window.event;
  console.log('checkKey', e);

  if (e.keyCode == "38") {
    // up arrow
  } else if (e.keyCode == "40") {
    // down arrow
  } else if (e.keyCode == "37") {
    leftArrowHandler(1);
  } else if (e.keyCode == "39") {
    rightArrowHandler(1);
  }else if(e.keyCode == '33'){
    e.preventDefault()
    rightArrowHandler(null)
  }else if(e.keyCode == '34'){
    e.preventDefault()
    leftArrowHandler(null)
  }
}

// data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4
//         //8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==
