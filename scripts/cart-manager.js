class CartManager {
    constructor() {
        this.cartCountElement = null;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupCartCount();
            });
        } else {
            this.setupCartCount();
        }

        // Listen for storage changes (when cart is updated from other tabs/pages)
        window.addEventListener('storage', (e) => {
            if (e.key === 'cart') {
                this.updateCartCount();
            }
        });

        // Listen for custom cart update events
        window.addEventListener('cartUpdated', () => {
            this.updateCartCount();
        });
    }

    setupCartCount() {
        this.cartCountElement = document.querySelector("#cart-count");
        this.updateCartCount();
    }

    getCart() {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    }

    saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        // Dispatch custom event to notify other parts of the app
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    }

    updateCartCount() {
        const cart = this.getCart();
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        if (this.cartCountElement) {
            this.cartCountElement.textContent = totalItems;
        }
    }

    addToCart(productData, quantity = 1) {
        const product = {
            id: productData.id,
            name: productData.name,
            price: productData.price,
            image: productData.image,
            quantity: quantity
        };
        
        const cart = this.getCart();
        
        // Check if product already exists in cart
        const existingItemIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingItemIndex > -1) {
            // Update quantity if product exists
            cart[existingItemIndex].quantity += quantity;
        } else {
            // Add new product to cart
            cart.push(product);
        }
        
        this.saveCart(cart);
        this.showAddToCartConfirmation(quantity);
        
        return cart;
    }

    showAddToCartConfirmation(quantity) {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 1000;
            font-family: Arial, sans-serif;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        notification.textContent = `${quantity} item(s) added to cart!`;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Create global instance
window.cartManager = new CartManager();

// Export functions for backward compatibility
window.addToCart = function(productData, quantity) {
    return window.cartManager.addToCart(productData, quantity);
};

window.updateCartCount = function() {
    window.cartManager.updateCartCount();
};

window.getCart = function() {
    return window.cartManager.getCart();
};

window.saveCart = function(cart) {
    window.cartManager.saveCart(cart);
};