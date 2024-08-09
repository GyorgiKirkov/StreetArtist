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
