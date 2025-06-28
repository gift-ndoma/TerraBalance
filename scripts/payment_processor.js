// Payment Processing and Order Management System

class PaymentProcessor {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupEventListeners();
            });
        } else {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        const form = document.querySelector('.card-details form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processPayment();
            });
        }

        // Add input formatting for better UX
        this.setupInputFormatting();
    }

    setupInputFormatting() {
        const cardNumberInput = document.getElementById('number');
        const expiryInput = document.getElementById('e-date');
        const cvvInput = document.getElementById('cvv');

        // Format card number with spaces
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                e.target.value = formattedValue;
            });
        }

        // Format expiry date as MM/YY
        if (expiryInput) {
            expiryInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value;
            });
        }

        // Only allow numbers for CVV
        if (cvvInput) {
            cvvInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '');
            });
        }
    }

    validatePaymentForm() {
        const cardNumber = document.getElementById('number').value.replace(/\s/g, '');
        const expiryDate = document.getElementById('e-date').value;
        const cvv = document.getElementById('cvv').value;
        const email = document.getElementById('email').value;

        const errors = [];

        // Validate card number (basic Luhn algorithm check)
        if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
            errors.push('Please enter a valid card number');
        } else if (!this.luhnCheck(cardNumber)) {
            errors.push('Invalid card number');
        }

        // Validate expiry date
        if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
            errors.push('Please enter a valid expiry date (MM/YY)');
        } else {
            const [month, year] = expiryDate.split('/');
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear() % 100;
            const currentMonth = currentDate.getMonth() + 1;
            
            if (parseInt(month) < 1 || parseInt(month) > 12) {
                errors.push('Invalid month in expiry date');
            } else if (parseInt(year) < currentYear || 
                      (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
                errors.push('Card has expired');
            }
        }

        // Validate CVV
        if (!cvv || cvv.length < 3 || cvv.length > 4) {
            errors.push('Please enter a valid CVV');
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            errors.push('Please enter a valid email address');
        }

        return errors;
    }

    // Simple Luhn algorithm implementation for card validation
    luhnCheck(cardNumber) {
        let sum = 0;
        let isEven = false;
        
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber.charAt(i));
            
            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            isEven = !isEven;
        }
        
        return sum % 10 === 0;
    }

    getCartItems() {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    }

    calculateOrderTotal(cartItems) {
        const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = subtotal > 50 ? 0 : 5.99;
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + shipping + tax;

        return {
            subtotal: parseFloat(subtotal.toFixed(2)),
            shipping: parseFloat(shipping.toFixed(2)),
            tax: parseFloat(tax.toFixed(2)),
            total: parseFloat(total.toFixed(2))
        };
    }

    generateOrderId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `ORD-${timestamp}-${random}`;
    }

    createOrder(cartItems, paymentData, totals) {
        const order = {
            orderId: this.generateOrderId(),
            orderDate: new Date().toISOString(),
            status: 'completed',
            customer: {
                email: paymentData.email,
                // Note: In real implementation, don't store sensitive payment data
            },
            items: cartItems.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                total: parseFloat((item.price * item.quantity).toFixed(2))
            })),
            totals: totals,
            paymentMethod: 'Credit Card',
            paymentStatus: 'paid'
        };

        return order;
    }

    saveOrder(order) {
        try {
            // Get existing orders
            const existingOrders = localStorage.getItem('orders');
            const orders = existingOrders ? JSON.parse(existingOrders) : [];
            
            // Add new order
            orders.unshift(order); // Add to beginning of array (most recent first)
            
            // Keep only last 50 orders to prevent localStorage from getting too large
            if (orders.length > 50) {
                orders.splice(50);
            }
            
            // Save back to localStorage
            localStorage.setItem('orders', JSON.stringify(orders));
            
            return true;
        } catch (error) {
            console.error('Error saving order:', error);
            return false;
        }
    }

    clearCart() {
        localStorage.removeItem('cart');
        // Dispatch event to update cart count
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    }

    showSuccessMessage(order) {
        // Create success modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            font-family: 'Lato', sans-serif;
        `;

        const successBox = document.createElement('div');
        successBox.style.cssText = `
            background: white;
            padding: 40px;
            border-radius: 15px;
            text-align: center;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease-out;
        `;

        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateY(-50px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);

        successBox.innerHTML = `
            <div style="color: #4CAF50; font-size: 60px; margin-bottom: 20px;">✓</div>
            <h2 style="color: #2c5530; margin-bottom: 15px; font-size: 28px;">Payment Successful!</h2>
            <p style="color: #666; margin-bottom: 20px; font-size: 16px;">
                Thank you for your order. Your payment has been processed successfully.
            </p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left;">
                <h3 style="color: #2c5530; margin-bottom: 10px;">Order Details:</h3>
                <p><strong>Order ID:</strong> ${order.orderId}</p>
                <p><strong>Email:</strong> ${order.customer.email}</p>
                <p><strong>Total Amount:</strong> $${order.totals.total}</p>
                <p><strong>Items:</strong> ${order.items.length} item(s)</p>
            </div>
            <p style="color: #666; font-size: 14px; margin-bottom: 25px;">
                A confirmation email will be sent to ${order.customer.email}
            </p>
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <button onclick="this.closest('[style*=\"position: fixed\"]').remove(); window.location.href='index.html'" 
                        style="background: #4CAF50; color: white; border: none; padding: 12px 25px; border-radius: 5px; cursor: pointer; font-size: 16px;">
                    Continue Shopping
                </button>
                <button onclick="this.closest('[style*=\"position: fixed\"]').remove(); window.location.href='orders.html'" 
                        style="background: #2c5530; color: white; border: none; padding: 12px 25px; border-radius: 5px; cursor: pointer; font-size: 16px;">
                    View Orders
                </button>
            </div>
        `;

        modal.appendChild(successBox);
        document.body.appendChild(modal);

        // Auto-redirect after 10 seconds if user doesn't click anything
        setTimeout(() => {
            if (document.body.contains(modal)) {
                modal.remove();
                window.location.href = 'index.html';
            }
        }, 10000);
    }

    showErrorMessage(errors) {
        // Remove existing error messages
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            background: #ffebee;
            color: #c62828;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            border-left: 4px solid #c62828;
        `;

        errorDiv.innerHTML = `
            <strong>Please fix the following errors:</strong>
            <ul style="margin: 10px 0 0 20px;">
                ${errors.map(error => `<li>${error}</li>`).join('')}
            </ul>
        `;

        const form = document.querySelector('.card-details form');
        form.insertBefore(errorDiv, form.firstChild);

        // Scroll to error message
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    async processPayment() {
        try {
            // Show loading state
            const payButton = document.querySelector('button[type="submit"]');
            const originalText = payButton.textContent;
            payButton.textContent = 'Processing...';
            payButton.disabled = true;

            // Validate form
            const validationErrors = this.validatePaymentForm();
            if (validationErrors.length > 0) {
                this.showErrorMessage(validationErrors);
                payButton.textContent = originalText;
                payButton.disabled = false;
                return;
            }

            // Get cart items
            const cartItems = this.getCartItems();
            if (cartItems.length === 0) {
                this.showErrorMessage(['Your cart is empty. Please add items before checkout.']);
                payButton.textContent = originalText;
                payButton.disabled = false;
                return;
            }

            // Simulate payment processing delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Get payment data
            const paymentData = {
                email: document.getElementById('email').value,
                // In real implementation, you'd send this to a secure payment processor
            };

            // Calculate totals
            const totals = this.calculateOrderTotal(cartItems);

            // Create order
            const order = this.createOrder(cartItems, paymentData, totals);

            // Save order to localStorage
            const orderSaved = this.saveOrder(order);
            if (!orderSaved) {
                throw new Error('Failed to save order');
            }

            // Clear cart
            this.clearCart();

            // Show success message
            this.showSuccessMessage(order);

        } catch (error) {
            console.error('Payment processing error:', error);
            this.showErrorMessage(['Payment processing failed. Please try again.']);
            
            // Restore button state
            const payButton = document.querySelector('button[type="submit"]');
            payButton.textContent = 'PAY NOW';
            payButton.disabled = false;
        }
    }
}

// Utility function to get all orders from localStorage
function getAllOrders() {
    const orders = localStorage.getItem('orders');
    return orders ? JSON.parse(orders) : [];
}

// Utility function to get order by ID
function getOrderById(orderId) {
    const orders = getAllOrders();
    return orders.find(order => order.orderId === orderId);
}

// Initialize payment processor
const paymentProcessor = new PaymentProcessor();

// Export functions for global access
window.paymentProcessor = paymentProcessor;
window.getAllOrders = getAllOrders;
window.getOrderById = getOrderById;