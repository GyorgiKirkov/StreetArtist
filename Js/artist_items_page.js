const artistItemsPage = document.getElementById("artists/items");
const allCardsWrapper = document.getElementById("artist_cards");
const overlay = document.querySelector(".confirm-screen-overlay");
const confirmPopUp = document.querySelector(".confirm-popup");
const addNewItemButton = document.querySelector(".add-new-item");

let sendToAucBtnDisabled = false;

const renderArtistCard = (
  id,
  imgUrl,
  itemTitle,
  date,
  price,
  desc,
  published
) => {
  const cardWrapper = document.createElement("div");
  const card = document.createElement("div");
  const cardButtons = document.createElement("div");
  const sendToAucBtn = document.createElement("button");
  const publishBtn = document.createElement("button");
  const removeBtn = document.createElement("button");
  const editBtn = document.createElement("button");

  cardWrapper.classList.add("card-wrapper");
  cardWrapper.setAttribute("id", id);
  card.classList.add("card", "light");
  cardButtons.classList.add("card-btns");
  sendToAucBtn.classList.add("send-to-auc");
  removeBtn.classList.add("remove");
  editBtn.classList.add("edit");

  sendToAucBtn.textContent = "Send to Auction";
  removeBtn.textContent = "Remove";
  editBtn.textContent = "Edit";

  const cardInner = `   <img src="${imgUrl}" alt="art-image">
            <div class="card-text">
                <div class="name-price">
                    <div>
                        <h5 class="item-title">${itemTitle}</h5>
                        <p class="datum">${date}</p>
                    </div>
                    <span class="price">${price}</span>
                </div>
                <p class="desc">${desc}</p>
            </div>
        `;
  allCardsWrapper.append(cardWrapper);
  cardWrapper.append(card);
  card.innerHTML += cardInner;
  card.append(cardButtons);

  if (!published) {
    publishBtn.classList.add("publish");
    publishBtn.textContent = "Publish";
    cardButtons.append(sendToAucBtn, publishBtn, removeBtn, editBtn);
  } else {
    publishBtn.classList.add("unpublish");
    publishBtn.textContent = "Unpublish";
    cardButtons.append(sendToAucBtn, publishBtn, removeBtn, editBtn);
  }
};

const renderAllArtistCards = () => {
  allCardsWrapper.innerHTML = "";
  const artistName = localStorage.getItem("artist");

  itemsLC = getItem("itemsLC");

  const artistItems = itemsLC
    ? itemsLC.filter((item) => item.artist === artistName)
    : items.filter((item) => item.artist === artistName);

  artistItems.forEach((item) => {
    const date = new Date(item.dateCreated).toLocaleDateString("en-GB");
    renderArtistCard(
      item.id,
      item.image,
      item.title,
      date,
      item.price,
      item.description,
      item.isPublished
    );
  });
};

allCardsWrapper.addEventListener("click", (e) => {
  const { target } = e;
  const isButton = target.nodeName === "BUTTON";
  if (!isButton) {
    return;
  }
  const actionItem = target.closest(".card-wrapper");
  const actionItemId = actionItem.id;
  const itemIndex = itemsLC.findIndex((item) => item.id === +actionItemId);
  localStorage.setItem("itemID", actionItemId);

  if (target.matches(".remove")) {
    overlay.classList.add("active");
    confirmPopUp.classList.add("active");
  } else if (target.matches(".publish")) {
    target.classList.remove("publish");
    target.classList.add("unpublish");
    target.textContent = "Unpublish";
    itemsLC[itemIndex].isPublished = true;
  } else if (target.matches(".unpublish")) {
    target.classList.add("publish");
    target.classList.remove("unpublish");
    target.textContent = "Publish";
    itemsLC[itemIndex].isPublished = false;
  } else if (target.matches(".edit")) {
    editingFlag = true;
    editingItem = itemsLC[itemIndex];
    editingItemNode = actionItem;
    editingItemIndex = itemIndex;
    location.hash = "artists/add-new-item";
    initEditMode();
  } else if (target.matches(".send-to-auc") && !sendToAucBtnDisabled) {
   
    sendToAucBtnDisabled = true;


    setTimeout(() => {
      sendToAucBtnDisabled = false;
    }, 180000);

    location.hash = "auctionPage";
    const imgUrl = actionItem.querySelector("img").getAttribute("src");
    const itemTitle = actionItem.querySelector(".item-title").textContent;
    const price = actionItem.querySelector(".price").textContent;
    const desc = actionItem.querySelector(".desc").textContent;

    let titleH3 = document.createElement("h3");
    titleH3.textContent = ` ${itemTitle} `;
    let parentH3 = document.getElementById("artistName");
    parentH3.appendChild(titleH3);

    let imgAuction = document.createElement("img");
    imgAuction.src = imgUrl;
    imgAuction.alt = "art-image";
    imgAuction.textContent = "";

    let targetDiv = document.getElementById("auction-card-img");
    targetDiv.appendChild(imgAuction);

    let newPrice = document.createElement("p");
    newPrice.textContent = `${desc}`;
    let targetDivDesc = document.getElementById("title-auction");
    targetDivDesc.appendChild(newPrice);

    let priceAuction = document.createElement("span");
    priceAuction.textContent = `${price} $`;
    let parentPrice = document.getElementById("spanPrice");
    parentPrice.appendChild(priceAuction);

    let timerCount = document.createElement("p");
    timerCount.textContent = `3:00`;
    let parentTimer = document.getElementById("timerAuction");
    parentTimer.appendChild(timerCount);

    const endDate = new Date();
    endDate.setSeconds(endDate.getSeconds() + 180);

    function updateTimer() {
      const currentTime = new Date();

      const timeDifference = Math.floor((endDate - currentTime) / 1000);

      if (timeDifference > 0) {
        const minutes = Math.floor(timeDifference / 60);
        const seconds = timeDifference % 60;
        timerCount.textContent = `${minutes}:${
          seconds < 10 ? "0" : ""
        }${seconds}`;
      } else {
        clearInterval(timerInterval);
        timerCount.textContent = "0:00";

        let newHeading = document.createElement("h2");
        newHeading.textContent = "Auction is over";
        newHeading.style.color = "red";
        let targetDivDesc = document.getElementById("title-auction");
        targetDivDesc.innerHTML = "";
        targetDivDesc.appendChild(newHeading);
      }
      
    }

    updateTimer();

    const timerInterval = setInterval(updateTimer, 1000);

    const confirmBidButton = document.getElementById("confirmBid");

    confirmBidButton.addEventListener("click", (e) => {
      e.preventDefault();

      const bidAmountInput = document.getElementById("bidAmount");
      const bidAmount = parseFloat(bidAmountInput.value);

      const priceBtn = auctionPage.querySelector(".priceBtn span");
      const currentAmount = parseFloat(priceBtn.textContent.replace("$", ""));

      if (bidAmount < currentAmount + 50) {
        alert("Your bid must be at least $50 more than the current amount.");
        return;
      }

      priceBtn.textContent = `${bidAmount}$`;
    });

    localStorage.setItem("auctionImgUrl", imgUrl);
    localStorage.setItem("auctionItemTitle", itemTitle);
    localStorage.setItem("auctionItemPrice", price);
    localStorage.setItem("auctionItemDesc", desc);

    setTimeout(() => {
      localStorage.removeItem("auctionImgUrl");
      localStorage.removeItem("auctionItemTitle");
      localStorage.removeItem("auctionItemPrice");
      localStorage.removeItem("auctionItemDesc");
    }, 30000);

    location.hash = "auctionPage";
  }

  updateItemsLC(itemsLC);
});

confirmPopUp.addEventListener("click", (e) => {
  const { target } = e;
  const itemID = localStorage.getItem("itemID");
  const itemToRemove = document.getElementById(itemID);
  const itemIndex = itemsLC.findIndex((item) => item.id === +itemID);

  if (target.matches(".cancel")) {
    overlay.classList.remove("active");
    confirmPopUp.classList.remove("active");
  } else if (target.matches(".confirm")) {
    overlay.classList.remove("active");
    confirmPopUp.classList.remove("active");
    itemToRemove.remove();

    itemsLC.splice(itemIndex, 1);
    updateArrIds(itemsLC);
    updateItemsLC(itemsLC);
    renderAllArtistCards();
  }
});

addNewItemButton.addEventListener("click", clearItemInputs);
