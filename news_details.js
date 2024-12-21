const SHEET_URL = 'https://script.google.com/macros/s/AKfycbzFi7NSFKWjNecylg3qWmlCOSaTYUs4Y5ULDyX1TQd27IkO2y7k8P7w20IJKGImDIYR/exec';
const mainNewsSection = document.getElementById('main-news-section');
const suggestedNewsContainer = document.getElementById('suggested-news');
const likeBtn = document.getElementById('like-btn');
const dislikeBtn = document.getElementById('dislike-btn');
const likeCount = document.getElementById('like-count');
const dislikeCount = document.getElementById('dislike-count');
const awardBtn = document.getElementById('award-btn');
const awardPopup = document.getElementById('award-popup');
const loaderElement = document.getElementById('loader');

let currentNews = null;
let allNews = [];

function showLoader() {
    loaderElement.classList.remove('hidden');
}

function hideLoader() {
    loaderElement.classList.add('hidden');
}

async function fetchNews() {
    const username = localStorage.getItem('YopshLoc_Username');
    if (!username) {
        alert('Please log in first');
        return;
    }

    const storedNews = localStorage.getItem('selectedNews');
    if (!storedNews) {
        alert('No news selected');
        window.location.href = 'index.html';
        return;
    }

    currentNews = JSON.parse(storedNews);

    showLoader();
    try {
        const response = await fetch(SHEET_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'fetchNews',
                username: username
            })
        });
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        allNews = data.news;

        if (currentNews) {
            renderMainNews(currentNews);
            renderSuggestedNews(currentNews);
            updateReactionCounts(currentNews);
            updateAwardCounts(currentNews);

            if (currentNews.userReacted) {
                likeBtn.disabled = true;
                dislikeBtn.disabled = true;
                likeBtn.classList.add('opacity-50');
                dislikeBtn.classList.add('opacity-50');
            }
            if (currentNews.userAwarded) {
                awardBtn.disabled = true;
                awardBtn.classList.add('opacity-50');
            }
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch news');
    } finally {
        hideLoader();
    }
}

function renderMainNews(news) {
    mainNewsSection.innerHTML = `
    <img src="${news.imageUrl}" alt="News Image" class="main-image">
    <h2 class="image-title">${news.title}</h2>
    <div class="user-content">
    <p class="username">By ${news.username}</p>
    <p class="content">${news.content}</p>
    </div>
    `;
}

function renderSuggestedNews(currentNews) {
    const suggestedNews = allNews
        .filter(news => news.rowIndex !== currentNews.rowIndex)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

    suggestedNewsContainer.innerHTML = suggestedNews.map(news => `
        <div class="suggested-news" 
             onclick="selectSuggestedNews(${suggestedNews.indexOf(news)})">
            <img src="${news[3]}" alt="Suggested News" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="text-lg font-bold mb-2 truncate">${news[1]}</h3>
                <p class="text-sm text-gray-600 truncate">${news[2]}</p>
            </div>
        </div>
    `).join('');
}

function selectSuggestedNews(index) {
    const suggestedNews = allNews
        .filter(news => news.rowIndex !== currentNews.rowIndex)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

    const selectedNews = {
        username: suggestedNews[index][0],
        title: suggestedNews[index][1],
        content: suggestedNews[index][2],
        imageUrl: suggestedNews[index][3],
        likes: suggestedNews[index][4] || 0,
        dislikes: suggestedNews[index][5] || 0,
        awards: suggestedNews[index].awards || {},
        rowIndex: suggestedNews[index].rowIndex,
        userReacted: suggestedNews[index].userReacted,
        userAwarded: suggestedNews[index].userAwarded
    };

    localStorage.setItem('selectedNews', JSON.stringify(selectedNews));
    window.location.reload();
}

function updateReactionCounts(news) {
    likeCount.textContent = news.likes || 0;
    dislikeCount.textContent = news.dislikes || 0;
}

function updateAwardCounts(news) {
    const awards = news.awards || {};
    document.querySelectorAll('.award-count').forEach(counter => {
        const type = counter.dataset.type;
        counter.textContent = awards[type] || 0;
    });
}

async function handleReaction(type) {
    const username = localStorage.getItem('YopshLoc_Username');
    if (!username) return;

    if (likeBtn.disabled || dislikeBtn.disabled) return;

    showLoader();
    try {
        const response = await fetch(SHEET_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'recordReaction',
                username: username,
                type: type,
                rowIndex: currentNews.rowIndex
            })
        });

        const data = await response.json();
        if (data.success) {
            likeCount.textContent = data.likes;
            dislikeCount.textContent = data.dislikes;

            currentNews.likes = data.likes;
            currentNews.dislikes = data.dislikes;
            localStorage.setItem('selectedNews', JSON.stringify(currentNews));

            likeBtn.disabled = true;
            dislikeBtn.disabled = true;

            if (type === 'like') {
                likeBtn.classList.add('bg-green-700');
            } else {
                dislikeBtn.classList.add('bg-red-700');
            }
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to record reaction');
    } finally {
        hideLoader();
    }
}

async function handleAward(emojiType) {
    const username = localStorage.getItem('YopshLoc_Username');
    if (!username) return;

    if (awardBtn.disabled) return;

    showLoader();
    try {
        const response = await fetch(SHEET_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'recordAward',
                username: username,
                emojiType: emojiType,
                rowIndex: currentNews.rowIndex
            })
        });

        const data = await response.json();
        if (data.success) {
            document.querySelectorAll('.award-count').forEach(counter => {
                const type = counter.dataset.type;
                counter.textContent = data.awards[type] || 0;
            });

            currentNews.awards = data.awards;
            localStorage.setItem('selectedNews', JSON.stringify(currentNews));

            awardBtn.disabled = true;
            awardBtn.classList.add('opacity-50');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to record award');
    } finally {
        hideLoader();
    }
}

awardBtn.addEventListener('click', () => {
    awardPopup.classList.toggle('show');
});

document.addEventListener('click', (e) => {
    if (!awardBtn.contains(e.target) && !awardPopup.contains(e.target)) {
        awardPopup.classList.remove('show');
    }
});

document.querySelectorAll('.award-emoji-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        const emoji = btn.dataset.emoji;
        await handleAward(emoji);
        awardPopup.classList.remove('show');
    });
});

likeBtn.addEventListener('click', () => handleReaction('like'));
dislikeBtn.addEventListener('click', () => handleReaction('dislike'));

document.addEventListener('DOMContentLoaded', fetchNews);
function reload() {
    location.reload()
}