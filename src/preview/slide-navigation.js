/**
 * Slide Navigation and Carousel Controller
 * Manages slide switching, thumbnail synchronization, keyboard shortcuts, and fullscreen.
 */

export class SlideNavigation {
  constructor(options = {}) {
    this.appState = options.appState || null;
    this.onSlideChange = options.onSlideChange || (() => {});
    this.container = options.container || null;

    this.bindKeyboard();
    this.bindStageInteractions();
  }

  get totalSlides() {
    return this.appState?.generatedSlides?.length || 0;
  }

  get currentIndex() {
    return this.appState?.activeSlideIndex || 0;
  }

  setSlides(slides) {
    if (this.appState && Array.isArray(slides)) {
      this.appState.generatedSlides = slides;
    }
    this.notify();
  }

  goToSlide(index) {
    if (this.appState) {
      this.appState.setActiveSlideIndex(index);
    }
    this.notify();
  }

  next() {
    if (this.appState) {
      this.appState.nextSlide();
    }
    this.notify();
  }

  prev() {
    if (this.appState) {
      this.appState.prevSlide();
    }
    this.notify();
  }

  first() {
    if (this.appState && this.totalSlides > 0) {
      this.appState.setActiveSlideIndex(0);
    }
    this.notify();
  }

  last() {
    if (this.appState && this.totalSlides > 0) {
      this.appState.setActiveSlideIndex(this.totalSlides - 1);
    }
    this.notify();
  }

  getCurrentSlide() {
    return this.appState?.generatedSlides?.[this.currentIndex] || null;
  }

  notify() {
    this.onSlideChange(this.currentIndex, this.getCurrentSlide(), this.totalSlides);
  }

  bindKeyboard() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    window.addEventListener('keydown', (e) => {
      // Don't hijack if user is typing in form inputs or textareas
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (['input', 'textarea', 'select'].includes(activeTag)) return;

      const isRtl = (this.appState?.draft?.language || 'ar') === 'ar';

      // Next slide: Space, Enter, PageDown, Down Arrow, or RTL Left Arrow
      if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter' || e.key === 'PageDown' || e.key === 'ArrowDown') {
        e.preventDefault();
        this.next();
      } else if (e.key === 'PageUp' || e.key === 'ArrowUp' || e.key === 'Backspace') {
        e.preventDefault();
        this.prev();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        // In Arabic RTL presentation: Left Arrow advances to next slide
        if (isRtl) {
          this.next();
        } else {
          this.prev();
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        // In Arabic RTL presentation: Right Arrow returns to previous slide
        if (isRtl) {
          this.prev();
        } else {
          this.next();
        }
      } else if (e.key === 'Home') {
        e.preventDefault();
        this.first();
      } else if (e.key === 'End') {
        e.preventDefault();
        this.last();
      } else if (e.key === 'f' || e.key === 'F') {
        const stage = document.getElementById('presentation-fullscreen-target');
        if (stage) this.toggleFullscreen(stage);
      }
    });
  }

  bindStageInteractions() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const stage = document.getElementById('presentation-fullscreen-target');
    if (!stage) return;

    // Click anywhere on slide stage in fullscreen advances to next slide (just like PowerPoint / Google Slides)
    stage.addEventListener('click', (e) => {
      if (e.target.closest('button, a, input, select, textarea')) return;

      if (document.fullscreenElement) {
        this.next();
      }
    });

    // Right-click in fullscreen goes to previous slide
    stage.addEventListener('contextmenu', (e) => {
      if (document.fullscreenElement) {
        e.preventDefault();
        this.prev();
      }
    });

    // Touch Swipe Gesture Support for Mobile Screens
    let touchStartX = 0;
    let touchStartY = 0;

    stage.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    stage.addEventListener('touchend', (e) => {
      if (!e.changedTouches || e.changedTouches.length === 0) return;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      // Only trigger if horizontal swipe is prominent and larger than vertical movement
      if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        const isRtl = (this.appState?.draft?.language || 'ar') === 'ar';
        if (deltaX < 0) {
          // Swipe to Left: in Arabic RTL advances to next slide
          if (isRtl) this.next(); else this.prev();
        } else {
          // Swipe to Right: in Arabic RTL returns to previous slide
          if (isRtl) this.prev(); else this.next();
        }
      }
    }, { passive: true });
  }

  toggleFullscreen(element) {
    if (typeof document === 'undefined' || !element) return;
    if (!document.fullscreenElement) {
      if (element.requestFullscreen) {
        element.requestFullscreen().catch(err => console.warn('Fullscreen error:', err));
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => console.warn('Exit fullscreen error:', err));
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }
}
