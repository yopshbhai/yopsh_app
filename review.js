const DEPLOY_URL = 'https://script.google.com/macros/s/AKfycbzxeJbn6ul19Th2K7gAoe7V8iNtMdKfC3qkswkVPgQWOHfxpIt8JI8gj-Me0WrclPFN/exec'; // Replace with your Google Apps Script deployed URL
document.addEventListener('DOMContentLoaded', fetchQuestions);
function fetchQuestions() {
showLoader(); // Show loader when fetching data
fetch(DEPLOY_URL)
.then(response => response.json())
.then(data => {
    hideLoader();
    data = shuffleArray(data);
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';
    data.forEach((item, index) => {
        const commentBoxId = `commentBox-${index}`;
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('questionItem');
        questionDiv.innerHTML = `
        <p class="time-stamp">${timeAgo(new Date(item.Timestamp))}</p>
        <p class="username-text"><strong>Username:</strong> ${item.Username}</p>
        <p class="question"><strong>Question:</strong> ${item.Question}</p>
        <button class="btn-class" onclick="openCommentBox('${commentBoxId}', '${item.Username}', '${item.Question}')"><svg xmlns="http://www.w3.org/2000/svg" height="27px" viewBox="0 -960 960 960" width="27px" fill="#5f6368"><path d="M240-400h122l200-200q9-9 13.5-20.5T580-643q0-11-5-21.5T562-684l-36-38q-9-9-20-13.5t-23-4.5q-11 0-22.5 4.5T440-722L240-522v122Zm280-243-37-37 37 37ZM300-460v-38l101-101 20 18 18 20-101 101h-38Zm121-121 18 20-38-38 20 18Zm26 181h273v-80H527l-80 80ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"/></svg></button>
        <div id="${commentBoxId}" class="commentBox">
        <p class="comments"><strong>Comments:</strong></p>
        <div id="comments-${index}" class="comments-hero">${formatComments(item.Comments)}</div>
        <input type="text" id="commentInput-${index}" placeholder="Enter your comment" class="input-hero" style="border-radius: 0px; background: transparent; color: #fff; border-bottom: 1px solid #FFF; width: 87%; padding-left: 4px; margin-left: 20px;"/>
        <button class="publish-btn" onclick="submitComment('${commentBoxId}', '${item.Username}', '${item.Question}', '${index}')"><svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="30px" fill="#2fc92f" background="transparent"><path d="M446.67-160v-356L332-401.33l-47.33-48L480-644.67l195.33 195.34-47.33 48L513.33-516v356h-66.66ZM160-598v-135.33q0-27 19.83-46.84Q199.67-800 226.67-800h506.66q27 0 46.84 19.83Q800-760.33 800-733.33V-598h-66.67v-135.33H226.67V-598H160Z"/></svg></button>
        <button class="close-btn" onclick="closeCommentBox('${commentBoxId}')"><svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="30px" fill="#FF0000"><path d="m332-285.33 148-148 148 148L674.67-332l-148-148 148-148L628-674.67l-148 148-148-148L285.33-628l148 148-148 148L332-285.33ZM480-80q-82.33 0-155.33-31.5-73-31.5-127.34-85.83Q143-251.67 111.5-324.67T80-480q0-83 31.5-156t85.83-127q54.34-54 127.34-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82.33-31.5 155.33-31.5 73-85.5 127.34Q709-143 636-111.5T480-80Zm0-66.67q139.33 0 236.33-97.33t97-236q0-139.33-97-236.33t-236.33-97q-138.67 0-236 97-97.33 97-97.33 236.33 0 138.67 97.33 236 97.33 97.33 236 97.33ZM480-480Z"/></svg></button>
        </div>
        <hr class="head-r">
        `;
        container.appendChild(questionDiv);
    });
})
.catch(error => {
    hideLoader();
    console.error('Error fetching questions:', error);
});
}
function showLoader() {
    document.getElementById('loader').style.display = 'block';
}
function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}
function openCommentBox(commentBoxId, username, question) {
    document.querySelectorAll('.commentBox').forEach(box => {
        if (box.id !== commentBoxId) {
            box.style.display = 'none';
        }
    });
    const commentBox = document.getElementById(commentBoxId);
    commentBox.style.display = 'block';
    commentBox.dataset.username = username;
    commentBox.dataset.question = question;
}
function closeCommentBox(commentBoxId) {
    document.getElementById(commentBoxId).style.display = 'none';
}
function submitComment(commentBoxId, username, question, index) {
    const comment = document.getElementById(`commentInput-${index}`).value;
    const localUsername = localStorage.getItem('YopshLoc_Username');
    if (comment && localUsername) {
        showLoader();
        fetch(DEPLOY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `username=${encodeURIComponent(username)}&comment=${encodeURIComponent(comment)}&question=${encodeURIComponent(question)}`
        })
        .then(response => response.json())
        .then(data => {
            hideLoader();
            const alertMessage = document.getElementById('alertMessage');
            if (data.status === 'success') {
                alertMessage.innerText = 'Comment submitted successfully!';
                alertMessage.className = 'success';
                closeCommentBox(commentBoxId);
                fetchQuestions();
            } else {
                alertMessage.innerText = 'Error submitting comment: ' + data.message;
                alertMessage.className = 'error';
            }
            alertMessage.style.display = 'block';
            setTimeout(() => {
                alertMessage.style.display = 'none';
            }, 3000);
        })
        .catch(error => {
            hideLoader();
            console.error('Error submitting comment:', error);
            document.getElementById('alertMessage').innerText = 'Error submitting comment.';
            document.getElementById('alertMessage').className = 'error';
            document.getElementById('alertMessage').style.display = 'block';
            setTimeout(() => {
                document.getElementById('alertMessage').style.display = 'none';
            }, 3000);
        });
    } else {
        document.getElementById('alertMessage').innerText = 'Please enter a comment.';
        document.getElementById('alertMessage').className = 'error';
        document.getElementById('alertMessage').style.display = 'block';
        setTimeout(() => {
            document.getElementById('alertMessage').style.display = 'none';
        }, 3000);
    }
}
function formatComments(comments) {
    if (!comments) return '<p>No comments yet</p>';
    return comments.split('\n').map(comment => `<p>${comment}</p>`).join('');
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
function timeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) {
        return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
}