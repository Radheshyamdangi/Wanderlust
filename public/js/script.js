(() => {
   "use strict";

   const html = document.documentElement;
   const themeToggle = document.querySelector("[data-theme-toggle]");
   const storedTheme = window.localStorage.getItem("wanderlust-theme");

   const syncThemeToggle = () => {
      if (!themeToggle) {
         return;
      }

      const isDark = html.getAttribute("data-theme") === "dark";
      const icon = themeToggle.querySelector("i");
      const label = themeToggle.querySelector("span");

      themeToggle.setAttribute("aria-pressed", String(isDark));
      themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");

      if (icon) {
         icon.className = isDark ? "fa-regular fa-sun" : "fa-regular fa-moon";
      }

      if (label) {
         label.textContent = isDark ? "Light" : "Dark";
      }
   };

   if (storedTheme) {
      html.setAttribute("data-theme", storedTheme);
   }

   syncThemeToggle();

   if (themeToggle) {
      themeToggle.addEventListener("click", () => {
         const nextTheme = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
         html.setAttribute("data-theme", nextTheme);
         window.localStorage.setItem("wanderlust-theme", nextTheme);
         syncThemeToggle();
      });
   }

   const forms = document.querySelectorAll(".needs-validation");
   Array.from(forms).forEach((form) => {
      form.addEventListener("submit", (event) => {
         if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
         }

         form.classList.add("was-validated");
      });
   });

   document.querySelectorAll(".loading-shell img").forEach((image) => {
      const mediaShell = image.closest(".loading-shell");
      const markLoaded = () => mediaShell && mediaShell.classList.add("is-loaded");

      if (image.complete) {
         markLoaded();
      } else {
         image.addEventListener("load", markLoaded, { once: true });
         image.addEventListener("error", markLoaded, { once: true });
      }
   });

   const bookingForm = document.querySelector(".booking-form[data-nightly-price]");
   if (bookingForm) {
      const nightlyPrice = Number(bookingForm.dataset.nightlyPrice || 0);
      const checkInInput = bookingForm.querySelector("#checkIn");
      const checkOutInput = bookingForm.querySelector("#checkOut");
      const totalNode = bookingForm.querySelector("[data-booking-total] strong");
      const dayInMs = 24 * 60 * 60 * 1000;

      const updateTotal = () => {
         const checkIn = new Date(checkInInput.value);
         const checkOut = new Date(checkOutInput.value);

         if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime()) || checkOut <= checkIn) {
            totalNode.textContent = "Rs. 0";
            return;
         }

         const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / dayInMs));
         totalNode.textContent = `Rs. ${(nights * nightlyPrice).toLocaleString("en-IN")}`;
      };

      [checkInInput, checkOutInput].forEach((input) => {
         input.addEventListener("change", updateTotal);
      });
   }
})();
