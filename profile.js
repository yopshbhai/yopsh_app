const fetchUrl = 'https://script.google.com/macros/s/AKfycbyqbfSOzJOLOx1ARZwfl6coMspIxPqJVwNxa8BEmcygz66a_qRI0QO77yeFYC-nw-Pq/exec';

document.addEventListener('DOMContentLoaded', () => {
  const storedUserId = localStorage.getItem('YopshLoc_UserId');
  if (storedUserId) {
    fetchUserDetails(storedUserId);
  }
});

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  showLoader();
  fetch(fetchUrl)
    .then(response => response.json())
    .then(data => {
      hideLoader();
      const user = data.find(user => user.username === username && user.password === password);
      if (user) {
        const userId = generateUserId(user);
        localStorage.setItem('YopshLoc_UserId', userId);
        localStorage.setItem('YopshLoc_Username', user.username);
        displayUserDetails(user);
        updateLastLogin(user.username);
      } else {
        showCustomAlert('Invalid username or password');
      }
    })
    .catch(error => {
      hideLoader();
      console.error('Error fetching data:', error);
    });
}

function updateLastLogin(username) {
  const formData = new FormData();
  formData.append('action', 'updateLastLogin');
  formData.append('username', username);

  fetch(fetchUrl, {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(result => {
    if (result.success) {
      console.log('Last login updated successfully');
    } else {
      console.error('Failed to update last login');
    }
  })
  .catch(error => {
    console.error('Error updating last login:', error);
  });
}

function fetchUserDetails(userId) {
  showLoader();
  fetch(fetchUrl)
    .then(response => response.json())
    .then(data => {
      hideLoader();
      const user = data.find(user => generateUserId(user) === userId);
      if (user) {
        displayUserDetails(user);
        updateLastLogin(user.username);
      } else {
        logout();
      }
    })
    .catch(error => {
      hideLoader();
      console.error('Error fetching data:', error);
    });
}

function displayUserDetails(user) {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('userDetails').style.display = 'block';

  document.getElementById('userImage').src = user.image;
  document.getElementById('userEmail').innerText = user.email;
  document.getElementById('userName').innerText = user.name;
  document.getElementById('userAge').innerText = user.age;
  document.getElementById('userMobile').innerText = user.mobile;
  document.getElementById('userGender').innerText = user.gender;
}

function generateUserId(user) {
  const seed = user.username + user.email + user.mobile;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString().padStart(10, '0');
}

function showLoader() {
  document.body.classList.add('loading');
  document.getElementById('loader').style.display = 'block';
}

function hideLoader() {
  document.body.classList.remove('loading');
  document.getElementById('loader').style.display = 'none';
}

function showCustomAlert(message) {
  document.getElementById('alertMessage').innerText = message;
  document.getElementById('customAlert').style.display = 'block';
}

function closeCustomAlert() {
  document.getElementById('customAlert').style.display = 'none';
}

function logout() {
  localStorage.removeItem('YopshLoc_UserId');
  localStorage.removeItem('YopshLoc_Username');
  document.getElementById('userDetails').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
}
document.getElementById('toggleButton').addEventListener('click', function() {
  const div = document.getElementById('myDiv');
  const arrow = document.querySelector('.arrow');

  if (div.style.display === 'none' || div.style.display === '') {
    div.style.display = 'block';
    arrow.classList.remove('arrow-right');
    arrow.classList.add('arrow-down');
  } else {
    div.style.display = 'none';
    arrow.classList.remove('arrow-down');
    arrow.classList.add('arrow-right');
  }
});
