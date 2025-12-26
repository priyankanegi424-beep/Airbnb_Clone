document.addEventListener("DOMContentLoaded", () => {

  const dropdowns = document.querySelectorAll(".filter-dd");

  // helper: close all menus
  function closeAll() {
    dropdowns.forEach(dd => {
      const menu = dd.querySelector(".filter-menu");
      if (menu) menu.classList.remove("show");
    });
  }

  // open / close on button click
  dropdowns.forEach(dd => {
    const btn = dd.querySelector(".filter-btn");
    const menu = dd.querySelector(".filter-menu");

    if (!btn || !menu) return;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();

      const isOpen = menu.classList.contains("show");
      closeAll();

      if (!isOpen) {
        menu.classList.add("show");
      }
    });

    // item click
    menu.querySelectorAll("li").forEach(item => {
      item.addEventListener("click", () => {

        // button text change
        btn.textContent = item.textContent;

        // store value (future backend use)
        if (item.dataset.bhk) {
          btn.dataset.selected = item.dataset.bhk;
        }
        if (item.dataset.price) {
          btn.dataset.selected = item.dataset.price;
        }
        if (item.dataset.sort) {
          btn.dataset.selected = item.dataset.sort;
        }

        menu.classList.remove("show");
      });
    });
  });

  // click outside → close all
  document.addEventListener("click", closeAll);

  // CLEAR ALL FILTERS
  const clearBtn = document.getElementById("clearFilters");

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {

      closeAll();

      // reset text
      const bhkBtn = document.getElementById("bhkBtn");
      const priceBtn = document.getElementById("priceBtn");
      const sortBtn = document.getElementById("sortBtn");

      if (bhkBtn) {
        bhkBtn.textContent = "All BHK";
        delete bhkBtn.dataset.selected;
      }

      if (priceBtn) {
        priceBtn.textContent = "All Prices";
        delete priceBtn.dataset.selected;
      }

      if (sortBtn) {
        sortBtn.textContent = "Sort";
        delete sortBtn.dataset.selected;
      }

    });
  }

});
