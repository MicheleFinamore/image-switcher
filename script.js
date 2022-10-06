let current_images = {};

document.addEventListener("DOMContentLoaded", () => {

  const input_index = document.getElementById("input-index");
  const input_offset = document.getElementById("input-offset");
  const start_button = document.getElementById("start-button");
  const clear_button = document.getElementById('clear-button');
  const left_arrow = document.getElementById("left-arrow");
  const right_arrow = document.getElementById("right-arrow");
  
  input_index.value = "0";
  input_offset.value = "2";

  start_button.addEventListener("click", startButtonHandler )
  clear_button.addEventListener("click", clearButtonHandler)
  right_arrow.addEventListener("click", rightArrowHandler);
  left_arrow.addEventListener("click", leftArrowHandler)
});


async function leftArrowHandler(){
  let path1 = input_1.value
}


// handler freccia destra
async function rightArrowHandler() {
  const input_1 = document.getElementById("input-1");
  const input_2 = document.getElementById("input-2");
  const input_offset = document.getElementById("input-offset");
  let img_1 = document.getElementById("img-1");
  let img_2 = document.getElementById("img-2");


  let path1 = input_1.value;
  let path2 = input_2.value;
  let offset = parseInt(input_offset.value);

  const res = await window.ipc_renderer.invoke("next_images", {
    path1,
    path2,
    offset,
  });

  if (res) console.log("res in next images", res);

  img_1.src = `data:image/png;base64,${res.image1}`;
  img_2.src = `data:image/png;base64,${res.image2}`;
}

// handler bottone di start
async function startButtonHandler() {
  const input_1 = document.getElementById("input-1");
  const input_2 = document.getElementById("input-2");
  const input_index = document.getElementById("input-index");
  let img_1 = document.getElementById("img-1");
  let img_2 = document.getElementById("img-2");
  let path1 = input_1.value;
  let path2 = input_2.value;
  let index = parseInt(input_index.value);

  console.log(`value_1 : ${path1} `);
  console.log(`value_2 : ${path2} `);
  console.log(`index : ${index} `);

  const res = await window.ipc_renderer.invoke("display_first_images", {
    path1,
    path2,
    index,
  });
  if (res) console.log("res", res);

  img_1.src = `data:image/png;base64,${res.image1}`;
  img_2.src = `data:image/png;base64,${res.image2}`;
}

function clearButtonHandler(){
  const input_index = document.getElementById("input-index");
  const input_offset = document.getElementById("input-offset");
  const input_1 = document.getElementById("input-1");
  const input_2 = document.getElementById("input-2");
  let img_1 = document.getElementById("img-1");
  let img_2 = document.getElementById("img-2");

  input_index.value = ''
  input_offset.value = ''
  input_1.value = ''
  input_2.value = ''

  img_1.src = ''
  img_2.src = ''
}

// data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4
//         //8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==
