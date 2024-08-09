const cardsWrapper = document.querySelector(".cards-wrapper");
const noItemsOverlay = document.querySelector(".no-items-screen-overlay");
const noItemsPopup = document.querySelector(".no-items-popup");
const backToFiltersBtn = document.querySelector(".back-to-filters");

const renderCard = (
  color,
  { image, artist, price, title, description },
  cardParent
) => {
  const card = `<div class="card-wrapper">
					<div class="card ${color}">
						<img src="${image}" alt="art-card">
						<div class="card-text">
							<div class="name-price">
								<h4 class="artist-name">${artist}</h4>
								<span class="price">${price}$</span>
							</div>
							<h5 class="item-title">${title}</h5>
							<p class="desc">
							${description}
							</p>
						</div>
					</div>
				</div> `;

  cardParent.innerHTML += card;
};

const renderAllCards = (cardsArr, cardsParent) => {
  cardsParent.innerHTML = "";
  cardsArr.forEach((item, index) => {
    let color;
    index % 2 === 0 ? (color = "light") : (color = "dark");
    renderCard(color, item, cardsParent);
  });
};

const listingPage = document.getElementById("visitor/listing");
const filterBtn = document.querySelector(".filter-icon");
const filtersContainer = document.querySelector(".filters");
const closeBtn = document.querySelector(".close-btn");

filterBtn.addEventListener("click", () => {
  listingPage.style.overflow = "hidden";
  filtersContainer.style.transform = "translateX(0)";
});

closeBtn.addEventListener("click", () => {
  listingPage.style.overflow = "visible";
  filtersContainer.style.transform = "translateX(100%)";
});

const itemTitle = document.querySelector("input#item-title");
const minPrice = document.querySelector("input#min-price");
const maxPrice = document.querySelector("input#max-price");
const type = document.querySelector("select#type");
const applyBtn = document.querySelector("button.apply-btn");
const filterArtists = document.querySelector("#artist-filter");

const storageFilterValues = () => {
  let filterValues = {
    itemTitle: itemTitle.value,
    artist: filterArtists.value,
    minPrice: minPrice.value,
    maxPrice: maxPrice.value,
    type: type.value,
  };
  localStorage.setItem("filter", JSON.stringify(filterValues));
};

const getItem = (key) => {
  let item = JSON.parse(localStorage.getItem(key));
  return item;
};

const filterCards = () => {
  const filterV = getItem("filter");

  const filteredItems = publishedItems.filter(
    (item) =>
      (filterV.itemTitle
        ? item.title.toLowerCase().includes(filterV.itemTitle.toLowerCase())
        : true) &&
      (filterV.artist ? item.artist === filterV.artist : true) &&
      (filterV.minPrice ? item.price >= filterV.minPrice : true) &&
      (filterV.maxPrice ? item.price <= filterV.maxPrice : true) &&
      (filterV.type ? item.type === filterV.type : true)
  );

  renderAllCards(filteredItems, cardsWrapper);
  if (filteredItems.length === 0) {
    noItemsOverlay.classList.add("active");
    noItemsPopup.classList.add("active");
    backToFiltersBtn.addEventListener("click", () => {
      noItemsOverlay.classList.remove("active");
      noItemsPopup.classList.remove("active");
      filterBtn.click();
    });
  }
  localStorage.setItem("filtering", false);
};

applyBtn.addEventListener("click", () => {
  storageFilterValues();
  localStorage.setItem("filtering", true);
  location.reload(); //
});
