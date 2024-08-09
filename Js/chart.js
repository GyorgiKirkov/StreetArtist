let myChart;
function initChart() {
  const last7 = document.querySelector("#last7");
  const last14 = document.querySelector("#last14");
  const last30 = document.querySelector("#last30");
  const artistName = localStorage.getItem("artist");

  const itemsPerArtist = itemsLC
    ? itemsLC.filter((item) => item.artist === artistName)
    : items.filter((item) => item.artist === artistName);

  const soldItems = itemsPerArtist.filter((item) => item.dateSold);

  let dateLabels = generateDates(14);
  let daysData = dateLabels.map((label) => {
    let sum = 0;
    soldItems.forEach((item) => {
      if (formatDate(item.dateSold) === label) {
        sum += item.priceSold;
      }
    });
    return sum;
  });

  let daysLabels = dateLabels.map((label) => label.slice(0, 2));

  const data = {
    labels: daysLabels,
    datasets: [
      {
        axis: "y",
        label: "amount",
        data: daysData,
        fill: false,
        backgroundColor: ["#A16A5E"],
        hoverBackgroundColor: ["#D44C2E"],
        barThickness: 8,
      },
    ],
  };

  const config = {
    type: "bar",
    data: data,
    options: {
      maintainAspectRatio: false,
      indexAxis: "y",
    },
  };
  if (!myChart) {
    myChart = new Chart(document.getElementById("myChart"), config);
  }

  document.addEventListener("click", function (e) {
    const { target } = e;
    let days;

    target === last7
      ? (days = 7)
      : target === last14
      ? (days = 14)
      : target === last30
      ? (days = 30)
      : "";

    if (days) {
      const activeBtn = document.querySelector(".days-btns .active");
      activeBtn.classList.remove("active");
      target.classList.add("active");

      dateLabels = generateDates(days);
      daysLabels = dateLabels.map((label) => label.slice(0, 2));
      myChart.data.labels = daysLabels;

      daysData = dateLabels.map((label) => {
        let sum = 0;
        soldItems.forEach((item) => {
          if (formatDate(item.dateSold) === label) {
            sum += item.priceSold;
          }
        });
        return sum;
      });
      myChart.data.datasets[0].data = daysData;
      myChart.update();
    }
  });
  last14.click();
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-gb");

}

function generateDates(daysAgo) {
  const arr = [];
  for (let i = 0; i < daysAgo; i++) {
    const now = new Date();
    const date = now.setDate(now.getDate() - i);
    arr.push(formatDate(date));
  }
 
  return arr;
}
///// no date in chart fix it later 

const elements = {
  addItemH1: document.querySelector(".title-checkbox h1"),
  published: document.getElementById("is_published"),
  newTitle: document.getElementById("new-item_title"),
  newDesc: document.getElementById("new-item_desc"),
  newType: document.getElementById("new-item_type"),
  newPrice: document.getElementById("new-item_price"),
  newImgUrl: document.getElementById("new-item_img-url"),
  newUploadedImg: document.getElementById("file-input"),
  addBtn: document.querySelector(".add-cancel-btns .add-btn"),
  cancelBtn: document.querySelector(".add-cancel-btns .cancel-btn"),
  dispImgWrapper: document.querySelector(".displayed-img-wrapper"),
  newImgDisplayed: document.getElementById("new-img-displayed"),
  delImgBtn: document.querySelector(".del-img-btn"),
  alertScreenOverlay: document.querySelector(".alert-screen-overlay"),
  alertPopup: document.querySelector(".alert-popup"),
  alertReadBtn: document.querySelector(".alert-read-btn"),
  alertText: document.querySelector(".alert-text"),
  cameraBtn: document.querySelector(".take-snapshot"),
  video: document.getElementById("video"),
  canvas: document.getElementById("canvas"),
  context: canvas.getContext("2d"),
  takePhotoBtn: document.getElementById("snap"),
};

const base64regex =
  /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
let ImgBase64;
let editingBase64 = false;

const createNewItem = (imgSrc, dateSold, priceSold) => ({
  id: "",
  title: elements.newTitle.value,
  description: elements.newDesc.value,
  type: elements.newType.value,
  image: imgSrc,
  price: elements.newPrice.value,
  artist: localStorage.getItem("artist"),
  dateCreated: new Date().toISOString(),
  isPublished: elements.published.checked,
  isAuctioning: false,
  dateSold: dateSold,
  priceSold: priceSold,
});

const addNewItem = () => {
  let newItem;

  if (
    elements.newTitle.value &&
    elements.newDesc.value &&
    elements.newType.value &&
    elements.newPrice.value &&
    (elements.newImgUrl.value || ImgBase64 || editingItem.image)
  ) {
    if (elements.newImgUrl.value && !ImgBase64 && !editingFlag) {
      newItem = createNewItem(elements.newImgUrl.value, "", "");
    } else if (ImgBase64 && !editingBase64 && !elements.newImgUrl.value) {
      newItem = createNewItem(ImgBase64, "", "");
    } else if (editingBase64 && ImgBase64 && !elements.newImgUrl.value) {
      newItem = createNewItem(
        ImgBase64,
        editingItem.dateSold,
        editingItem.priceSold
      );
    } else if (editingFlag && elements.newImgUrl.value && !ImgBase64) {
      newItem = createNewItem(
        elements.newImgUrl.value,
        editingItem.dateSold,
        editingItem.priceSold
      );
    } else {
      showAlert("Please choose only one: Image Url or Upload image");
      return;
    }
  } else {
    showAlert("Please make sure all fields have been filed");
    return;
  }

  if (editingFlag) {
    itemsLC.splice(editingItemIndex, 1);
    editingItemNode.remove();
    editingFlag = false;
    editingBase64 = false;
  }

  itemsLC.unshift(newItem);
  updateArrIds(itemsLC);
  updateItemsLC(itemsLC);
  location.hash = "artists/items";
  clearItemInputs();
};

const readFile = () => {
  if (!elements.newUploadedImg.files || !elements.newUploadedImg.files[0])
    return;
  const FR = new FileReader();
  FR.addEventListener("load", function (ev) {
    elements.dispImgWrapper.style.display = "block";
    elements.newImgDisplayed.src = ev.target.result;
    ImgBase64 = ev.target.result;
  });
  FR.readAsDataURL(elements.newUploadedImg.files[0]);
};

const clearItemInputs = () => {
  elements.newTitle.value = "";
  elements.newDesc.value = "";
  elements.newType.value = "";
  elements.newPrice.value = "";
  elements.newImgUrl.value = "";
  elements.newUploadedImg.value = "";
  elements.newImgDisplayed.src = "";
  elements.dispImgWrapper.style.display = "none";
  ImgBase64 = "";
  elements.addItemH1.textContent = "Add new Item";
  elements.addBtn.textContent = "Add new Item";
  editingFlag = false;
};

const initEditMode = () => {
  elements.addItemH1.textContent = "Edit Item";
  elements.addBtn.textContent = "Save";
  elements.published.checked = editingItem.isPublished;
  elements.newTitle.value = editingItem.title;
  elements.newDesc.value = editingItem.description;
  elements.newType.value = editingItem.type;
  elements.newPrice.value = editingItem.price;

  editingBase64 = true;

  if (base64regex.test(editingItem.image.split(",")[1])) {
    ImgBase64 = editingItem.image;
    elements.newImgDisplayed.src = editingItem.image;
    elements.dispImgWrapper.style.display = "block";
  } else {
    checkUrl(editingItem.image).then((res) => {
      if (res) {
        elements.newImgDisplayed.src = editingItem.image;
        elements.dispImgWrapper.style.display = "block";
      }
    });
    elements.newImgUrl.value = editingItem.image;
  }
};

async function checkUrl(url) {
  const res = await fetch(url);
  const buff = await res.blob();
  return buff.type.startsWith("image/");
}

const showAlert = (message) => {
  elements.alertScreenOverlay.classList.add("active");
  elements.alertPopup.classList.add("active");
  elements.alertText.textContent = message;
  elements.alertReadBtn.addEventListener("click", () => {
    elements.alertScreenOverlay.classList.remove("active");
    elements.alertPopup.classList.remove("active");
  });
};

const startCamera = () => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      elements.video.srcObject = stream;
      elements.video.play();
    });
  }
};

elements.takePhotoBtn.addEventListener("click", () => {
  elements.context.drawImage(elements.video, 0, 0, 720, 420);
  const dataURL = elements.canvas.toDataURL("image/jpeg", 0.5);
  ImgBase64 = dataURL;
  elements.newImgDisplayed.src = ImgBase64;
  elements.dispImgWrapper.style.display = "block";
  location.hash = "artists/add-new-item";

  const mediaStream = elements.video.srcObject;
  const tracks = mediaStream.getTracks();
  tracks.forEach((track) => track.stop());
});

elements.addBtn.addEventListener("click", addNewItem);

elements.cancelBtn.addEventListener("click", () => {
  clearItemInputs();
  location.hash = "artists/items";
});

elements.newUploadedImg.addEventListener("change", readFile);

elements.delImgBtn.addEventListener("click", () => {
  elements.newImgDisplayed.src = "";
  elements.dispImgWrapper.style.display = "none";
  elements.newUploadedImg.value = "";
  ImgBase64 = "";
  if (editingItem) {
    editingItem.image = "";
    elements.newImgUrl.value = "";
  }
});
