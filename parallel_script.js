const parallel_start_button = document.getElementById("parallel-start-button");
const parallel_input_1 = document.getElementById("parallel-input-1");
const parallel_input_2 = document.getElementById("parallel-input-2");
const parallel_input_index = document.getElementById("parallel-input-index");
const parallel_input_offset = document.getElementById("parallel-input-offset");
const parallel_clear_button = document.getElementById("parallel-clear-button");
const parallel_button = document.getElementById("parallel-button");
const parallel_left_arrow = document.getElementById("parallel-left-arrow");
const parallel_right_arrow = document.getElementById("parallel-right-arrow");
const parallel_img_1 = document.getElementById("parallel-img-1");
const parallel_img_2 = document.getElementById("parallel-img-2");
const parallel_compare_button = document.getElementById("compare-button");

let mainPath = 1;

// handler bottone di start
async function startButtonHandler() {
  let path;

  if (mainPath === 1) {
    path = input_1.value;
  } else path = input_2.value;

  let index = parseInt(input_index.value);

  const res = await window.ipc_renderer.invoke("parallel_display_first_image", {
    path,
    index,
  });
  if (res) console.log("res", res);

  img_1.src = `data:image/png;base64,${res.image1}`;
}

parallel_start_button.addEventListener("click", startButtonHandler);
