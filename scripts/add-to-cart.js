// add-to-cart.js - Updated to work with global cart manager
const increaseButton = document.querySelector(".increaseButton");
const decreaseButton = document.querySelector(".decreaseButton");
const quantityInput = document.querySelector(".quantity");
const addToCartBtn = document.querySelector("#add_to_cart");

// Quantity selector functionality
if (decreaseButton) {
    decreaseButton.addEventListener("click", () => {
        let value = parseInt(quantityInput.value);
        if(value > 1) quantityInput.value = value - 1;
    });
}

if (increaseButton) {
    increaseButton.addEventListener("click", () => {
        quantityInput.value = parseInt(quantityInput.value) + 1;
    });
}

// Updated addToCart function for main product page
function addToCartMainProduct(productData = null, quantity = null) {
    const qty = quantity || (quantityInput ? parseInt(quantityInput.value) : 1);
    
    let product;
    
    if (productData) {
        // For related products or products passed from other pages
        product = productData;
    } else {
        // For main product on product page
        product = {
            id: 1,
            name: "Organic Andean Cocoa Powder",
            price: 12.99,
            image: "images/organic-cocoa-main.jpg"
        };
    }
    
    // Use the global cart manager
    if (window.cartManager) {
        window.cartManager.addToCart(product, qty);
    }
}

// Add event listener to the main add to cart button
if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => addToCartMainProduct());
}

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('addToCart')) {
        const productId = parseInt(e.target.getAttribute('data-product-id'));
        
        if (window.products) {
            const product = window.products.find(p => p.id === productId);
            
            if (product && window.cartManager) {
                window.cartManager.addToCart(product, 1);
            }
        }
    }
});

window.addToCart = addToCartMainProduct;