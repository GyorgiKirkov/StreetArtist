const renderOptions = (array, optionsParent) => {
  array.forEach((el) => {
    const option = `<option value="${el}">${el}</option>`;
    optionsParent.innerHTML += option;
  });
};

const selectJoinArtist = document.querySelector(".join-artist-select");

const joinAsArtist = () => {
  if (!selectJoinArtist.value) {
    selectJoinArtist.classList.add("alert");
    setTimeout(() => {
      selectJoinArtist.classList.remove("alert");
    }, 500);
  } else {
    localStorage.setItem("artist", selectJoinArtist.value);
    location.hash = "artists";
    selectJoinArtist.selectedIndex = 0;
  }
};
