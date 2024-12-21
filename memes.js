const SHEET_URL = 'https://script.google.com/macros/s/AKfycbylzWbAeumSXXDzlSzmHLPAorp1mhL34_LorUw8P_6qR0e7MrlpG8PpG1Sse-SfPA1x/exec';
const newsContainer = document.getElementById('news-container');
const loaderElement = document.getElementById('loader');

let newsItems = [];

function showLoader() {
    loaderElement.style.display = 'block';
}

function hideLoader() {
    loaderElement.style.display = 'none';
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function fetchNews() {
    const username = localStorage.getItem('YopshLoc_Username');
    if (!username) {
        console.log('Please log in first');
        return;
    }

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

        newsItems = data.news;

        const shuffledNews = shuffleArray(newsItems);
        renderNews(shuffledNews);
    } catch (error) {
        console.error('Error:', error);
        console.log('Failed to fetch news');
    } finally {
        hideLoader();
    }
}

function renderNews(newsItems) {
    newsContainer.innerHTML = newsItems.map((item, index) => `
        <section class="news-section">
        <div class="news-card" data-row="${item.rowIndex}">
            <img src="${item[3]}" alt="News Image" 
                 onclick="openNewsDetail(${index})" 
                 class="news-image">
        <div class="news-details">
            <h2 class="news-title">${item[1]}</h2>
            <p class="news-username">By ${item[0]}</p>
            <p class="news-des">${item[2]}</p>
            </div>
        </div>
        </section>
    `).join('');

    hideLoader();
}

function openNewsDetail(index) {
    const selectedMemes = {
        username: newsItems[index][0],
        title: newsItems[index][1],
        content: newsItems[index][2],
        imageUrl: newsItems[index][3],
        likes: newsItems[index][4] || 0,
        dislikes: newsItems[index][5] || 0,
        rowIndex: newsItems[index].rowIndex
    };

    localStorage.setItem('selectedMemes', JSON.stringify(selectedMemes));
    window.location.href = 'memes_details.html';
}

async function handleReaction(rowIndex, type) {
    const username = localStorage.getItem('YopshLoc_Username');
    if (!username) return;

    const newsCard = document.querySelector(`[data-row="${rowIndex}"]`);
    if (!newsCard) return;

    const likeBtn = newsCard.querySelector('.like-btn');
    const dislikeBtn = newsCard.querySelector('.dislike-btn');

    if (likeBtn.disabled || dislikeBtn.disabled) return;

    showLoader();
    try {
        const response = await fetch(SHEET_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'recordReaction',
                username: username,
                type: type,
                rowIndex: rowIndex
            })
        });

        const data = await response.json();
        if (data.success) {
            newsCard.querySelector('.like-count').textContent = data.likes;
            newsCard.querySelector('.dislike-count').textContent = data.dislikes;
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
        console.log('Failed to record reaction');
    } finally {
        hideLoader();
    }
}

document.addEventListener('DOMContentLoaded', fetchNews);
