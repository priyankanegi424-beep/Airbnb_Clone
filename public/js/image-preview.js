
document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("verify-img");
  const addBtn = document.getElementById("addImgBtn");
  const slider = document.getElementById("imageSlider");
  const dotsBox = document.getElementById("sliderDots");
  const prevBtn = document.getElementById("prevSlide");
  const nextBtn = document.getElementById("nextSlide");

  const dt = new DataTransfer();
  let currentIndex = 0;

  addBtn.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", () => {
    Array.from(fileInput.files).forEach(file => {
      const exists = Array.from(dt.files).some(
        f => f.name === file.name && f.size === file.size
      );
      if (exists) return;

      dt.items.add(file);
      addImage(file);
    });

    fileInput.files = dt.files;
    updateSlider();
  });

  function addImage(file) {
    const reader = new FileReader();
    reader.onload = () => {
      const img = document.createElement("img");
      img.src = reader.result;
      slider.appendChild(img);

      const dot = document.createElement("span");
      dotsBox.appendChild(dot);
      updateDots();
    };
    reader.readAsDataURL(file);
  }

  function updateSlider() {
    slider.style.transform = `translateX(-${currentIndex * 110}px)`;
    updateDots();
  }

  function updateDots() {
    [...dotsBox.children].forEach((d, i) =>
      d.classList.toggle("active", i === currentIndex)
    );
  }

  prevBtn.onclick = () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  };

  nextBtn.onclick = () => {
    if (currentIndex < slider.children.length - 1) {
      currentIndex++;
      updateSlider();
    }
  };

  /* touch support (mobile) */
  let startX = 0;

  slider.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  slider.addEventListener("touchend", e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (diff > 40 && currentIndex < slider.children.length - 1) {
      currentIndex++;
    } else if (diff < -40 && currentIndex > 0) {
      currentIndex--;
    }
    updateSlider();
  });
});

