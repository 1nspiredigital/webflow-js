/**
 * DVB Tabs Component — By 1nspire Digital
 * Adds autoplay + smart pausing + progress indicator to Webflow's native Tabs element.
 */

(function () {
  "use strict";

  document.querySelectorAll('[data-tabs-component="true"]').forEach(function (wrapper) {
    var tabLinks = wrapper.querySelectorAll(".dvb-tab-link");
    var progressBars = wrapper.querySelectorAll(".dvb-tab-progress");
    var prevBtn = wrapper.querySelector(".dvb-tabs-arrow-prev");
    var nextBtn = wrapper.querySelector(".dvb-tabs-arrow-next");

    if (!tabLinks.length) return;

    var duration = parseInt(wrapper.dataset.autoplayDuration, 10) || 7000;
    var loop = wrapper.dataset.loopControls === "true";

    var timer = null;
    var paused = false;
    var current = 0;

    // --- Helpers ---

    function getCurrent() {
      for (var i = 0; i < tabLinks.length; i++) {
        if (tabLinks[i].classList.contains("w--current")) return i;
      }
      return 0;
    }

    function goTo(index) {
      tabLinks[index].click();
      current = index;
    }

    function next() {
      goTo(current >= tabLinks.length - 1 ? 0 : current + 1);
      updateArrows();
      syncScroll();
    }

    // --- Progress ---

    function startProgress() {
      progressBars.forEach(function (bar) {
        bar.style.transition = "none";
        bar.style.width = "0%";
      });
      var bar = progressBars[current];
      if (!bar || !duration) return;
      requestAnimationFrame(function () {
        bar.style.transition = "width " + duration + "ms linear";
        bar.style.width = "100%";
      });
    }

    function stopProgress() {
      progressBars.forEach(function (bar) {
        bar.style.transition = "none";
        bar.style.width = "0%";
      });
    }

    // --- Autoplay ---

    function start() {
      if (!duration || paused) return;
      stop();
      startProgress();
      timer = setInterval(function () {
        next();
        startProgress();
      }, duration);
    }

    function stop() {
      clearInterval(timer);
      timer = null;
      stopProgress();
    }

    function restart() {
      stop();
      if (!paused) start();
    }

    // --- Arrows ---

    function updateArrows() {
      if (!prevBtn || !nextBtn) return;
      prevBtn.disabled = !loop && current === 0;
      nextBtn.disabled = !loop && current === tabLinks.length - 1;
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        goTo(loop && current === 0 ? tabLinks.length - 1 : current - 1);
        updateArrows();
        syncScroll();
        restart();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        goTo(loop && current === tabLinks.length - 1 ? 0 : current + 1);
        updateArrows();
        syncScroll();
        restart();
      });
    }

    // --- Mobile scroll sync ---

    function syncScroll() {
      var active = wrapper.querySelector(".dvb-tab-link.w--current");
      if (active) active.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }

    // --- Pause: hover ---

    wrapper.addEventListener("mouseenter", function () { paused = true; stop(); });
    wrapper.addEventListener("mouseleave", function () { paused = false; start(); });

    // --- Pause: out of viewport ---

    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { paused = false; start(); }
      else { paused = true; stop(); }
    }, { threshold: 0.1 }).observe(wrapper);

    // --- Pause: reduced motion ---

    var mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    function checkMotion() {
      if (mq.matches) { paused = true; stop(); }
      else { paused = false; start(); }
    }
    mq.addEventListener("change", checkMotion);
    checkMotion();

    // --- Sync on manual click ---

    tabLinks.forEach(function (link, i) {
      link.addEventListener("click", function () {
        current = i;
        updateArrows();
        syncScroll();
        restart();
      });
    });

    // --- Go ---

    current = getCurrent();
    updateArrows();
    start();
  });
})();
