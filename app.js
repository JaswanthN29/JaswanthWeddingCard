/**
 * Jaswanth & Lalitha — Interactive Wedding Invitation UI
 * Script: app.js
 */

(function () {
  'use strict';

  // State
  let currentPage = 1;
  const totalPages = 3;
  let isAnimating = false;

  // Asset configurations & aspect ratios
  const pageConfigs = {
    1: {
      name: 'Cover',
      src: 'assets/Cover.png',
      aspectRatio: '672 / 1336',
      sheetId: 'sheet1'
    },
    2: {
      name: 'Main',
      src: 'assets/Main.png',
      aspectRatio: '650 / 1308',
      sheetId: 'sheet2'
    },
    3: {
      name: 'Back',
      src: 'assets/back.png',
      aspectRatio: '744 / 1316',
      sheetId: 'sheet3'
    }
  };

  // DOM Elements
  const loaderOverlay = document.getElementById('loaderOverlay');
  const errorOverlay = document.getElementById('errorOverlay');
  const errorDesc = document.getElementById('errorDesc');
  const btnRetry = document.getElementById('btnRetry');

  const cardStage = document.getElementById('cardStage');
  const coverClickTarget = document.getElementById('coverClickTarget');
  const flipperLeaf = document.getElementById('flipperLeaf');
  const flipperImgFront = document.getElementById('flipperImgFront');

  const tapPromptContainer = document.getElementById('tapPromptContainer');
  const btnTapToOpen = document.getElementById('btnTapToOpen');

  const navControlsContainer = document.getElementById('navControlsContainer');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const btnRestart = document.getElementById('btnRestart');

  const indicatorText = document.getElementById('indicatorText');
  const dots = document.querySelectorAll('.indicator-dots .dot');

  const btnFullscreen = document.getElementById('btnFullscreen');
  const iconExpand = btnFullscreen ? btnFullscreen.querySelector('.icon-expand') : null;
  const iconCompress = btnFullscreen ? btnFullscreen.querySelector('.icon-compress') : null;

  /**
   * Preload all invitation images
   */
  function preloadImages() {
    const minLoadTime = new Promise((resolve) => setTimeout(resolve, 500));

    const imagePromises = Object.values(pageConfigs).map((config) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          if ('decode' in img) {
            img.decode().then(resolve).catch(resolve);
          } else {
            resolve();
          }
        };
        img.onerror = () => reject(new Error(`Failed to load ${config.src}`));
        img.src = config.src;
      });
    });

    return Promise.all([minLoadTime, ...imagePromises]);
  }

  /**
   * Initialize Application
   */
  function initApp() {
    preloadImages()
      .then(() => {
        // Hide loader with smooth fade-out
        loaderOverlay.classList.add('is-hidden');

        // Setup Initial State (Cover Page)
        setPage(1, false);
      })
      .catch((err) => {
        console.error('Initialization error:', err);
        loaderOverlay.classList.add('is-hidden');
        errorOverlay.style.display = 'flex';
        if (errorDesc) {
          errorDesc.textContent = `Could not load invitation assets: ${err.message}. Please verify the files in the assets/ directory.`;
        }
      });
  }

  /**
   * Set Current Page (Direct without animation)
   */
  function setPage(pageIndex, animate) {
    currentPage = pageIndex;

    // Set stage aspect ratio
    cardStage.style.aspectRatio = pageConfigs[pageIndex].aspectRatio;

    // Show only active sheet
    for (let i = 1; i <= totalPages; i++) {
      const sheet = document.getElementById(pageConfigs[i].sheetId);
      if (sheet) {
        if (i === pageIndex) {
          sheet.style.display = 'flex';
          sheet.style.opacity = '1';
        } else {
          sheet.style.display = 'none';
          sheet.style.opacity = '0';
        }
      }
    }

    // Floating animation on cover
    if (pageIndex === 1) {
      cardStage.classList.add('is-cover-floating', 'is-interactive');
    } else {
      cardStage.classList.remove('is-cover-floating', 'is-interactive');
    }

    updateUI(pageIndex);
  }

  /**
   * Update Controls & Page Indicators
   */
  function updateUI(pageIndex) {
    // Indicator text
    if (indicatorText) {
      indicatorText.textContent = `${pageIndex} of ${totalPages}`;
    }

    // Indicator dots
    dots.forEach((dot) => {
      const dotIndex = parseInt(dot.getAttribute('data-dot'), 10);
      dot.classList.toggle('active', dotIndex === pageIndex);
    });

    // Toggle between "Tap to Open" and Nav controls
    if (pageIndex === 1) {
      // Screen 1: Cover
      tapPromptContainer.style.display = 'flex';
      navControlsContainer.style.display = 'none';
      coverClickTarget.style.pointerEvents = 'auto';
      coverClickTarget.setAttribute('aria-hidden', 'false');
    } else if (pageIndex === 2) {
      // Screen 2: Main
      tapPromptContainer.style.display = 'none';
      navControlsContainer.style.display = 'flex';
      btnPrev.style.display = 'inline-flex';
      btnNext.style.display = 'inline-flex';
      btnRestart.style.display = 'none';
      coverClickTarget.style.pointerEvents = 'none';
      coverClickTarget.setAttribute('aria-hidden', 'true');
    } else if (pageIndex === 3) {
      // Screen 3: Back
      tapPromptContainer.style.display = 'none';
      navControlsContainer.style.display = 'flex';
      btnPrev.style.display = 'inline-flex';
      btnNext.style.display = 'none';
      btnRestart.style.display = 'inline-flex';
      coverClickTarget.style.pointerEvents = 'none';
      coverClickTarget.setAttribute('aria-hidden', 'true');
    }
  }

  /**
   * Perform 3D Page Turn Transition
   */
  function goToPage(targetPage, direction) {
    if (isAnimating || targetPage === currentPage) return;
    if (targetPage < 1 || targetPage > totalPages) return;

    isAnimating = true;

    // Automatically determine direction if not provided
    if (!direction) {
      direction = targetPage > currentPage ? 'forward' : 'backward';
    }

    const fromPage = currentPage;
    const toPage = targetPage;

    // Stop floating animation during transition
    cardStage.classList.remove('is-cover-floating', 'is-interactive');

    // Update aspect ratio smoothly
    cardStage.style.aspectRatio = pageConfigs[toPage].aspectRatio;

    const fromSheet = document.getElementById(pageConfigs[fromPage].sheetId);
    const toSheet = document.getElementById(pageConfigs[toPage].sheetId);

    if (direction === 'forward') {
      // Forward turn: The current page lifts and turns to the left (-180deg)
      flipperImgFront.src = pageConfigs[fromPage].src;
      flipperLeaf.style.display = 'block';

      // Ensure destination sheet is visible underneath
      toSheet.style.display = 'flex';
      toSheet.style.opacity = '1';
      toSheet.style.animation = 'underPageWash 0.85s cubic-bezier(0.25, 1, 0.5, 1) forwards';

      // Hide the static from-sheet so flipper leaf acts as the turning sheet
      fromSheet.style.display = 'none';

      // Trigger 3D turn animation
      flipperLeaf.style.animation = 'turnForward 0.85s cubic-bezier(0.25, 1, 0.5, 1) forwards';

      setTimeout(() => {
        flipperLeaf.style.display = 'none';
        flipperLeaf.style.animation = '';
        toSheet.style.animation = '';

        currentPage = toPage;
        updateUI(currentPage);

        if (currentPage === 1) {
          cardStage.classList.add('is-cover-floating', 'is-interactive');
        }

        isAnimating = false;
      }, 850);

    } else {
      // Backward turn: The previous page turns back from the left (-180deg -> 0deg)
      flipperImgFront.src = pageConfigs[toPage].src;
      flipperLeaf.style.display = 'block';

      // Incoming sheet stays hidden under flipper until it lands
      toSheet.style.display = 'none';

      // Outgoing sheet gets subtle shadow wash
      fromSheet.style.animation = 'underPageShadow 0.85s cubic-bezier(0.25, 1, 0.5, 1) forwards';

      // Trigger 3D backward turn
      flipperLeaf.style.animation = 'turnBackward 0.85s cubic-bezier(0.25, 1, 0.5, 1) forwards';

      setTimeout(() => {
        fromSheet.style.display = 'none';
        fromSheet.style.animation = '';

        toSheet.style.display = 'flex';
        toSheet.style.opacity = '1';

        flipperLeaf.style.display = 'none';
        flipperLeaf.style.animation = '';

        currentPage = toPage;
        updateUI(currentPage);

        if (currentPage === 1) {
          cardStage.classList.add('is-cover-floating', 'is-interactive');
        }

        isAnimating = false;
      }, 850);
    }
  }

  // ==========================================================================
  // Event Listeners
  // ==========================================================================

  // Cover interactions (Screen 1 -> Screen 2)
  if (coverClickTarget) {
    coverClickTarget.addEventListener('click', () => {
      if (currentPage === 1) {
        goToPage(2, 'forward');
      }
    });

    coverClickTarget.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (currentPage === 1) {
          goToPage(2, 'forward');
        }
      }
    });
  }

  if (btnTapToOpen) {
    btnTapToOpen.addEventListener('click', () => {
      if (currentPage === 1) {
        goToPage(2, 'forward');
      }
    });
  }

  // Navigation Buttons
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (currentPage < totalPages) {
        goToPage(currentPage + 1, 'forward');
      }
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentPage > 1) {
        goToPage(currentPage - 1, 'backward');
      }
    });
  }

  if (btnRestart) {
    btnRestart.addEventListener('click', () => {
      goToPage(1, 'backward');
    });
  }

  // Indicator Dot Click Navigation
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const target = parseInt(dot.getAttribute('data-dot'), 10);
      if (target !== currentPage) {
        goToPage(target, target > currentPage ? 'forward' : 'backward');
      }
    });
  });

  // Retry Button on Error
  if (btnRetry) {
    btnRetry.addEventListener('click', () => {
      errorOverlay.style.display = 'none';
      loaderOverlay.classList.remove('is-hidden');
      initApp();
    });
  }

  // Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    // Ignore key presses if user is focused on interactive inputs (none here, but good practice)
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (currentPage < totalPages) {
        goToPage(currentPage + 1, 'forward');
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (currentPage > 1) {
        goToPage(currentPage - 1, 'backward');
      }
    } else if (e.key === ' ' || e.key === 'Enter') {
      // Space or Enter advances through the sequence
      e.preventDefault();
      if (currentPage === 1) {
        goToPage(2, 'forward');
      } else if (currentPage === 2) {
        goToPage(3, 'forward');
      } else if (currentPage === 3) {
        goToPage(1, 'backward');
      }
    }
  });

  // Touch Swipe Gestures (Mobile)
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  const swipeThreshold = 40; // Minimum distance in px

  window.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    },
    { passive: true }
  );

  window.addEventListener(
    'touchend',
    (e) => {
      if (e.changedTouches.length === 1) {
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;
        handleSwipeGesture();
      }
    },
    { passive: true }
  );

  // Prevent unwanted rubber-band bouncing on mobile touchmove
  window.addEventListener(
    'touchmove',
    (e) => {
      if (e.touches.length === 1) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  function handleSwipeGesture() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    // Check if horizontal movement dominates vertical movement
    if (Math.abs(diffX) > Math.abs(diffY) * 1.3 && Math.abs(diffX) > swipeThreshold) {
      if (diffX < 0) {
        // Swiped Left -> Go Next
        if (currentPage < totalPages) {
          goToPage(currentPage + 1, 'forward');
        }
      } else {
        // Swiped Right -> Go Previous
        if (currentPage > 1) {
          goToPage(currentPage - 1, 'backward');
        }
      }
    }
  }

  // Fullscreen Toggle
  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        const root = document.documentElement;
        if (root.requestFullscreen) {
          root.requestFullscreen();
        } else if (root.webkitRequestFullscreen) {
          root.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    });

    function updateFullscreenIcons() {
      const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement);
      if (iconExpand && iconCompress) {
        iconExpand.style.display = isFullscreen ? 'none' : 'block';
        iconCompress.style.display = isFullscreen ? 'block' : 'none';
      }
    }

    document.addEventListener('fullscreenchange', updateFullscreenIcons);
    document.addEventListener('webkitfullscreenchange', updateFullscreenIcons);
  }

  // Start the application
  initApp();
})();

