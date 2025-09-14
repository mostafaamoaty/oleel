class ImageBannerScroll {
  constructor() {
    this.init();
  }

  init() {
    // Add smooth scrolling behavior to all shop now buttons
    document.addEventListener('click', (event) => {
      if (event.target.closest('[data-scroll-to-next]')) {
        event.preventDefault();
        this.scrollToNextSection(event.target.closest('[data-scroll-to-next]'));
      }
    });

    // Add smooth scrolling CSS if not already present
    this.addSmoothScrollCSS();
  }

  addSmoothScrollCSS() {
    // Check if smooth scroll CSS is already added
    if (!document.querySelector('#smooth-scroll-styles')) {
      const style = document.createElement('style');
      style.id = 'smooth-scroll-styles';
      style.textContent = `
        html {
          scroll-behavior: smooth;
        }
        
        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  scrollToNextSection(button) {
    const currentSection = button.closest('section');
    const nextSection = currentSection.nextElementSibling;

    if (nextSection) {
      // Get the offset position of the next section
      const offsetTop = nextSection.offsetTop;

      // Add some offset to account for fixed headers if needed
      const headerHeight = this.getHeaderHeight();
      const scrollPosition = offsetTop - headerHeight;

      // Smooth scroll to the next section
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth',
      });
    } else {
      // If no next section, scroll to top
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }

  getHeaderHeight() {
    // Try to get header height from common selectors
    const headerSelectors = ['.shopify-section-header', 'header', '.header', '[data-section-type="header"]'];

    for (const selector of headerSelectors) {
      const header = document.querySelector(selector);
      if (header) {
        return header.offsetHeight;
      }
    }

    // Default offset if no header found
    return 80;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ImageBannerScroll();
});

// Also initialize if script loads after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ImageBannerScroll();
  });
} else {
  new ImageBannerScroll();
}
