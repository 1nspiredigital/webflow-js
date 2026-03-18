 /**
 * Scroll Swap Component
 * Sticky image that crossfades based on scroll position.
 * Requires GSAP + ScrollTrigger.
 */

(function () {
  "use strict";

  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll(".scroll-swap").forEach(function (section) {
    var items = section.querySelectorAll(".scroll-swap-text-content");
    var images = section.querySelectorAll(".scroll-swap-img");
    var imagesWrap = section.querySelector(".scroll-swap-images");

    if (!items.length || !images.length) return;

    // Hide all images except the first
    gsap.set(images, { opacity: 0 });
    gsap.set(images[0], { opacity: 1 });

    // Pin the images container for the duration of the text scroll
    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      pin: imagesWrap,
      pinSpacing: false,
    });

    // Center the pinned images vertically in the viewport
    gsap.set(imagesWrap, { top: "50%", transform: "translateY(-50%)" });

    // Crossfade images based on which text item is in view
    items.forEach(function (item, i) {
      ScrollTrigger.create({
        trigger: item,
        start: "top center",
        end: "bottom center",
        onEnter: function () { setActiveImage(i); },
        onEnterBack: function () { setActiveImage(i); },
      });
    });

    function setActiveImage(index) {
      gsap.to(images, { opacity: 0, duration: 0.6, overwrite: true });
      gsap.to(images[index], { opacity: 1, duration: 0.6, overwrite: true });
    }
  });
})();
