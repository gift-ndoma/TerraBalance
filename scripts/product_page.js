function showTab(tabId, clickedButton) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.style.display = 'none');

    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => button.classList.remove('active'));

    document.getElementById(tabId).style.display = 'block';
    clickedButton.classList.add('active');
}

const products = [
    {
        name: "Sun-Dried Plantain Chips",
        price: 5.99,
        image: "images/plantain.jpg"
    },
    {
        name: "Fresh Apple Fruit",
        price: 5.99,
        image: "images/apple.jpg"
    },
    {
        name: "Fresh Diary Milk",
        price: 5.99,
        image: "images/diary-milk.jpg"
    },
    {
        name: "Fresh Organic Tomato",
        price: 6.55,
        image: "images/tomato.jpg"
    },
    {
        name: "Natural Fresh Mango",
        price: 10.22,
        image: "images/mango.jpg"
    }
]

const relatedProducts = document.querySelector('#related-products');

products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.classList.add('productCard');

    productCard.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h2>${product.name}</h2>
    <p>$${product.price}</p>
    <button id="add_to_cart" class="addToCart" type="button" onclick="addToCart()">Add To Cart</button>
    `;

    relatedProducts.appendChild(productCard);
});