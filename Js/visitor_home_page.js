const slidesWrapper = document.querySelector(".carousel_slides-wrapper");
const slides = Array.from(slidesWrapper.children);
const nextBtn = document.querySelector(".carousel_button--right");
const prevBtn = document.querySelector(".carousel_button--left");
let slideWidth = slides[0].getBoundingClientRect().width;

const setSlidePosition = (array, slidesWrapper) => {
  slideWidth = array[0].getBoundingClientRect().width;
  array.forEach((sl, idx) => (sl.style.left = slideWidth * idx + "px"));
  const currentSlide = document.querySelector(".current-slide");
  slidesWrapper.style.transform = `translateX(-${currentSlide.style.left})`;
};
setSlidePosition(slides, slidesWrapper);

const moveToSlide = (slidesWrapper, currentSlide, targetSlide, goToSlide) => {
  if (slidesWrapper.style.transition === "none 0s ease 0s") {
    slidesWrapper.style.transition = "transform 0.25s ease";
  }

  if (targetSlide) {
    const amountToMove = targetSlide.style.left;
    slidesWrapper.style.transform = `translateX(-${amountToMove})`;
    targetSlide.classList.add("current-slide");
  } else {
    const amountToMove = goToSlide.style.left;
    slidesWrapper.style.transform = `translateX(-${amountToMove})`;
    goToSlide.classList.add("current-slide");
  }

  currentSlide.classList.remove("current-slide");
};

const hideNotCurrSlides = () => {
  const notCurrentSlides = document.querySelectorAll("li:not(.current-slide)");
  const currentSlide = document.querySelector(".current-slide");
  notCurrentSlides.forEach((el) => (el.style.opacity = 0));
  currentSlide.style.opacity = 1;
};

nextBtn.addEventListener("click", () => {
  const currentSlide = document.querySelector(".current-slide");
  const nextSlide = currentSlide.nextElementSibling;
  const firstSlide = slidesWrapper.firstElementChild;
  moveToSlide(slidesWrapper, currentSlide, nextSlide, firstSlide);
  hideNotCurrSlides();
});

prevBtn.addEventListener("click", () => {
  const currentSlide = document.querySelector(".current-slide");
  const prevSlide = currentSlide.previousElementSibling;
  const lastSlide = slidesWrapper.lastElementChild;
  moveToSlide(slidesWrapper, currentSlide, prevSlide, lastSlide);
  hideNotCurrSlides();
});

const onResize = () => {
  setSlidePosition(slides, slidesWrapper);
  if (!(slidesWrapper.style.transition = "none")) {
    slidesWrapper.style.transition = "none";
  }
};

window.addEventListener("resize", () => {
  clearTimeout(window.resizedFinished);
  window.resizedFinished = setTimeout(function () {
    onResize();
  }, 100);
});
