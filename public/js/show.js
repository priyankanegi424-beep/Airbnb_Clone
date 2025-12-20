document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll(".slider-image");
  const thumbs = document.querySelectorAll(".thumbnail");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");

  let currentIndex = 0;

  function updateSlider(index) {
    images.forEach(img => img.classList.remove("active"));
    thumbs.forEach(t => t.classList.remove("thumb-active"));

    images[index].classList.add("active");
    thumbs[index].classList.add("thumb-active");
    currentIndex = index;
  }

  thumbs.forEach(thumb => {
    thumb.addEventListener("click", () => {
      updateSlider(Number(thumb.dataset.index));
    });
  });

  if (nextBtn) {
    nextBtn.onclick = () =>
      updateSlider((currentIndex + 1) % images.length);
  }

  if (prevBtn) {
    prevBtn.onclick = () =>
      updateSlider((currentIndex - 1 + images.length) % images.length);
  }
});




//for mobile navbar toggle
// BOOKING DATE CALCULATION
const checkIn = document.getElementById("checkIn");
const checkOut = document.getElementById("checkOut");
const nightCountEl = document.getElementById("nightCount");
const totalPriceEl = document.getElementById("totalPrice");

if (checkIn && checkOut) {
  function calculatePrice() {
    const start = new Date(checkIn.value);
    const end = new Date(checkOut.value);

    if (start && end && end > start) {
      const nights = Math.ceil(
        (end - start) / (1000 * 60 * 60 * 24)
      );

      const pricePerNight = Number(
        document.querySelector(".price-box").innerText.replace(/\D/g, "")
      );

      nightCountEl.innerText = nights;
      totalPriceEl.innerText = nights * pricePerNight;
    } else {
      nightCountEl.innerText = 0;
      totalPriceEl.innerText = 0;
    }
  }

  checkIn.addEventListener("change", calculatePrice);
  checkOut.addEventListener("change", calculatePrice);
}



//auto scroll
const images = document.querySelectorAll(".slider-image");
let index = 0;

setInterval(() => {
  images.forEach(img => img.classList.remove("active"));
  index = (index + 1) % images.length;
  images[index].classList.add("active");
}, 3000);
