document.addEventListener('DOMContentLoaded', function () {
	const video = document.querySelector('.hero-video video');
	if (video) {
		video.playbackRate = 0.6;

		video.addEventListener('ended', () => {
			video.classList.add('end');

			setTimeout(() => {
				video.currentTime = 0;
				video.classList.remove('end');
				video.play();
			}, 4000);
		});
	}
});
