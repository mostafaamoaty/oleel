/**
 * Saudi National ID Validation
 * Validates Saudi National ID input and prevents checkout if invalid
 */

class SaudiIdValidation {
  constructor() {
    this.init();
  }

  init() {
    // Add event listeners for checkout buttons
    this.addCheckoutValidation();

    // Add real-time validation for input fields
    this.addInputValidation();
  }

  addCheckoutValidation() {
    // Cart drawer checkout button
    const cartDrawerCheckout = document.getElementById('CartDrawer-Checkout');
    if (cartDrawerCheckout) {
      cartDrawerCheckout.addEventListener('click', (e) => {
        if (!this.validateSaudiId('CartDrawer-SaudiId', e)) {
          e.preventDefault();
          return false;
        }
      });
    }

    // Cart page checkout button
    const cartPageCheckout = document.getElementById('checkout');
    if (cartPageCheckout) {
      cartPageCheckout.addEventListener('click', (e) => {
        if (!this.validateSaudiId('Cart-SaudiId', e)) {
          e.preventDefault();
          return false;
        }
      });
    }
  }

  addInputValidation() {
    // Cart drawer Saudi ID input
    const cartDrawerInput = document.getElementById('CartDrawer-SaudiId');
    if (cartDrawerInput) {
      cartDrawerInput.addEventListener('input', (e) => {
        this.validateInput(e.target);
      });

      cartDrawerInput.addEventListener('blur', (e) => {
        this.validateInput(e.target);
      });
    }

    // Cart page Saudi ID input
    const cartPageInput = document.getElementById('Cart-SaudiId');
    if (cartPageInput) {
      cartPageInput.addEventListener('input', (e) => {
        this.validateInput(e.target);
      });

      cartPageInput.addEventListener('blur', (e) => {
        this.validateInput(e.target);
      });
    }
  }

  validateSaudiId(inputId, event) {
    const input = document.getElementById(inputId);
    if (!input) {
      return true; // No Saudi ID field, allow checkout
    }

    const saudiId = input.value.trim();

    if (!saudiId) {
      this.showError(input, 'Saudi National ID is required');
      return false;
    }

    if (!this.isValidSaudiId(saudiId)) {
      this.showError(input, 'Please enter a valid 10-digit Saudi National ID');
      return false;
    }

    this.hideError(input);
    return true;
  }

  validateInput(input) {
    const saudiId = input.value.trim();

    if (saudiId && !this.isValidSaudiId(saudiId)) {
      this.showError(input, 'Please enter a valid 10-digit Saudi National ID');
    } else {
      this.hideError(input);
    }
  }

  isValidSaudiId(saudiId) {
    // Saudi National ID should be exactly 10 digits
    const saudiIdRegex = /^[0-9]{10}$/;
    return saudiIdRegex.test(saudiId);
  }

  showError(input, message) {
    const errorElement = document.getElementById(input.id + '-error');
    if (errorElement) {
      // Update the text content of the span inside the error message
      const errorText = errorElement.querySelector('span:not(.svg-wrapper)');
      if (errorText) {
        errorText.textContent = message;
      } else {
        // If no span found, update the text content after the SVG wrapper
        const svgWrapper = errorElement.querySelector('.svg-wrapper');
        if (svgWrapper && svgWrapper.nextSibling) {
          svgWrapper.nextSibling.textContent = message;
        }
      }
      errorElement.style.display = 'block';
      errorElement.style.marginTop = '0.5rem';
    }

    input.setCustomValidity(message);
  }

  hideError(input) {
    const errorElement = document.getElementById(input.id + '-error');
    if (errorElement) {
      errorElement.style.display = 'none';
    }

    input.setCustomValidity('');
  }
}

