const express = require('express');
const router = express.Router();
const Reservation = require('../models/reservationModel');
const { DateTime } = require('luxon');

router.get('/occupancy', async (req, res) => {
	try {
		const { date, platform } = req.query;

		if (!date || !platform) {
			return res.status(400).json({ error: 'Brak daty lub platformy' });
		}

		const isoDate = date.includes('T') ? date : date.replace(' ', 'T');
		const dateTime = DateTime.fromISO(isoDate);

		if (!dateTime.isValid) {
			return res.status(400).json({ error: 'Nieprawidłowy format daty' });
		}

		const startOfDay = dateTime.startOf('day').toJSDate();
		const endOfDay = dateTime.endOf('day').toJSDate();

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
		const { date, platform, duration } = req.body;

		const OPENING_HOUR = 8;
		const CLOSING_HOUR = 23;

		const limits = { PC: 20, PS: 3, XBOX: 3 };

		// Validation of input data
		if (!date || !platform || !duration) {
			return res.status(400).json({ message: 'Brak wymaganych pól: date, platform lub duration' });
		}

		// Conversion of date to Date object
		const reservationDate = DateTime.fromISO(date, { zone: 'utc' });

		if (!reservationDate.isValid) {
			return res.status(400).json({ message: 'Nieprawidłowy format daty' });
		}

		const now = new Date();
		if (reservationDate < now) {
			return res.status(400).json({ message: 'Nie można zarezerwować stanowiska w przeszłości.' });
		}

		const reservationJSDate = reservationDate.toJSDate();

		// Get the hour of the reservation
		const reservationHourWarsaw = reservationDate.setZone('Europe/Warsaw').hour;

		if (reservationHourWarsaw < 0 || reservationHourWarsaw > 23) {
			return res.status(400).json({ message: 'Nieprawidłowa godzina rezerwacji.' });
		}

		// Validation of opening hours
		if (reservationHourWarsaw < OPENING_HOUR || reservationHourWarsaw >= CLOSING_HOUR) {
			return res.status(400).json({
				message: `Lokal jest otwarty tylko w godzinach ${OPENING_HOUR}:00-${CLOSING_HOUR}:00`,
			});
		}

		// Check if reservation exceeds opening hours
		if (reservationHourWarsaw + parseInt(duration) > CLOSING_HOUR) {
			return res.status(400).json({
				message: `Rezerwacja wykracza poza godziny otwarcia. Maksymalny czas do ${CLOSING_HOUR}:00`,
			});
		}

		// Calculate the date range (all day)
		const startOfDay = reservationDate.startOf('day').toJSDate();
		const endOfDay = reservationDate.endOf('day').toJSDate();

		// Get all bookings for the day and platform
		const sameDayReservations = await Reservation.find({
			platform,
			date: { $gte: startOfDay, $lte: endOfDay },
			status: { $ne: 'cancelled' },
		});

		// Create a map of busy hours
		const hourlyCount = Array(23).fill(0);
		sameDayReservations.forEach(res => {
			const resDate = DateTime.fromJSDate(res.date).setZone('Europe/Warsaw');
			const resHour = resDate.hour;
			const resDuration = parseInt(res.duration) || 1;

			for (let i = 0; i < resDuration; i++) {
				const hour = resHour + i;
				if (hour < CLOSING_HOUR) {
					hourlyCount[hour]++;
				}
			}
		});

		// Check if reservation exceeds opening hours
		for (let i = 0; i < duration; i++) {
			const hour = reservationHourWarsaw + i;
			if (hour >= CLOSING_HOUR) {
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
			date: reservationJSDate,
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
