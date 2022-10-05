let current_images = {};

document.addEventListener("DOMContentLoaded", () => {
  const input_1 = document.getElementById("input-1");
  // input_1.value = "C:\Users\mfinamore\Downloads\Lavoro\Corsi\Pool1"
  const input_2 = document.getElementById("input-2");
  // input_2.value = "C:\Users\mfinamore\Downloads\Lavoro\Corsi\Pool2"
  const input_index = document.getElementById("input-index");
  input_index.value = "0";
  const input_offset = document.getElementById("input-offset");
  input_offset.value = "2";
  const start_button = document.getElementById("start-button");
  const left_arrow = document.getElementById("left-arrow");
  const right_arrow = document.getElementById("right-arrow");
  const images_container = document.getElementById('images-container')
  let img_1 = document.getElementById("img-1");
  let img_2 = document.getElementById("img-2");

  right_arrow.addEventListener("click", async () => {
    let path1 = input_1.value;
    let path2 = input_2.value;
    let offset = parseInt(input_offset.value);

    const res = await window.ipc_renderer.invoke("next_images", {
      path1,
      path2,
      offset,
    });

    if (res) console.log('res in next images', res);

    img_1.src = `data:image/png;base64,${res.image1}`;
    img_2.src = `data:image/png;base64,${res.image2}`;

    // img_1.remove()
    // img_2.remove()

    // const new_image1 = document.createElement('img')
    // new_image1.src = './images/current_1.jpg'
    // new_image1.id = "img-1"
    // new_image1.classList.add('w-[48%]')
    
    // const new_image2 = document.createElement('img')
    // new_image2.id = "img-2"
    // new_image2.classList.add('w-[48%]')
    // new_image2.src = './images/current_2.jpg'

    // images_container.appendChild(new_image1)
    // images_container.appendChild(new_image2)

    // img_1 = document.getElementById("img-1")
    // img_2 = document.getElementById("img-2")

    // const isEmpty = Object.keys(current_images).length === 0
    // if(isEmpty){
    //     console.error('nessuna immagine selezionata');
    //     return
    // }
    // console.log(current_images);

    // const img1 = current_images['image1']
    // const split1 = img1.split('_')
    // const img1_number = parseFloat(split1[1])
    // split1[1] = img1_number + 1
    // const new_name1 = split1.join('_')

    // const img2 = current_images['image2']
    // const split2 = img2.split('_')
    // const img2_number = parseFloat(split2[1])
    // split2[1] = img2_number + 1
    // const new_name2 = split2.join('_')

    // console.log(new_name1, new_name2);
    //! gestisci questa cosa nel main e salvati i path correnti e le immagini correnti
    // const new_images = await window.ipc_renderer.invoke('next_images')

    // if(new_images) console.log('new_images', new_images);
  });

  start_button.addEventListener("click", async () => {
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
  });
});

// data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4
//         //8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==
