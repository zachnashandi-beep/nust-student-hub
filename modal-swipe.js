/**
 * modal-swipe.js
 * iOS-style swipe-down-to-dismiss for all dialog.modal elements.
 * Also locks body scroll when any modal is open (prevents pull-to-refresh
 * and background scrolling behind the sheet).
 */
(function () {
  const CLOSE_THRESHOLD = 100;    // px down to auto-close
  const VELOCITY_THRESHOLD = 0.35; // px/ms — fast flick closes regardless of distance

  // --- Body scroll lock ---
  let scrollLockCount = 0;
  let savedScrollY = 0;

  function lockScroll() {
    if (scrollLockCount === 0) {
      savedScrollY = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      document.body.style.top = `-${savedScrollY}px`;
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    }
    scrollLockCount++;
  }

  function unlockScroll() {
    scrollLockCount = Math.max(0, scrollLockCount - 1);
    if (scrollLockCount === 0) {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, savedScrollY);
    }
  }

  // --- Swipe to dismiss ---
  function attachSwipe(modal) {
    const inner = modal.querySelector(".modal-inner");
    if (!inner) return;

    let startY = 0;
    let startTime = 0;
    let currentY = 0;
    let dragging = false;

    function dismiss() {
      if (!modal.open) return;
      modal.classList.add("is-closing");
      inner.style.transform = "";
      inner.style.transition = "";
      setTimeout(() => {
        modal.classList.remove("is-closing");
        modal.close();
      }, 240);
    }

    function onTouchStart(e) {
      startY = e.touches[0].clientY;
      startTime = Date.now();
      currentY = 0;
      dragging = true;
      inner.style.transition = "none";
    }

    function onTouchMove(e) {
      if (!dragging) return;
      const dy = e.touches[0].clientY - startY;
      if (dy < 0) {
        // Allow natural upward scroll inside the modal
        dragging = false;
        inner.style.transition = "";
        return;
      }
      currentY = dy;
      // Rubber-band resistance: movement slows as you drag further
      const resistance = 1 - Math.min(dy / 600, 0.5);
      inner.style.transform = `translateY(${dy * resistance}px)`;
    }

    function onTouchEnd() {
      if (!dragging) return;
      dragging = false;

      const elapsed = Date.now() - startTime || 1;
      const velocity = currentY / elapsed;

      if (currentY > CLOSE_THRESHOLD || velocity > VELOCITY_THRESHOLD) {
        dismiss();
      } else {
        // Snap back
        inner.style.transition = "transform 280ms cubic-bezier(0.34, 1.4, 0.64, 1)";
        inner.style.transform = "";
        setTimeout(() => { inner.style.transition = ""; }, 280);
      }
    }

    // Attach to inner div so scroll inside modal still works
    inner.addEventListener("touchstart", onTouchStart, { passive: true });
    inner.addEventListener("touchmove", onTouchMove, { passive: true });
    inner.addEventListener("touchend", onTouchEnd, { passive: true });
  }

  function init() {
    document.querySelectorAll("dialog.modal").forEach((modal) => {
      attachSwipe(modal);

      // Lock scroll when modal opens, unlock when it closes
      const observer = new MutationObserver(() => {
        if (modal.open) {
          lockScroll();
        } else {
          unlockScroll();
        }
      });
      observer.observe(modal, { attributes: true, attributeFilter: ["open"] });

      // Also unlock on close event (fired by .close())
      modal.addEventListener("close", unlockScroll);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
