import {shopProducts} from '../data/products.mjs';

window.shopProducts = shopProducts;

let productQuantities = {};

// Initialize quantities for all products
shopProducts.forEach((product) => {
    productQuantities[product.id] = 1;
});

function updateQuantityDisplay(productId) {
    const display = document.getElementById(`quantity-${productId}`);
    if (display) {
        display.textContent = productQuantities[productId];
    }
}

function increaseQuantity(productId) {
    productQuantities[productId]++;
    updateQuantityDisplay(productId);
}

function decreaseQuantity(productId) {
    if (productQuantities[productId] > 1) {
        productQuantities[productId]--;
        updateQuantityDisplay(productId);
    }
}

function addProductToCart(productId) {
    const product = shopProducts.find(p => p.id === productId);
    const quantity = productQuantities[productId];

    if (product && window.cartManager) {
        const productData = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image
        };

        // Use the global cart manager
        window.cartManager.addToCart(productData, quantity);
    }
}

// New function to navigate to product page
function viewProduct(productId) {
    // Store the selected product in sessionStorage for the product page to use
    const product = shopProducts.find(p => p.id === productId);
    if (product) {
        sessionStorage.setItem('selectedProduct', JSON.stringify(product));
        // Navigate to the product page
        window.location.href = 'product_page.html';
    }
}

function renderProducts() {
    const container = document.getElementById('products-container');
    
    shopProducts.forEach((product) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image-container" onclick="viewProduct(${product.id})" style="cursor: pointer;">
                <img src="${product.image}" alt="${product.name}" loading="lazy" class="product-image">
            </div>
            <div class="product-info">
                <h3 class="product-name" onclick="viewProduct(${product.id})" style="cursor: pointer;">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="decreaseQuantity(${product.id})">-</button>
                        <span class="quantity-display" id="quantity-${product.id}">1</span>
                        <button class="quantity-btn" onclick="increaseQuantity(${product.id})">+</button>
                    </div>
                    <button class="add-to-cart-btn" onclick="addProductToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        `;
        
        container.appendChild(productCard);
    });
}

renderProducts();

// Make functions globally available
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.addProductToCart = addProductToCart;
window.viewProduct = viewProduct;