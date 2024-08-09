const barsBtn = document.querySelectorAll(".bars-button");
const allDropdowns = document.querySelectorAll(".dropdown-nav");
barsBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    const dropdownNav = btn.parentElement.nextElementSibling;

    if (!dropdownNav.classList.contains("active")) {
      dropdownNav.classList.add("active");
    } else {
      dropdownNav.classList.remove("active");
    }
  });
});

allDropdowns.forEach((dropD) => {
  dropD.addEventListener("click", () => {
    dropD.classList.remove("active");
  });
});

function renderNavName() {
  const artistName = localStorage.getItem("artist");
  const navTitle = document.querySelectorAll(".logo-title .artist-name");

  if (artistName) {
    navTitle.forEach((title) => (title.textContent = artistName));
  } else {
    location.hash = "";
    return;
  }
}
