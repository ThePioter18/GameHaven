const { Resend } = require('resend');
require('dotenv').config();

exports.handler = async function (event) {
	if (event.httpMethod !== 'POST') {
		return { statusCode: 405, body: JSON.stringify({ success: false, message: 'Method not allowed' }) };
	}

	try {
		const { email, message } = JSON.parse(event.body);
		const resend = new Resend(process.env.RESEND_API_KEY);

		await resend.emails.send({
			from: 'GameHaven <onboarding@resend.dev>',
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

		return { statusCode: 200, body: JSON.stringify({ success: true }) };
	} catch (error) {
		console.error('❌ Błąd wysyłania wiadomości:', error);
		return { statusCode: 500, body: JSON.stringify({ success: false }) };
	}
};
