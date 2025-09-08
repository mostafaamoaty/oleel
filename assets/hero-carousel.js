class HeroCarousel {
  constructor(sectionId) {
    this.sectionId = sectionId;
    this.cardsWrapper = document.getElementById(`CardsCarousel-${sectionId}`);
    this.cardsTrack = this.cardsWrapper?.querySelector('.hero-carousel__cards-track');
    this.cardsContainer = this.cardsWrapper?.closest('.hero-carousel__cards-container');
    // Use hero navigation buttons to control cards
    this.heroSection = this.cardsWrapper?.closest('.hero-carousel');
    this.prevButton = this.heroSection?.querySelector(`[data-carousel-prev]`);
    this.nextButton = this.heroSection?.querySelector(`[data-carousel-next]`);

    console.log('Button selectors found:', {
      heroSection: !!this.heroSection,
      prevButton: !!this.prevButton,
      nextButton: !!this.nextButton,
      prevButtonElement: this.prevButton,
      nextButtonElement: this.nextButton,
    });

    if (!this.cardsTrack || !this.prevButton || !this.nextButton) {
      console.warn('HeroCarousel: Required elements not found', {
        cardsTrack: !!this.cardsTrack,
        prevButton: !!this.prevButton,
        nextButton: !!this.nextButton,
        sectionId: this.sectionId,
      });
      return;
    }

    this.currentIndex = 0;
    this.cards = this.cardsTrack.querySelectorAll('.hero-carousel__card');
    this.totalCards = this.cards.length;
    this.cardsPerView = this.getCardsPerView();
    this.maxIndex = Math.max(0, this.totalCards - Math.floor(this.cardsPerView));

    // Reverse card order for RTL
    this.reverseCardsForRTL();

    this.init();
  }

  reverseCardsForRTL() {
    const isRTL = document.documentElement.dir === 'rtl' || document.documentElement.getAttribute('lang') === 'ar';
    if (isRTL) {
      // Reverse the order of cards in the DOM for RTL
      const cardsArray = Array.from(this.cards);
      cardsArray.reverse();
      cardsArray.forEach((card) => this.cardsTrack.appendChild(card));

      // Update cards reference
      this.cards = this.cardsTrack.querySelectorAll('.hero-carousel__card');
    }
  }

  getCardsPerView() {
    // With fixed card widths: 380px per card on desktop, 300px on mobile
    const cardWidth = window.innerWidth >= 750 ? 380 : 300;
    const containerWidth = this.cardsContainer.offsetWidth;
    return containerWidth / cardWidth; // Calculate how many cards fit in the container
  }

  init() {
    const isRTL = document.documentElement.dir === 'rtl' || document.documentElement.getAttribute('lang') === 'ar';
    console.log('HeroCarousel initialized', {
      sectionId: this.sectionId,
      totalCards: this.totalCards,
      cardsPerView: this.cardsPerView,
      maxIndex: this.maxIndex,
      prevButton: !!this.prevButton,
      nextButton: !!this.nextButton,
      heroSection: !!this.heroSection,
      isRTL: isRTL,
      currentIndex: this.currentIndex,
    });
    this.updateCarousel();
    this.bindEvents();
    this.handleResize();
  }

  bindEvents() {
    this.nextButton.addEventListener('click', (e) => {
      console.log('Next button clicked');
      this.nextSlide();
    });
    this.prevButton.addEventListener('click', (e) => {
      console.log('Prev button clicked');
      this.prevSlide();
    });

    // Add visual debugging
    console.log('Button elements:', {
      prevButton: this.prevButton,
      nextButton: this.nextButton,
      prevButtonDisabled: this.prevButton.disabled,
      nextButtonDisabled: this.nextButton.disabled,
    });

    // Touch/swipe support
    this.addTouchSupport();

    // Keyboard navigation
    this.addKeyboardSupport();
  }

  addTouchSupport() {
    let startX = 0;
    let startY = 0;
    let isScrolling = false;

    this.cardsWrapper.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isScrolling = false;
    });

    this.cardsWrapper.addEventListener('touchmove', (e) => {
      if (!startX || !startY) return;

      const diffX = startX - e.touches[0].clientX;
      const diffY = startY - e.touches[0].clientY;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        isScrolling = true;
        e.preventDefault();
      }
    });

    this.cardsWrapper.addEventListener('touchend', (e) => {
      if (!isScrolling) return;

      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;

      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
      }

      startX = 0;
      startY = 0;
      isScrolling = false;
    });
  }

  addKeyboardSupport() {
    this.cardsWrapper.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.prevSlide();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.nextSlide();
      }
    });

    // Make the carousel focusable
    this.cardsWrapper.setAttribute('tabindex', '0');
  }

  updateCarousel() {
    const isRTL = document.documentElement.dir === 'rtl' || document.documentElement.getAttribute('lang') === 'ar';
    let translateX = -this.currentIndex * (100 / this.cardsPerView);

    // In RTL with reversed cards, reverse the transform direction
    if (isRTL) {
      translateX = -translateX;
    }

    console.log('updateCarousel called', {
      currentIndex: this.currentIndex,
      cardsPerView: this.cardsPerView,
      translateX: translateX,
      totalCards: this.totalCards,
      maxIndex: this.maxIndex,
      isRTL: isRTL,
    });

    this.cardsTrack.style.transform = `translateX(${translateX}%)`;

    // Update button states - same logic for both RTL and LTR
    this.prevButton.disabled = this.currentIndex === 0;
    this.nextButton.disabled = this.currentIndex >= this.maxIndex;

    // Remove disabled attribute for debugging
    this.prevButton.removeAttribute('disabled');
    this.nextButton.removeAttribute('disabled');

    console.log('Button states updated', {
      isRTL: isRTL,
      currentIndex: this.currentIndex,
      maxIndex: this.maxIndex,
      prevButtonDisabled: this.prevButton.disabled,
      nextButtonDisabled: this.nextButton.disabled,
    });

    // Update ARIA attributes
    this.updateAriaAttributes();
  }

  updateAriaAttributes() {
    this.cardsTrack.setAttribute('aria-live', 'polite');
    this.cardsTrack.setAttribute(
      'aria-label',
      `Showing cards ${this.currentIndex + 1} to ${Math.min(
        this.currentIndex + this.cardsPerView,
        this.totalCards
      )} of ${this.totalCards}`
    );
  }

  nextSlide() {
    const isRTL = document.documentElement.dir === 'rtl' || document.documentElement.getAttribute('lang') === 'ar';
    console.log('nextSlide called', { currentIndex: this.currentIndex, maxIndex: this.maxIndex, isRTL });

    // Same logic for both RTL and LTR - always increment index
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex++;
      this.updateCarousel();
    }
  }

  prevSlide() {
    const isRTL = document.documentElement.dir === 'rtl' || document.documentElement.getAttribute('lang') === 'ar';
    console.log('prevSlide called', { currentIndex: this.currentIndex, maxIndex: this.maxIndex, isRTL });

    // Same logic for both RTL and LTR - always decrement index
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCarousel();
    }
  }

  handleResize() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newCardsPerView = this.getCardsPerView();
        const newMaxIndex = Math.max(0, this.totalCards - newCardsPerView);

        if (this.currentIndex > newMaxIndex) {
          this.currentIndex = newMaxIndex;
        }

        this.cardsPerView = newCardsPerView;
        this.maxIndex = newMaxIndex;
        this.updateCarousel();
      }, 250);
    });
  }
}

// Initialize all hero carousels on the page
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM loaded, looking for hero carousels...');
  const heroCarousels = document.querySelectorAll('[id^="CardsCarousel-"]');
  console.log('Found carousels:', heroCarousels.length);

  heroCarousels.forEach((carousel) => {
    const sectionId = carousel.id.replace('CardsCarousel-', '');
    console.log('Initializing carousel for section:', sectionId);
    new HeroCarousel(sectionId);
  });
});

// Also try to initialize after a short delay in case DOM isn't fully ready
setTimeout(() => {
  const heroCarousels = document.querySelectorAll('[id^="CardsCarousel-"]');
  if (heroCarousels.length > 0) {
    console.log('Delayed initialization - found carousels:', heroCarousels.length);
    heroCarousels.forEach((carousel) => {
      const sectionId = carousel.id.replace('CardsCarousel-', '');
      if (!carousel.dataset.initialized) {
        console.log('Delayed initialization for section:', sectionId);
        new HeroCarousel(sectionId);
        carousel.dataset.initialized = 'true';
      }
    });
  }
}, 1000);

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HeroCarousel;
}
