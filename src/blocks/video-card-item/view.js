/**
 * Video Card Item - Frontend View Script
 * Handles the "Click to Load" facade functionality.
 */

document.addEventListener('DOMContentLoaded', () => {
	// Find all video facades on the page
	const facades = document.querySelectorAll('.fc-video-facade');

	facades.forEach((facade) => {
		// specific click listener for each facade
		facade.addEventListener('click', function (e) {
			e.preventDefault();

			const videoId = this.dataset.videoId;
			const title = this.dataset.title || 'Video';

			if (!videoId) return;

			// Create the iframe element
			const iframe = document.createElement('iframe');
			
			// Construct YouTube URL with autoplay
			const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
			
			iframe.setAttribute('src', src);
			iframe.setAttribute('title', title);
			iframe.setAttribute('frameborder', '0');
			iframe.setAttribute(
				'allow',
				'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
			);
			iframe.setAttribute('allowfullscreen', 'true');
			
			// Style it to fill the container
			iframe.style.position = 'absolute';
			iframe.style.top = '0';
			iframe.style.left = '0';
			iframe.style.width = '100%';
			iframe.style.height = '100%';

			// Clear the facade (image + button) and append the iframe
			this.innerHTML = '';
			this.appendChild(iframe);
		});
	});
});
