const joinButton = document.getElementById('joinButton');
const reviewButton = document.getElementById('reviewButton');
const reviewModal = document.getElementById('reviewModal');
const overlay = document.querySelector('.overlay');
const closeModal = document.getElementById('closeModal');
const submitReview = document.getElementById('submitReview');
const communityInfo = document.getElementById('communityInfo');
const communityTitle = document.getElementById('communityTitle');
const communityGenre = document.getElementById('communityGenre');
const reviewsList = document.getElementById('reviewsList');
const secretCodeInput = document.getElementById('secretCode');
const scriptURL = 'https://script.google.com/macros/s/AKfycbzx9_XXjkRi9POQm66ztPW_mgYCm-DxKnUQrzCbbcW0OoV_jCk5AnegunRcBWca0wZA/exec';

let reviewsArray = [];

// Suggest the stored secret code on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedSecretCode = localStorage.getItem('joinedCommunity');
    if (savedSecretCode) {
        secretCodeInput.value = savedSecretCode;
    }
});

function fetchReviews(secretCode) {
    fetch(`${scriptURL}?secretCode=${encodeURIComponent(secretCode)}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                reviewsArray = data.gColumn.split('<br>');
                displayShuffledReviews();
            } else {
                reviewsList.innerHTML = `
                    <h3>Discussion:</h3>
                    <p>No reviews available.</p>
                `;
            }
        })
        .catch(error => console.error('Error fetching reviews:', error));
}

function displayShuffledReviews() {
    const shuffledReviews = reviewsArray
        .map(review => ({ review, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ review }) => review);

    reviewsList.innerHTML = `
        <h3>Discussion:</h3>
        ${shuffledReviews.map((review, index) => `
            <p id="review-${index}" class="review-item">${review}</p>
        `).join('')}
    `;

    addReviewToggleListeners();
}

setInterval(() => {
    if (reviewsArray.length > 0) {
        displayShuffledReviews();
    }
}, 10000);

function addReviewToggleListeners() {
    const reviewElements = document.querySelectorAll('.review-item');
    reviewElements.forEach(review => {
        review.addEventListener('click', () => {
            review.classList.toggle('expanded');
        });
    });
}

joinButton.addEventListener('click', () => {
    const secretCode = secretCodeInput.value.trim();
    if (!secretCode) return;

    fetch(`${scriptURL}?secretCode=${encodeURIComponent(secretCode)}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                communityInfo.classList.remove('hidden');
                reviewButton.classList.remove('hidden');
                communityTitle.textContent = data.title || 'Unknown';
                communityGenre.textContent = data.genre || 'Unknown';
                document.querySelectorAll('.form-group').forEach(el => el.style.display = 'none');
                localStorage.setItem('joinedCommunity', secretCode);
                fetchReviews(secretCode);
            }
        })
        .catch(error => console.error('Error fetching data:', error));
});

reviewButton.addEventListener('click', () => {
    reviewModal.style.display = 'block';
    overlay.style.display = 'block';
    document.body.classList.add('modal-open');
});

closeModal.addEventListener('click', () => {
    reviewModal.style.display = 'none';
    overlay.style.display = 'none';
    document.body.classList.remove('modal-open');
});

submitReview.addEventListener('click', () => {
    const reviewText = document.getElementById('reviewText').value.trim();
    const secretCode = localStorage.getItem('joinedCommunity');
    const username = localStorage.getItem('YopshLoc_Username');
    if (!reviewText) return;

    fetch(scriptURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secretCode=${encodeURIComponent(secretCode)}&review=${encodeURIComponent(reviewText)}&username=${encodeURIComponent(username)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            reviewModal.style.display = 'none';
            overlay.style.display = 'none';
            document.body.classList.remove('modal-open');
            fetchReviews(secretCode);
        }
    })
    .catch(error => console.error('Error submitting review:', error));
});
