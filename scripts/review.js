document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('review-form');
    const reviewsContainer = document.getElementById('reviews-container');

    const defaultReviews = [
        { name: "Anna B.", text: "Absolutely love this cocoa! Rich and pure.", rating: 5 },
        { name: "James K.", text: "Best cocoa I’ve used for baking. Highly recommend.", rating: 4 },
    ];

    function loadReviews() {
        let reviews = JSON.parse(localStorage.getItem('terraReviews'));

        if (!reviews || reviews.length === 0) {
            reviews = defaultReviews;
            localStorage.setItem('terraReviews', JSON.stringify(reviews));
        }

        reviewsContainer.innerHTML = '';

        reviewsContainer.innerHTML = ''; // Clear container

        reviews.forEach(review => {
        const div = document.createElement('div');
        div.classList.add('review-card');
        div.innerHTML = `
            <strong>${review.name}</strong>
            <div class="stars">${'⭐'.repeat(review.rating)}</div>
            <p>${review.text}</p>
        `;
        reviewsContainer.appendChild(div);
        });
    }

    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('reviewer-name').value.trim();
        const text = document.getElementById('review-text').value.trim();
        const rating = parseInt(document.getElementById('review-rating').value);

        if (!name || !text || isNaN(rating)) {
            alert('Please fill out all fields and choose a rating.');
            return;
        }

        const newReview = { name, text, rating };
        const reviews = JSON.parse(localStorage.getItem('terraReviews')) || [];
        reviews.push(newReview);
        localStorage.setItem('terraReviews', JSON.stringify(reviews));

        alert('Thanks for your review!');
        reviewForm.reset();
        loadReviews();
        });
    }

    loadReviews(); // Always run this, regardless of form existence
});