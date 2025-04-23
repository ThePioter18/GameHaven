const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

router.post('/contact', async (req, res) => {
	const { email, message } = req.body;

	try {
		const transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 465, // port SSL
			secure: true, // use SSL
			auth: {
				user: process.env.CONTACT_EMAIL, // your business contact email
				pass: process.env.CONTACT_PASSWORD, // your generated gmail password for company name
			},
			tls: process.env.NODE_ENV === 'development' ? { rejectUnauthorized: false } : undefined,
		});

		const mailOptions = {
			from: email,
			to: process.env.CONTACT_EMAIL,
			subject: '📩 Wiadomość z formularza GameHaven',
			text: `Email: ${email}\nWiadomość: ${message}`,
		};

		await transporter.sendMail(mailOptions);

		res.status(200).json({ success: true, message: 'Wiadomość została wysłana pomyślnie.' });
	} catch (error) {
		console.error('Błąd podczas wysyłania wiadomości:', error);
		res.status(500).json({ success: false, message: 'Wystąpił błąd serwera.' });
	}
});

module.exports = router;
