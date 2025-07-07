import CONFIG from '../config/config-client.js';

document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('contact-form-id');

	form.addEventListener('submit', async e => {
		e.preventDefault();

		const email = form.email.value;
		const message = form.message.value;

		const res = await fetch(`${CONFIG.baseURL}/api/contact`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, message }),
		});

		const result = await res.json();
		if (result.success) {
			alert('Wiadomość wysłana! 👍');
			form.reset();
		} else {
			alert('Ups! Coś poszło nie tak 😢');
		}
	});
});
