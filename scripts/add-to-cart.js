// add-to-cart.js - Updated version
const increaseButton = document.querySelector(".increaseButton");
const decreaseButton = document.querySelector(".decreaseButton");
const quantityInput = document.querySelector(".quantity");
const addToCartBtn = document.querySelector("#add_to_cart");
const cartCountElement = document.querySelector("#cart-count");

// Quantity selector functionality
decreaseButton.addEventListener("click", () => {
    let value = parseInt(quantityInput.value);
    if(value > 1) quantityInput.value = value - 1;
});

increaseButton.addEventListener("click", () => {
    quantityInput.value = parseInt(quantityInput.value) + 1;
});

// Cart functionality
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

// Updated addToCart function to accept product data
function addToCart(productData = null, quantity = null) {
    // Use provided quantity or default to main product quantity
    const qty = quantity || parseInt(quantityInput.value);
    
    let product;
    
    if (productData) {
        // For related products
        product = {
            id: productData.id,
            name: productData.name,
            price: productData.price,
            image: productData.image,
            quantity: qty
        };
    } else {
        // For main product
        product = {
            id: 1,
            name: "Organic Andean Cocoa Powder",
            price: 12.99,
            image: "images/organic-cocoa-main.jpg",
            quantity: qty
        };
    }
    
    const cart = getCart();
    
    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex > -1) {
        // Update quantity if product exists
        cart[existingItemIndex].quantity += qty;
    } else {
        // Add new product to cart
        cart.push(product);
    }
    
    saveCart(cart);
    updateCartCount();
    
    // Show confirmation
    showAddToCartConfirmation(qty);
}

function showAddToCartConfirmation(quantity) {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        font-family: Arial, sans-serif;
    `;
    notification.textContent = `${quantity} item(s) added to cart!`;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Update cart count on page load
document.addEventListener('DOMContentLoaded', updateCartCount);

// Add event listener to the main add to cart button
if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => addToCart());
}

// Add event delegation for dynamically created buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('addToCart')) {
        const productId = parseInt(e.target.getAttribute('data-product-id'));
        
        // Get products array from window object (set by product_page.js)
        if (window.products) {
            const product = window.products.find(p => p.id === productId);
            
            if (product) {
                addToCart(product, 1); // Default quantity of 1 for related products
            }
        }
    }
});