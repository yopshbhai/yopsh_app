const URL = 'https://script.google.com/macros/s/AKfycbxB_IdXz6IpB6WzTG7n75LMHC28qMxgpJHaoq8kL8k4opfwYBffFvLXz6mFaXPWZStX/exec';
const SHEET_NAME = 'memes';
const username = localStorage.getItem('YopshLoc_Username');

function loadPosts() {
  fetch(URL + '?action=getPosts&username=' + username)
  .then(response => response.json())
  .then(data => {
    const dataContainer = document.getElementById('data-container');
    dataContainer.innerHTML = '';
    data.forEach((row, index) => {
      const div = document.createElement('div');
      div.id = `post-${index}`;
      div.innerHTML = `
      <div class="whole-part">
      <div class="party-part">
        <img src="${row[3]}" class="image-another-class">
        <div class="body-area">
        <p class="title-class">Title: ${row[1]}</p>
        <p class="news-class">News: ${row[2]}</p>
        <p class="username-class" style="display:none;">Username: ${row[0]}</p>
        </div>
        </div>
        <button class="remove-btn" onclick="showAlert(${index}, '${row[1]}')">Remove</button>
        </div>
      `;
      dataContainer.appendChild(div);
    });
  })
  .catch(error => console.error(error));
}

function showAlert(index, title) {
  const customAlert = document.getElementById('custom-alert');
  customAlert.style.display = 'block';
  
  document.getElementById('yes-btn').onclick = () => removePost(index, title);
  document.getElementById('abort-btn').onclick = () => customAlert.style.display = 'none';
}

function removePost(index, title) {
  fetch(URL + '?action=removePost&username=' + username + '&title=' + encodeURIComponent(title))
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      document.getElementById(`post-${index}`).style.display = 'none';
    } else {
      console.error('Failed to remove post');
    }
    document.getElementById('custom-alert').style.display = 'none';
  })
  .catch(error => console.error(error));
}

loadPosts();
