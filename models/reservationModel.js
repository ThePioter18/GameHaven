const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
	{
		name: String,
		email: String,
		phone: String,
		date: Date,
		duration: Number, // for example: 1, 3, 5, 8
		platform: String, // PC, PS, XBOX
		price: Number,
		status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
	},
	{ versionKey: false }
);

module.exports = mongoose.model('Reservation', reservationSchema);
