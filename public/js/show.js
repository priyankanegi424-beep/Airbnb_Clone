document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slider-image");
  const prevBtn = document.querySelector(".left-btn");
  const nextBtn = document.querySelector(".right-btn");
  const sliderBox = document.querySelector(".dozzy-image-box");
  const slider = document.querySelector(".image-slider");

  let currentIndex = 0;
  let autoSlideInterval;

  /* ================= COMMON FUNCTIONS ================= */
  function showSlide(index) {
    slides.forEach((img, i) => {
      img.classList.toggle("active", i === index);
    });
    updateDots(index);
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 4000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  /* ================= DESKTOP (UNCHANGED) ================= */
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
    });

    nextBtn.addEventListener("click", () => {
      nextSlide();
    });
  }

  /* ================= MOBILE DOTS ================= */
  const dotsContainer = document.createElement("div");
  dotsContainer.className = "slider-dots";

  slides.forEach((_, i) => {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");
    dotsContainer.appendChild(dot);
  });

  sliderBox.appendChild(dotsContainer);

  const dots = dotsContainer.querySelectorAll("span");

  function updateDots(index) {
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  /* ================= MOBILE SWIPE ================= */
  let startX = 0;

  slider.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
    stopAutoSlide();
  });

  slider.addEventListener("touchend", e => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();

    startAutoSlide();
  });

  /* ================= INIT ================= */
  showSlide(0);
  startAutoSlide();
});
