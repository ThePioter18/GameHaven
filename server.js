const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config');
const reservationRoutes = require('./routes/reservationRoutes');
const contactRoutes = require('./routes/contactRoutes');
const path = require('path');

dotenv.config();
connectDB();

const app = express();
const allowedOrigins = ['http://127.0.0.1:5500', 'http://localhost:5500', 'https://gamehaven.netlify.app'];

app.use(
	cors({
		origin: function (origin, callback) {
			// Allow requests with no origin (like curl or mobile apps)
			if (!origin) return callback(null, true);
			if (allowedOrigins.includes(origin)) {
				return callback(null, true);
			} else {
				return callback(new Error('Not allowed by CORS'));
			}
		},
		credentials: true,
	})
);

app.use(express.json());

// Routes API
app.use('/api', reservationRoutes);
app.use('/api', contactRoutes);

app.use(express.static(path.join(__dirname)));

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
