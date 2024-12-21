const fetchUrl = 'https://script.google.com/macros/s/AKfycbwbgydbncNXROQ4Ms59J0edTFvnlrqWZ-5QuC6QrUOtXXEK5QG7pcYqd7uOAV2QJvj5/exec';
let currentUsername = '';

function showLoading() {
    document.getElementById('loader').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loader').style.display = 'none';
}

async function initializeApp() {
    try {
        showLoading();
        // Check local storage for username
        currentUsername = localStorage.getItem('YopshLoc_Username');

        if (!currentUsername) {
            // No username in local storage, exit without alert
            hideLoading();
            return;
        }

        loadSavedPosts();
    } catch (error) {
        console.error('Error initializing app:', error);
        hideLoading();
    }
}

async function loadSavedPosts() {
    try {
        showLoading();
        const response = await fetch(`${fetchUrl}?action=getSavedPosts&username=${currentUsername}`);
        const savedPosts = await response.json();
        const container = document.getElementById('savedContainer');
        
        if (savedPosts.length === 0) {
            container.innerHTML = '<p>No saved posts.</p>';
            hideLoading();
            return;
        }
        
        container.innerHTML = ''; // Clear any existing content
        savedPosts.forEach((post) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item';
            
            const username = document.createElement('div');
            itemDiv.appendChild(username);
            
            const title = document.createElement('div');
            title.className = 'title';
            title.textContent = `Title: ${post.title}`;
            itemDiv.appendChild(title);
            
            const news = document.createElement('div');
            news.textContent = `News: ${post.news}`;
            itemDiv.appendChild(news);
            
            const image = document.createElement('img');
            image.className = 'image-url';
            image.src = post.imageUrl;
            image.alt = post.title;
            itemDiv.appendChild(image);
            
            const removeButton = document.createElement('button');
            removeButton.className = 'remove-button';
            removeButton.textContent = 'Remove';
            removeButton.onclick = () => removePost(post.title);
            itemDiv.appendChild(removeButton);
            
            container.appendChild(itemDiv);
        });
    } catch (error) {
        console.error('Error loading saved posts:', error);
        container.innerHTML = '<p>Error loading saved posts. Please try again.</p>';
    } finally {
        hideLoading();
    }
}

async function removePost(title) {
    try {
        showLoading();
        const response = await fetch(`${fetchUrl}?action=removePost&username=${currentUsername}&title=${encodeURIComponent(title)}`);
        const result = await response.json();
        if (result.success) {
            loadSavedPosts(); // Reload the saved posts
        } else {
            console.log('Failed to remove post.');
        }
    } catch (error) {
        console.error('Error removing post:', error);
    } finally {
        hideLoading();
    }
}

initializeApp();
