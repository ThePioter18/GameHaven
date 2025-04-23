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
app.use(cors());

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
