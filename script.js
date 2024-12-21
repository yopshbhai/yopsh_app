const DEPLOY_URL = 'https://script.google.com/macros/s/AKfycbxrTgGScTkc8qmov_3jwSh97txcQYN1aoHxPYp66U7haoQJLgbbeBxplkXjALrAOaen/exec';
let allRandomPosts = [];
let currentRandomIndex = 0;

async function fetchData(sheetName) {
    const response = await fetch(DEPLOY_URL, {
        method: 'POST',
        body: JSON.stringify({ sheetName }),
    });
    return await response.json();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createImage(url, link) {
    const img = document.createElement('img');
    img.src = url;
    img.onclick = () => window.location.href = link;
    return img;
}

function createPostWithImage(title, imageUrl, link, data = null) {
    const div = document.createElement('div');
    div.className = 'post';

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = title;
    img.onclick = () => {
        if (data) {
            const storageKey = link === 'news.html' ? 'selectedNews' : 'selectedMemes';
            const selectedData = {
                content: data.content,
                dislikes: data.dislikes,
                imageUrl: data.imageUrl,
                likes: data.likes,
                rowIndex: data.rowIndex,
                title: data.title,
                username: data.username,
            };
            localStorage.setItem(storageKey, JSON.stringify(selectedData));
            window.location.href = link === 'news.html' ? 'news_details.html' : 'memes_details.html';
        } else {
            window.location.href = link;
        }
    };

    const titleText = document.createElement('div');
    titleText.textContent = title;
    titleText.style.cursor = 'pointer';
    titleText.onclick = () => {
        if (data) {
            const storageKey = link === 'news.html' ? 'selectedNews' : 'selectedMemes';
            const selectedData = {
                content: data.content,
                dislikes: data.dislikes,
                imageUrl: data.imageUrl,
                likes: data.likes,
                rowIndex: data.rowIndex,
                title: data.title,
                username: data.username,
            };
            localStorage.setItem(storageKey, JSON.stringify(selectedData));
            window.location.href = link === 'news.html' ? 'news_details.html' : 'memes_details.html';
        } else {
            window.location.href = link;
        }
    };

    div.appendChild(img);
    div.appendChild(titleText);
    return div;
}

async function loadNews() {
    const data = await fetchData('news');
    const newsSection = document.getElementById('news-section');
    const shuffledData = shuffleArray(data.slice(1));

    shuffledData.slice(0, 4).forEach(row => {
        const newsData = {
            username: row[0],
            title: row[1],
            content: row[2],
            imageUrl: row[3],
            likes: row[4] || 0,
            dislikes: row[5] || 0,
            rowIndex: row.rowIndex,
        };

        const post = createPostWithImage(row[1], row[3], 'news.html', newsData);
        newsSection.appendChild(post);
    });
}

async function loadMemes() {
    const data = await fetchData('memes');
    const memesSection = document.getElementById('memes-section');
    const shuffledData = data.slice(1);

    shuffledData.slice(0, 4).forEach(row => {
        const memeData = {
            username: row[0],
            title: row[1],
            content: row[2],
            imageUrl: row[3],
            likes: row[4] || 0,
            dislikes: row[5] || 0,
            rowIndex: row.rowIndex,
        };

        const post = createPostWithImage(row[1], row[3], 'meme.html', memeData);
        memesSection.appendChild(post);
    });
}

async function loadAllRandomPosts() {
    const sections = ['news', 'memes'];
    allRandomPosts = [];

    for (const section of sections) {
        const data = await fetchData(section);
        data.slice(1).forEach(row => {
            if (section === 'news' || section === 'memes') {
                const postData = {
                    username: row[0],
                    title: row[1],
                    content: row[2],
                    imageUrl: row[3],
                    likes: row[4] || 0,
                    dislikes: row[5] || 0,
                    rowIndex: row.rowIndex,
                };
                allRandomPosts.push(createPostWithImage(row[1], row[3], `${section}.html`, postData));
            }
        });
    }

    allRandomPosts = shuffleArray(allRandomPosts);
}

function displayNextRandomPosts() {
    const randomSection = document.getElementById('random-section');
    const wrapper = document.createElement('div');
    wrapper.className = 'random-post';

    for (let i = 0; i < 3; i++) {
        if (currentRandomIndex >= allRandomPosts.length) {
            currentRandomIndex = 0;
        }
        wrapper.appendChild(allRandomPosts[currentRandomIndex]);
        currentRandomIndex++;
    }

    randomSection.appendChild(wrapper);
}

async function initializeRandomSection(interval = 5000) {
    await loadAllRandomPosts();
    displayNextRandomPosts();
    setInterval(() => {
        displayNextRandomPosts();
    }, interval);
}

loadNews();
loadMemes();
initializeRandomSection();