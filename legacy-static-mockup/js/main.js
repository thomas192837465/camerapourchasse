/* Caméra Chasse Pro — interactions communes */

(function () {
  "use strict";

  const CART_KEY = "ccp_cart_count";

  function getCartCount() {
    return parseInt(localStorage.getItem(CART_KEY) || "0", 10);
  }

  function setCartCount(n) {
    localStorage.setItem(CART_KEY, String(n));
    document.querySelectorAll("[data-cart-badge]").forEach((el) => {
      el.textContent = String(n);
      el.style.display = n > 0 ? "flex" : "none";
    });
  }

  function showToast(message) {
    let toast = document.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  function initCart() {
    setCartCount(getCartCount());
    document.querySelectorAll("[data-add-to-cart]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        let qty = 1;
        const qtyEl = document.querySelector("[data-qty-value]");
        if (qtyEl) qty = parseInt(qtyEl.textContent, 10) || 1;
        setCartCount(getCartCount() + qty);
        showToast("Produit ajouté au panier");
      });
    });
  }

  function initQtyStepper() {
    document.querySelectorAll("[data-qty-stepper]").forEach((stepper) => {
      const valueEl = stepper.querySelector("[data-qty-value]");
      const min = 1;
      const max = 20;
      stepper.querySelectorAll("[data-qty-action]").forEach((btn) => {
        btn.addEventListener("click", () => {
          let val = parseInt(valueEl.textContent, 10) || 1;
          val += btn.dataset.qtyAction === "inc" ? 1 : -1;
          val = Math.max(min, Math.min(max, val));
          valueEl.textContent = String(val);
        });
      });
    });
  }

  function initTabs() {
    document.querySelectorAll("[data-tabs]").forEach((wrap) => {
      const buttons = wrap.querySelectorAll(".tab-btn");
      const panels = wrap.querySelectorAll(".tab-panel");
      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          buttons.forEach((b) => b.classList.remove("active"));
          panels.forEach((p) => p.classList.remove("active"));
          btn.classList.add("active");
          const target = wrap.querySelector('[data-tab-panel="' + btn.dataset.tab + '"]');
          if (target) target.classList.add("active");
        });
      });
    });
  }

  function initSwatches() {
    document.querySelectorAll(".swatches").forEach((group) => {
      const labelEl = document.querySelector("[data-variant-label]");
      group.querySelectorAll(".swatch").forEach((sw) => {
        sw.addEventListener("click", () => {
          group.querySelectorAll(".swatch").forEach((s) => s.classList.remove("active"));
          sw.classList.add("active");
          if (labelEl && sw.dataset.variantName) {
            labelEl.textContent = sw.dataset.variantName;
          }
        });
      });
    });
  }

  function initGalleryThumbs() {
    const main = document.querySelector("[data-gallery-main]");
    if (!main) return;
    document.querySelectorAll("[data-gallery-thumb]").forEach((thumb) => {
      thumb.addEventListener("click", () => {
        document.querySelectorAll("[data-gallery-thumb]").forEach((t) => t.classList.remove("active"));
        thumb.classList.add("active");
        main.innerHTML = thumb.querySelector("svg").outerHTML.replace(
          /width="\d+" height="\d+"/,
          ""
        );
      });
    });
  }

  function initViewToggle() {
    const grid = document.querySelector("[data-results-grid]");
    if (!grid) return;
    document.querySelectorAll("[data-view]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-view]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        grid.classList.toggle("list-view", btn.dataset.view === "list");
      });
    });
  }

  function initCarousels() {
    document.querySelectorAll("[data-carousel]").forEach((carousel) => {
      const track = carousel.querySelector("[data-carousel-track]");
      const prev = carousel.querySelector('[data-carousel-nav="prev"]');
      const next = carousel.querySelector('[data-carousel-nav="next"]');
      if (!track) return;
      const scrollAmount = () => track.clientWidth * 0.9;
      if (prev) prev.addEventListener("click", () => track.scrollBy({ left: -scrollAmount(), behavior: "smooth" }));
      if (next) next.addEventListener("click", () => track.scrollBy({ left: scrollAmount(), behavior: "smooth" }));
    });
  }

  function initHeroDots() {
    document.querySelectorAll(".hero-dots button").forEach((dot) => {
      dot.addEventListener("click", () => {
        document.querySelectorAll(".hero-dots button").forEach((d) => d.classList.remove("active"));
        dot.classList.add("active");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initCart();
    initQtyStepper();
    initTabs();
    initSwatches();
    initGalleryThumbs();
    initViewToggle();
    initCarousels();
    initHeroDots();
  });
})();
