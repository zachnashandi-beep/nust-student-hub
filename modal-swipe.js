/**
 * modal-swipe.js
 * Adds iOS-style swipe-down-to-dismiss to all dialog.modal elements.
 * Works on mobile only. Drag handle at top gives visual affordance.
 * Closes the modal if user drags down > 120px or releases with velocity > 0.4px/ms.
 */
(function () {
  const CLOSE_THRESHOLD = 120;   // px down to auto-close
  const VELOCITY_THRESHOLD = 0.4; // px/ms — fast flick closes even if < threshold

  function attachSwipe(modal) {
    const inner = modal.querySelector(".modal-inner");
    if (!inner) return;

    let startY = 0;
    let startTime = 0;
    let currentY = 0;
    let dragging = false;

    function onTouchStart(e) {
      // Only start drag from near the top of the sheet (drag handle area)
      const touch = e.touches[0];
      const rect = inner.getBoundingClientRect();
      const relativeY = touch.clientY - rect.top;
      if (relativeY > 60) return; // only top 60px is draggable

      startY = touch.clientY;
      startTime = Date.now();
      currentY = 0;
      dragging = true;
      inner.style.transition = "none";
      inner.style.willChange = "transform";
    }

    function onTouchMove(e) {
      if (!dragging) return;
      const dy = e.touches[0].clientY - startY;
      if (dy < 0) return; // don't allow dragging up
      currentY = dy;
      inner.style.transform = `translateY(${dy}px)`;
    }

    function onTouchEnd() {
      if (!dragging) return;
      dragging = false;

      const elapsed = Date.now() - startTime;
      const velocity = elapsed > 0 ? currentY / elapsed : 0;

      inner.style.transition = "";
      inner.style.willChange = "";
      inner.style.transform = "";

      if (currentY > CLOSE_THRESHOLD || velocity > VELOCITY_THRESHOLD) {
        // Trigger the animated close
        if (!modal.open) return;
        modal.classList.add("is-closing");
        setTimeout(() => {
          modal.classList.remove("is-closing");
          modal.close();
        }, 240);
      }
    }

    inner.addEventListener("touchstart", onTouchStart, { passive: true });
    inner.addEventListener("touchmove", onTouchMove, { passive: true });
    inner.addEventListener("touchend", onTouchEnd, { passive: true });
  }

  function init() {
    document.querySelectorAll("dialog.modal").forEach(attachSwipe);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
