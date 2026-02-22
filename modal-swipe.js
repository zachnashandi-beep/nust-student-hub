/**
 * modal-swipe.js
 * - Locks body scroll when any dialog.modal is open (no swipe-through)
 * - iOS bottom sheet swipe-to-dismiss: drags the whole dialog element
 * - Fixes flicker: uses transform on dialog, not inner content
 */
(function () {
  const CLOSE_THRESHOLD = 140;    // px drag to trigger close
  const VELOCITY_THRESHOLD = 0.5; // px/ms fast flick

  // ── Scroll lock ──────────────────────────────────────────────────────────
  let scrollY = 0;

  function lockScroll() {
    scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
  }

  function unlockScroll() {
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    document.body.style.overflow = "";
    window.scrollTo(0, scrollY);
  }

  // ── Swipe-to-dismiss ─────────────────────────────────────────────────────
  function closeAnimated(modal) {
    if (!modal.open) return;
    modal.classList.add("is-closing");
    setTimeout(() => {
      modal.classList.remove("is-closing");
      modal.close();
    }, 240);
  }

  function attachSwipe(modal) {
    let startY = 0, startTime = 0, currentY = 0, dragging = false;

    function onTouchStart(e) {
      // Only initiate from the top drag-handle zone of the sheet
      const touch = e.touches[0];
      const rect = modal.getBoundingClientRect();
      const relY = touch.clientY - rect.top;
      if (relY > 56) return;

      startY = touch.clientY;
      startTime = Date.now();
      currentY = 0;
      dragging = true;
      modal.style.transition = "none";
    }

    function onTouchMove(e) {
      if (!dragging) return;
      const dy = e.touches[0].clientY - startY;
      if (dy < 0) { modal.style.transform = ""; return; }
      currentY = dy;
      // Move the whole dialog element down
      modal.style.transform = `translateY(${dy}px)`;
    }

    function onTouchEnd() {
      if (!dragging) return;
      dragging = false;
      modal.style.transition = "";

      const velocity = Date.now() - startTime > 0
        ? currentY / (Date.now() - startTime) : 0;

      if (currentY > CLOSE_THRESHOLD || velocity > VELOCITY_THRESHOLD) {
        modal.style.transform = "";
        closeAnimated(modal);
      } else {
        // Snap back smoothly
        modal.style.transition = "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)";
        modal.style.transform = "translateY(0)";
        setTimeout(() => { modal.style.transition = ""; }, 300);
      }
    }

    modal.addEventListener("touchstart", onTouchStart, { passive: true });
    modal.addEventListener("touchmove", onTouchMove, { passive: true });
    modal.addEventListener("touchend", onTouchEnd, { passive: true });
  }

  // ── Wire up all modals ───────────────────────────────────────────────────
  function init() {
    document.querySelectorAll("dialog.modal").forEach((modal) => {
      attachSwipe(modal);

      // Lock/unlock scroll with modal open state
      const observer = new MutationObserver(() => {
        if (modal.open) lockScroll();
        else unlockScroll();
      });
      observer.observe(modal, { attributes: true, attributeFilter: ["open"] });

      // Also catch close via Escape or cancel
      modal.addEventListener("close", unlockScroll);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
