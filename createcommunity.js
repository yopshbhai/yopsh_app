document.getElementById('submitForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const community = document.getElementById('community').value;
    const messageDiv = document.getElementById('message');
    const secretCodeDiv = document.getElementById('secretCodeDisplay');
    const username = localStorage.getItem('YopshLoc_Username') || 'N/A';
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzVx3xfV8_aN3nAqt_gc1Av8QLpdJqGXr1YrI9eIJgx9_JX5mMyWgxj1yIrslZpx0YA/exec';

    fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `title=${encodeURIComponent(title)}&community=${encodeURIComponent(community)}&YopshLoc_Username=${encodeURIComponent(username)}`
    })
    .then(() => {
        messageDiv.textContent = 'Submission Successful!';
        messageDiv.className = 'success';
        messageDiv.style.display = 'block';
        secretCodeDiv.textContent = 'Your Secret Code: CHECK YOUR CONSOLE';
        secretCodeDiv.className = 'success';
        secretCodeDiv.style.display = 'none';
        document.getElementById('submitForm').reset();
    })
    .catch((error) => {
        messageDiv.textContent = 'Error submitting form. Please try again.';
        messageDiv.className = 'error';
        messageDiv.style.display = 'block';
        console.error('Error:', error);
    });
});
