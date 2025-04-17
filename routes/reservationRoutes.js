const express = require('express');
const router = express.Router();
const Reservation = require('../models/reservationModel');

router.get('/occupancy', async (req, res) => {
	try {
		const { date, platform } = req.query;

		if (!date || !platform) {
			return res.status(400).json({ error: 'Brak daty lub platformy' });
		}

		const startOfDay = new Date(date);
		startOfDay.setHours(0, 0, 0, 0);

		const endOfDay = new Date(date);
		endOfDay.setHours(23, 59, 59, 999);

		if (isNaN(startOfDay.getTime()) || isNaN(endOfDay.getTime())) {
			return res.status(400).json({ error: 'Nieprawidłowy format daty' });
		}

		const reservations = await Reservation.find({
			date: { $gte: startOfDay, $lte: endOfDay },
			platform: platform,
			status: { $ne: 'cancelled' },
		});

		res.json({
			success: true,
			data: reservations,
			query: { date, platform },
		});
	} catch (error) {
		console.error('Błąd pobierania danych:', error);
		res.status(500).json({ success: false, error: 'Błąd serwera', details: error.message });
	}
});

router.post('/reservations', async (req, res) => {
	try {
		console.log('Przychodzące dane rezerwacji:', req.body);

		const { date, platform, duration } = req.body;

		const OPENING_HOUR = 8;
		const CLOSING_HOUR = 23;

		const limits = { PC: 20, PS: 3, XBOX: 3 };

		// Validation of input data
		if (!date || !platform || !duration) {
			return res.status(400).json({ message: 'Brak wymaganych pól: date, platform lub duration' });
		}

		// Conversion of date to Date object
		const reservationDate = new Date(date);
		if (isNaN(reservationDate.getTime())) {
			return res.status(400).json({ message: 'Nieprawidłowy format daty' });
		}

		const now = new Date();
		if (reservationDate < now) {
			return res.status(400).json({ message: 'Nie można zarezerwować stanowiska w przeszłości.' });
		}

		// Get the hour of the reservation
		const reservationHour = reservationDate.getHours();
		if (reservationHour < 0 || reservationHour > 23) {
			return res.status(400).json({ message: 'Nieprawidłowa godzina rezerwacji.' });
		}

		// Validation of opening hours
		if (reservationHour < OPENING_HOUR || reservationHour >= CLOSING_HOUR) {
			return res.status(400).json({
				message: `Lokal jest otwarty tylko w godzinach ${OPENING_HOUR}:00-${CLOSING_HOUR}:00`,
			});
		}

		// Check if reservation exceeds opening hours
		if (reservationHour + parseInt(duration) > CLOSING_HOUR) {
			return res.status(400).json({
				message: `Rezerwacja wykracza poza godziny otwarcia. Maksymalny czas do ${CLOSING_HOUR}:00`,
			});
		}

		// Calculate the date range (all day)
		const startOfDay = new Date(reservationDate);
		startOfDay.setHours(0, 0, 0, 0);

		const endOfDay = new Date(reservationDate);
		endOfDay.setHours(23, 59, 59, 999);

		// Get all bookings for the day and platform
		const sameDayReservations = await Reservation.find({
			platform,
			date: { $gte: startOfDay, $lte: endOfDay },
			status: { $ne: 'cancelled' },
		});

		// Create a map of busy hours
		const hourlyCount = Array(23).fill(0);
		sameDayReservations.forEach(res => {
			const resDate = new Date(res.date);
			const resHour = resDate.getHours();
			const resDuration = parseInt(res.duration) || 1;

			for (let i = 0; i < resDuration; i++) {
				const hour = resHour + i;
				if (hour < 23) {
					hourlyCount[hour]++;
				}
			}
		});

		// Check if reservation exceeds opening hours
		for (let i = 0; i < duration; i++) {
			const hour = reservationHour + i;
			if (hour >= 23) {
				return res.status(400).json({ message: 'Rezerwacja wykracza poza godziny otwarcia.' });
			}
			if (hourlyCount[hour] >= limits[platform]) {
				return res.status(400).json({
					message: `Brak wolnych stanowisk o godzinie ${hour}:00.`,
				});
			}
		}

		// Create and save the new reservation
		const newReservation = new Reservation({
			...req.body,
			date: reservationDate,
			duration: parseInt(duration),
			price: parseFloat(req.body.price),
			status: 'pending',
		});

		await newReservation.save();

		res.status(201).json({
			message: 'Rezerwacja zapisana pomyślnie!',
			reservationId: newReservation._id,
		});
	} catch (error) {
		console.error('Błąd podczas zapisywania rezerwacji:', error);
		res.status(500).json({
			message: 'Wystąpił błąd serwera',
			error: error.message,
		});
	}
});
module.exports = router;
