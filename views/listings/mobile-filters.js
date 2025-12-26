document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("mobileFilterBtn");
  const panel = document.getElementById("mobileFilterPanel");

  if (!btn || !panel) return;

  btn.addEventListener("click", () => {
    panel.style.display =
      panel.style.display === "block" ? "none" : "block";
  });

  // close on outside click
  document.addEventListener("click", (e) => {
    if (!panel.contains(e.target) && !btn.contains(e.target)) {
      panel.style.display = "none";
    }
  });
});
