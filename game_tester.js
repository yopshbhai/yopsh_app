let allData = [];
	function showloaderGam(role) {
		if (role === 'gamer') {
			document.getElementById('loaderGam').style.display = 'block';
			document.querySelectorAll('#loaderGam .dot').forEach(dot => dot.style.display = 'inline-block');
			document.getElementById('content').style.display = 'none';
		} else {
			document.getElementById('loaderGamDev').style.display = 'block';
			document.querySelectorAll('#loaderGamDev .dot').forEach(dot => dot.style.display = 'inline-block');
			document.getElementById('devcontent').style.display = 'none';
		}
	}
	function hideloaderGam(role) {
		if (role === 'gamer') {
			document.getElementById('loaderGam').style.display = 'none';
			document.querySelectorAll('#loaderGam .dot').forEach(dot => dot.style.display = 'none');
			document.getElementById('content').style.display = 'block';
		} else {
			document.getElementById('loaderGamDev').style.display = 'none';
			document.querySelectorAll('#loaderGamDev .dot').forEach(dot => dot.style.display = 'none');
			document.getElementById('devcontent').style.display = 'block';
		}
	}
	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}
	function getTimeAgo(timestamp) {
		const currentTime = new Date();
		const timeDiff = currentTime - new Date(timestamp);
		const seconds = Math.floor(timeDiff / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);
		const months = Math.floor(days / 30);
		const years = Math.floor(days / 365);

		if (seconds < 60) return `${seconds} seconds ago`;
		else if (minutes < 60) return `${minutes} minutes ago`;
		else if (hours < 24) return `${hours} hours ago`;
		else if (days < 30) return `${days} days ago`;
		else if (months < 12) return `${months} months ago`;
		else return `${years} years ago`;
	}
	function displayData(data, role) {
		const contentDiv = document.getElementById(role === 'gamer' ? 'content' : 'devcontent');
		contentDiv.innerHTML = '';
		data.forEach(item => {
			const itemDiv = document.createElement('div');
			itemDiv.className = 'item';
			const timeAgo = getTimeAgo(item.timestamp);
			if (role === 'gamer') {
				itemDiv.innerHTML = `
					<p><strong>Posted:</strong> ${timeAgo}</p>
					<p><strong>Username:</strong> ${item.username}</p>
					<p><strong>Experience:</strong> ${item.title}</p>
					<p class="email"><strong>Email:</strong> ${item.email}</p>
					<button class="contact-btn" onclick="contactDeveloper('${item.email}', '${item.title}')">Contact</button>
				`;
			} else if (role === 'developer') {
				itemDiv.innerHTML = `
					<p><strong>Posted:</strong> ${timeAgo}</p>
					<p><strong>Title:</strong> ${item.title}</p>
					<p><strong>Username:</strong> ${item.username}</p>
					<p class="email"><strong>Email:</strong> ${item.email}</p>
					<img src="${item.imageUrl}" alt="${item.title}">
					<button class="contact-btn" onclick="contactDeveloper('${item.email}', '${item.title}')">Contact</button>
				`;
			}
			contentDiv.appendChild(itemDiv);
		});
	}
	function contactDeveloper(email, title) {
		const subject = encodeURIComponent(`Inquiry about ${title}`);
		const body = encodeURIComponent(`Hi, I would like to know more about your project titled "${title}".`);
		window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
	}
	function fetchData(role) {
		showloaderGam(role);
		fetch(role === 'gamer'
			? 'https://script.google.com/macros/s/AKfycbz5lQEO_X6e9VP_L-N6uLQG1UBCMj_M3u3n-9LUTpxKdQFcbA8oYTORUr9Ao6GxweGs/exec'
			: 'https://script.google.com/macros/s/AKfycbz5lQEO_X6e9VP_L-N6uLQG1UBCMj_M3u3n-9LUTpxKdQFcbA8oYTORUr9Ao6GxweGs/exec', {
			method: 'POST'
		})
		.then(response => response.json())
		.then(data => {
			allData = data;
			shuffleArray(allData);
			displayData(allData, role);
			hideloaderGam(role);
		})
		.catch(error => {
			console.error('Error:', error);
			document.getElementById(role === 'gamer' ? 'content' : 'devcontent').innerHTML = 'Error fetching data. Please try again later.';
			hideloaderGam(role);
		});
	}
	function showContent(role) {
		document.querySelector('.gamer-body').style.display = 'none'; 
		document.getElementById(role).style.display = 'block';
		localStorage.setItem('selectedRole', role);
		fetchData(role);
	}
	function loadContent() {
		const savedRole = localStorage.getItem('selectedRole');
		if (savedRole) {
			document.querySelector('.gamer-body').style.display = 'none';
			document.getElementById(savedRole).style.display = 'block';
			fetchData(savedRole);
		}
	}

	window.onload = loadContent;