// Make entire product card clickable while preserving quick add functionality
document.addEventListener('DOMContentLoaded', function () {
  // Find all product cards
  const productCards = document.querySelectorAll('.product-card-wrapper');

  productCards.forEach(function (card) {
    // Find the product link in the card heading
    const productLink = card.querySelector('.card__heading a');
    if (!productLink) return;

    const productUrl = productLink.href;

    // Add click event to the entire card
    card.addEventListener('click', function (e) {
      // Don't interfere with quick add buttons or any interactive elements
      if (
        e.target.closest('.card__buttons') ||
        e.target.closest('button') ||
        e.target.closest('modal-opener') ||
        e.target.closest('quick-add-bulk') ||
        e.target.closest('quantity-popover') ||
        e.target.closest('volume-pricing') ||
        e.target.tagName === 'BUTTON' ||
        e.target.closest('a')
      ) {
        return;
      }

      // Navigate to product page
      window.location.href = productUrl;
    });

    // Add cursor pointer style to the card
    card.style.cursor = 'pointer';
  });
});
