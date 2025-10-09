const express = require('express');
const router = express.Router();
const { Resend } = require('resend');
require('dotenv').config();

router.post('/contact', async (req, res) => {
	const { email, message } = req.body;

	try {
		const resend = new Resend(process.env.RESEND_API_KEY);
		await resend.emails.send({
			from: `GameHaven <${process.env.CONTACT_EMAIL}>`,
			to: process.env.CONTACT_EMAIL,
			reply_to: email,
			subject: '📩 Wiadomość z formularza GameHaven',
			html: `
				<h3>Wiadomość z formularza kontaktowego</h3>
				<p><strong>Email klienta:</strong> ${email}</p>
				<p><strong>Wiadomość:</strong></p>
				<p>${message}</p>
			`,
		});

		res.status(200).json({ success: true, message: 'Wiadomość została wysłana pomyślnie.' });
	} catch (error) {
		console.error('Błąd podczas wysyłania wiadomości:', error);
		res.status(500).json({ success: false, message: 'Wystąpił błąd serwera.' });
	}
});

module.exports = router;
