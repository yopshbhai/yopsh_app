const imgbbApiKey = 'd524b55a2d4e0701e1706a7924c10e0c';
const googleSheetUrl = 'https://script.google.com/macros/s/AKfycbzkUGXdwjwmf6VRxxfIpevbFjNvB6DKG7m23BQggKn0VsOpaNSU8u7MaVze8cnEr8Lw/exec';

document.addEventListener('DOMContentLoaded', () => {
  const username = localStorage.getItem('YopshLoc_Username') || 'Anonymous';
  document.getElementById('username').value = username;
});

document.getElementById('newsForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const loader = document.getElementById('loader');
  const messageDiv = document.getElementById('message');
  loader.style.display = 'block';
  messageDiv.textContent = '';
  messageDiv.className = 'message';

  const username = document.getElementById('username').value;
  const title = document.getElementById('title').value;
  const news = document.getElementById('news').value;
  const memeImage = document.getElementById('memeImage').files[0];

  if (!memeImage) {
    messageDiv.textContent = 'Please upload an image.';
    messageDiv.classList.add('error');
    loader.style.display = 'none';
    return;
  }

  try {
    const formData = new FormData();
    formData.append('image', memeImage);

    const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
      method: 'POST',
      body: formData
    });

    const imgbbData = await imgbbResponse.json();
    if (!imgbbData.success) {
      throw new Error('Image upload failed');
    }

    const imageUrl = imgbbData.data.url;
    
    const url = `${googleSheetUrl}?action=submitNews&username=${encodeURIComponent(username)}&title=${encodeURIComponent(title)}&news=${encodeURIComponent(news)}&imageUrl=${encodeURIComponent(imageUrl)}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error('Failed to save to Google Sheets');
    }

    messageDiv.textContent = 'Memes submitted successfully!';
    messageDiv.classList.add('success');
    document.getElementById('newsForm').reset();
    document.getElementById('username').value = username;
  } catch (error) {
    console.error('Error:', error);
    messageDiv.textContent = 'Failed to submit meme. Please try again.';
    messageDiv.classList.add('error');
  } finally {
    loader.style.display = 'none';
  }
});