document.getElementById('gamerDiv').style.display = 'block';
const gamerButton = document.getElementById('gamerButton');
const developerButton = document.getElementById('developerButton');
const gamerDiv = document.getElementById('gamerDiv');
const developerDiv = document.getElementById('developerDiv');

function switchButtonColors(isGamer) {
    if (isGamer) {
        gamerButton.style.borderBottom = '1px solid #e94560'; 
        developerButton.style.borderBottom = '1px solid transparent'; 
    } else {
        developerButton.style.borderBottom = '1px solid #e94560'; 
        gamerButton.style.borderBottom = '1px solid transparent'; 
    }
}

gamerButton.addEventListener('click', function() {
    developerDiv.style.display = 'none';
    gamerDiv.style.display = 'block';
    switchButtonColors(true);
});

developerButton.addEventListener('click', function() {
    gamerDiv.style.display = 'none';
    developerDiv.style.display = 'block';
    switchButtonColors(false);
});

document.getElementById('gamerForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const experience = document.getElementById('gamerExperience').value;
    const timestamp = new Date().toISOString();
    const username = localStorage.getItem('YopshLoc_Username');
    if (!username) {
        displayMessage('gamerMessage', 'No username found in local storage.', 'red');
        return;
    }
    const data = {
        timestamp: timestamp,
        experience: experience,
        username: username
    };
    document.getElementById('gamerLoader').style.display = 'block';
    fetch('https://script.google.com/macros/s/AKfycbzI6eULoTKyD_kiRGmi10unORWu356Nk4ZKv7l6ZpSy888vsFhB_vaWNssT_xe_53Ro/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(() => {
        document.getElementById('gamerLoader').style.display = 'none';
        displayMessage('gamerMessage', 'Experience Submitted Successfully!', 'green');
        document.getElementById('gamerForm').reset();
        setTimeout(() => {
            location.reload();  
        }, 5000);
    }).catch(error => {
        document.getElementById('gamerLoader').style.display = 'none';
        displayMessage('gamerMessage', 'Error: ' + error.message, 'red');
    });
});

document.getElementById('developerForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    document.getElementById('developerLoader').style.display = 'block';
    const experience = document.getElementById('developerExperience').value;
    const timestamp = new Date().toISOString();
    const username = localStorage.getItem('YopshLoc_Username');
    if (!username) {
        displayMessage('developerMessage', 'No username found.', 'red');
        document.getElementById('developerLoader').style.display = 'none'; // Hide the loader if there's an error
        return;
    }
    const imageFile = document.getElementById('developerImage').files[0];
    if (!imageFile) {
        displayMessage('developerMessage', 'Please select an image to upload.', 'red');
        document.getElementById('developerLoader').style.display = 'none'; // Hide the loader if there's an error
        return;
    }
    try {
        const imgbbApiKey = 'd524b55a2d4e0701e1706a7924c10e0c';
        const imageUrl = await uploadImageToImgbb(imageFile, imgbbApiKey);
        const data = {
            timestamp: timestamp,
            experience: experience,
            imageUrl: imageUrl,
            username: username
        };
        await fetch('https://script.google.com/macros/s/AKfycbwTrruD_7YQbI5s5Tn-MYLNexSSWxqSn4LPnrLo-rl4XVcy8p_v9iHA7jIBtONMyyL9/exec', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        document.getElementById('developerLoader').style.display = 'none';
        displayMessage('developerMessage', 'Game Details Submitted Successfully!', 'green');
        document.getElementById('developerForm').reset();
        setTimeout(() => {
            location.reload();  
        }, 5000);
    } catch (error) {
        document.getElementById('developerLoader').style.display = 'none';
        displayMessage('developerMessage', 'Error: ' + error.message, 'red');
    }
});

async function uploadImageToImgbb(imageFile, apiKey) {
    const formData = new FormData();
    formData.append('image', imageFile);
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData
    });
    const data = await response.json();
    if (data.success) {
        return data.data.url;
    } else {
        throw new Error('Image upload failed');
    }
}

function displayMessage(messageId, message, color) {
    const messageDiv = document.getElementById(messageId);
    messageDiv.textContent = message;
    messageDiv.style.color = color;
}
