import {shopProducts} from '../data/products.mjs';

// Function to get product data (either from sessionStorage or default to cocoa)
function getCurrentProduct() {
    const storedProduct = sessionStorage.getItem('selectedProduct');
    if (storedProduct) {
        return JSON.parse(storedProduct);
    }
    
    // Default to the cocoa product if no product is stored
    return {
        id: 1,
        name: "Organic Andean Cocoa Powder",
        price: 12.99,
        image: "images/organic-cocoa-main.jpg",
        description: "Experience the rich, authentic taste of 100% pure organic cocoa powder, sustainably sourced from the Andean highlands. Perfect for baking, smoothies, or a decadent hot chocolate. Our cocoa is fair-trade certified, supporting local farming communities.",
        origin: "Andean Region, South America",
        category: "Pantry Staples",
        availability: "150 in stock",
        thumbnails: [
            "images/organic-cocoa-thumb1.jpg",
            "images/organic-cocoa-thumb2.jpg",
            "images/organic-cocoa-thumb1.jpg",
            "images/organic-cocoa-main.jpg"
        ]
    };
}

// Function to get related products (excluding current product)
function getRelatedProducts(currentProductId) {
    return shopProducts.filter(product => product.id !== currentProductId).slice(0, 4);
}

// Function to update the page with current product data
function updateProductPage() {
    const currentProduct = getCurrentProduct();
    
    // Update page title
    document.title = `${currentProduct.name} | Terra Balance`;
    
    // Update breadcrumb
    const breadcrumbProduct = document.querySelector('.bread-crumb li:last-child');
    if (breadcrumbProduct) {
        breadcrumbProduct.textContent = currentProduct.name;
    }
    
    // Update main image
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.src = currentProduct.image;
        mainImage.alt = currentProduct.name;
    }
    
    // Update thumbnails (use main image if no thumbnails specified)
    const thumbnailsContainer = document.querySelector('.thumbnails');
    if (thumbnailsContainer) {
        const thumbnails = currentProduct.thumbnails || [currentProduct.image, currentProduct.image, currentProduct.image, currentProduct.image];
        thumbnailsContainer.innerHTML = thumbnails.map(thumb => 
            `<img src="${thumb}" alt="${currentProduct.name}" onclick="changeImage('${thumb}')" loading="lazy" width="120" height="100">`
        ).join('');
    }
    
    // Update product details
    const titleElement = document.querySelector('.title');
    if (titleElement) {
        titleElement.textContent = currentProduct.name;
    }
    
    const priceElement = document.querySelector('.price');
    if (priceElement) {
        priceElement.textContent = `$${currentProduct.price.toFixed(2)}`;
    }
    
    // Update additional info
    const originInfo = document.querySelector('.additional-info:nth-of-type(1) span');
    if (originInfo) {
        originInfo.nextSibling.textContent = ` ${currentProduct.origin || 'Various Locations'}`;
    }
    
    const categoryInfo = document.querySelector('.additional-info:nth-of-type(2) span');
    if (categoryInfo) {
        categoryInfo.nextSibling.textContent = ` ${currentProduct.category || 'Organic Products'}`;
    }
    
    const availabilityInfo = document.querySelector('.additional-info:nth-of-type(3) span');
    if (availabilityInfo) {
        availabilityInfo.nextSibling.textContent = ` ${currentProduct.availability || 'In stock'}`;
    }
    
    // Update product description in the description tab
    const descriptionTab = document.querySelector('#tab1 p');
    if (descriptionTab) {
        descriptionTab.textContent = currentProduct.description;
    }
    
    // Update related products
    updateRelatedProducts(currentProduct.id);
}

// Function to update related products section
function updateRelatedProducts(currentProductId) {
    const relatedProducts = getRelatedProducts(currentProductId);
    const relatedProductsContainer = document.getElementById('related-products');
    
    if (relatedProductsContainer) {
        relatedProductsContainer.innerHTML = '';
        
        relatedProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('productCard');

            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" onclick="viewRelatedProduct(${product.id})" style="cursor: pointer;">
                <h3 onclick="viewRelatedProduct(${product.id})" style="cursor: pointer;">${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <button class="addToCart" data-product-id="${product.id}">Add To Cart</button>
            `;

            relatedProductsContainer.appendChild(productCard);
        });
    }
}

// Function to handle related product clicks
function viewRelatedProduct(productId) {
    const product = shopProducts.find(p => p.id === productId);
    if (product) {
        sessionStorage.setItem('selectedProduct', JSON.stringify(product));
        window.location.reload(); // Reload to show the new product
    }
}

// Function to change main image (for thumbnails)
function changeImage(src) {
    const mainImage = document.getElementById("mainImage");
    if (mainImage) {
        mainImage.src = src;
    }
}

// Updated addToCart function for the main product
function addToCartMainProduct() {
    const currentProduct = getCurrentProduct();
    const quantityInput = document.querySelector(".quantity");
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
    
    if (window.cartManager) {
        window.cartManager.addToCart(currentProduct, quantity);
    }
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    updateProductPage();
    
    // Update the add to cart button functionality
    const addToCartBtn = document.querySelector("#add_to_cart");
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', addToCartMainProduct);
    }
});

// Make functions globally available
window.changeImage = changeImage;
window.viewRelatedProduct = viewRelatedProduct;
window.getCurrentProduct = getCurrentProduct;