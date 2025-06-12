function showTab(tabId, clickedButton) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.style.display = 'none');

    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => button.classList.remove('active'));

    document.getElementById(tabId).style.display = 'block';
    clickedButton.classList.add('active');
}

// Updated products array with unique IDs - make it global
window.products = [
    {
        id: 2,
        name: "Sun-Dried Plantain Chips",
        price: 5.99,
        image: "images/plantain.jpg"
    },
    {
        id: 3,
        name: "Fresh Apple Fruit",
        price: 31,
        image: "images/apple.jpg"
    },
    {
        id: 4,
        name: "Fresh Diary Milk",
        price: 5.99,
        image: "images/diary-milk.jpg"
    },
    {
        id: 5,
        name: "Fresh Organic Tomato",
        price: 6.55,
        image: "images/tomato.jpg"
    },
    {
        id: 6,
        name: "Natural Fresh Mango",
        price: 10.22,
        image: "images/mango.jpg"
    }
];

const relatedProducts = document.querySelector('#related-products');

// Fixed product card generation
window.products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.classList.add('productCard');

    productCard.innerHTML = `
    <img src="${product.image}" alt="${product.name}" loading="lazy">
    <h2>${product.name}</h2>
    <p>$${product.price}</p>
    <button class="addToCart" type="button" data-product-id="${product.id}">Add To Cart</button>
    `;

    relatedProducts.appendChild(productCard);
});

function changeImage(src) {
    document.getElementById("mainImage").src = src;
}