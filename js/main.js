document.addEventListener('DOMContentLoaded', function () {
	const nav = document.querySelector('.navbar');
	function addShadow() {
		if (window.scrollY >= 100) {
			nav.classList.add('shadow-bg');
		} else {
			nav.classList.remove('shadow-bg');
		}
	}

	window.addEventListener('scroll', addShadow);
});

const homeHeader = document.querySelector('#home');
const video = document.querySelector('.video');
const toggleBackgroundBtn = document.querySelector('.toggle-background');

toggleBackgroundBtn.addEventListener('click', () => {
	if (homeHeader.classList.contains('hero-video')) {
		homeHeader.classList.remove('hero-video');
		video.classList.add('d-none');
		homeHeader.classList.add('hero-img');
		toggleBackgroundBtn.textContent = 'Zmień tło na wideo';
	} else if (homeHeader.classList.contains('hero-img')) {
		homeHeader.classList.remove('hero-img');
		video.classList.remove('d-none');
		homeHeader.classList.add('hero-video');
		toggleBackgroundBtn.textContent = 'Zmień tło na obraz';
	}
});
