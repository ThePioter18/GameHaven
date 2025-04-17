// Selected price
let selectedPrice = 0;
// Track date picker interaction
let datePickerTouched = false;

function setReservation(price, platform) {
	selectedPrice = price;
	document.getElementById('selectedPlatform').textContent = platform; // show platform name

	// Accessories for PC are 0 zł and for PS and XBOX are 5 zł
	const accessoriesPrice = platform === 'PS' || platform === 'XBOX' ? 5 : 0;
	document.getElementById('accessoriesPrice').innerText = accessoriesPrice;

	// Generate options for the selected platform
	generateTimeOptions(platform);
}

// Function generate time options
function generateTimeOptions(platform) {
	const prices = {
		PC: { 1: 18, 3: 49, 5: 69, 8: 99 },
		PS: { 1: 15, 3: 39, 5: 59, 8: 89 },
		XBOX: { 1: 15, 3: 39, 5: 59, 8: 89 },
	};

	const timeSelect = document.getElementById('timeSelection');
	const platformPrices = prices[platform];

	// Clear existing options
	timeSelect.innerHTML = '';

	// Added new options
	for (const hours in platformPrices) {
		const price = platformPrices[hours];
		const option = document.createElement('option');
		option.value = hours;
		option.setAttribute('data-price', price);

		// Appropriate variation of the word ‘hour’
		if (hours === '1' || hours === 1) {
			option.textContent = `${hours} godzina - ${price} zł`;
		} else {
			option.textContent = `${hours} godzin - ${price} zł`;
		}

		timeSelect.appendChild(option);
	}

	// Select first option and update price
	if (timeSelect.options.length > 0) {
		timeSelect.selectedIndex = 0;
		selectedPrice = Number(timeSelect.options[0].getAttribute('data-price'));
		updateTotalPrice(); // Update of total after selection of first option
	}
}

// Get variables
const infoEl = document.getElementById('infoMessage');
const errorEl = document.getElementById('errorMessage');

// Modyfication of the function updating the price
document.getElementById('timeSelection').addEventListener('change', function () {
	const selectedOption = this.options[this.selectedIndex];
	const price = selectedOption.getAttribute('data-price');

	const duration = parseInt(this.value);
	const datePicker = document.getElementById('datePicker');

	// If user don't choose date, we don't check hours
	if (!datePicker.value) {
		errorEl.innerText = '';
		return;
	}

	const selectedHour = new Date(datePicker.value).getHours();

	if (selectedHour + duration > 23) {
		const maxStartHour = 23 - duration;
		errorEl.innerText = `Dla ${duration}h rezerwacji maksymalna godzina rozpoczęcia to ${maxStartHour}:00`;
		infoEl.innerText = '';
		infoEl.classList.add('d-none');
	} else if (duration == 1) {
		// If everything is OK, we clear the error
		errorEl.innerText = '';
	}

	selectedPrice = Number(price);

	updateTotalPrice(); // Updating the total after the time change
});

// Function to update the total price
function updateTotalPrice() {
	const accessoriesPrice = parseFloat(document.getElementById('accessoriesPrice').innerText) || 0;
	const totalPrice = selectedPrice + accessoriesPrice;

	document.getElementById('totalPrice').innerText = totalPrice.toFixed(2);
}

// Track which fields were touched by user
const touchedFields = {
	name: false,
	email: false,
	phone: false,
	date: false,
};

// Form validation function
function validateForm(validateAll = false) {
	const name = document.getElementById('name').value.trim();
	const email = document.getElementById('email').value.trim();
	const phone = document.getElementById('phone').value.trim();
	const date = document.getElementById('datePicker').value.trim();
	const reserveButton = document.getElementById('reserveButton');
	let valid = true;

	// Validate name only if touched or validateAll is true
	if (touchedFields.name || validateAll) {
		const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿĄĆĘŁŃÓŚŹŻąćęłńóśźż\s]{2,}$/;
		if (name === '') {
			valid = false;
			document.getElementById('name').classList.add('is-invalid');
			document.getElementById('nameError').textContent = 'To pole jest wymagane';
		} else if (!nameRegex.test(name)) {
			valid = false;
			document.getElementById('name').classList.add('is-invalid');
			if (name.length < 2) {
				document.getElementById('nameError').textContent = 'Imię musi mieć co najmniej 2 znaki';
			} else {
				document.getElementById('nameError').textContent = 'Dozwolone są tylko litery i spacje';
			}
		} else {
			document.getElementById('name').classList.remove('is-invalid');
		}
	}
	// Validate email only if touched or validateAll is true
	if (touchedFields.email || validateAll) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (email === '') {
			valid = false;
			document.getElementById('email').classList.add('is-invalid');
			document.getElementById('emailError').textContent = 'To pole jest wymagane';
		} else if (!emailRegex.test(email)) {
			valid = false;
			document.getElementById('email').classList.add('is-invalid');
			document.getElementById('emailError').textContent = 'Proszę podać poprawny adres email (np. przyklad@domena.pl)';
		} else {
			document.getElementById('email').classList.remove('is-invalid');
		}
	}

	// Validate phone only if touched or validateAll is true
	if (touchedFields.phone || validateAll) {
		const phoneRegex = /^\d{3}-\d{3}-\d{3}$/;
		if (phone === '') {
			valid = false;
			document.getElementById('phone').classList.add('is-invalid');
			document.getElementById('phoneError').textContent = 'To pole jest wymagane';
		} else if (!phoneRegex.test(phone)) {
			valid = false;
			document.getElementById('phone').classList.add('is-invalid');
			document.getElementById('phoneError').textContent = 'Proszę podać numer w formacie XXX-XXX-XXX';
		} else {
			document.getElementById('phone').classList.remove('is-invalid');
		}
	}

	// Date - always validate if required
	if ((datePickerTouched || validateAll) && !date) {
		valid = false;
		document.getElementById('datePicker').classList.add('is-invalid');
		document.getElementById('dateError').textContent = 'Proszę wybrać datę';
		document.getElementById('dateError').style.display = 'block';
	} else if (date) {
		document.getElementById('datePicker').classList.remove('is-invalid');
		document.getElementById('dateError').style.display = 'none';
	}

	reserveButton.disabled = !valid;
}

function getRoundedCurrentHour() {
	const now = new Date();
	now.setMinutes(0, 0, 0);
	now.setHours(now.getHours() + 1);
	return now;
}

// Flatpickr initialisation
function initializeFlatpickr() {
	return flatpickr('#datePicker', {
		enableTime: true,
		noCalendar: false,
		minuteIncrement: 60, //Full hours only
		dateFormat: 'Y-m-d H:i',
		minDate: 'today',
		time_24hr: true,
		defaultDate: getRoundedCurrentHour(),
		appendTo: document.body,
		static: true,
		locale: { firstDayOfWeek: 1 },
		allowInput: true,
		disableMobile: true,
		closeOnSelect: false,
		minTime: '08:00',
		maxTime: '22:00',

		onValueUpdate: function (selectedDates) {
			const selectedHour = selectedDates[0].getHours();
			if (selectedHour >= 22) {
				// Automatically correct the time
				this.setDate(new Date(selectedDates[0].setHours(22, 0, 0, 0)));
				infoEl.innerText = `Uwaga! Od godziny 22:00 można zarezerwować tylko do godziny 23:00.`;
				infoEl.classList.remove('d-none');
			}
		},
		onChange: function () {
			datePickerTouched = true;
			validateForm();
		},

		onReady: (selectedDates, dateStr, instance) => {
			const buttonContainer = document.createElement('div');
			buttonContainer.className = 'flatpickr-button-container';
			buttonContainer.style.textAlign = 'center';
			buttonContainer.style.padding = '10px';

			const okButton = document.createElement('button');
			okButton.innerHTML = 'Potwierdź';
			okButton.className = 'btn btn-sm btn-primary';
			okButton.type = 'button';
			okButton.style.width = '100%';
			okButton.addEventListener('click', () => {
				instance.close();
				validateForm();
			});

			buttonContainer.appendChild(okButton);
			instance.calendarContainer.appendChild(buttonContainer);
		},
		onClose: validateForm,
	});
}

let datePicker = initializeFlatpickr();

// Date field click support
document.getElementById('datePicker').addEventListener('focus', function () {
	datePickerTouched = true;
});

// Track field interactions
['name', 'email', 'phone', 'datePicker'].forEach(id => {
	const field = document.getElementById(id);

	field.addEventListener('focus', () => {
		touchedFields[id === 'datePicker' ? 'date' : id] = true;
	});

	field.addEventListener('input', () => {
		touchedFields[id === 'datePicker' ? 'date' : id] = true;
		validateForm();
	});
});

// Phone formatting (unchanged)
document.getElementById('phone').addEventListener('input', function (event) {
	let phone = this.value.replace(/\D/g, '');
	if (phone.length > 9) phone = phone.slice(0, 9);

	if (phone.length > 6) {
		phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
	} else if (phone.length > 3) {
		phone = phone.slice(0, 3) + '-' + phone.slice(3);
	}

	this.value = phone;
	validateForm();
});

// Function clearing the form
function resetReservationForm() {
	document.getElementById('name').value = '';
	document.getElementById('email').value = '';
	document.getElementById('phone').value = '';
	document.getElementById('datePicker').value = '';

	// Resetting errors
	['name', 'email', 'phone', 'datePicker'].forEach(id => {
		document.getElementById(id).classList.remove('is-invalid');
	});

	// Resetting the tracking of affected fields
	Object.keys(touchedFields).forEach(key => {
		touchedFields[key] = false;
	});

	const timeSelect = document.getElementById('timeSelection');
	if (timeSelect.options.length > 0) {
		timeSelect.selectedIndex = 0;
		selectedPrice = Number(timeSelect.options[0].getAttribute('data-price'));
	}
	document.getElementById('reserveButton').disabled = true;

	datePickerTouched = false;
	document.getElementById('dateError').style.display = 'none';
}

document.getElementById('reservationForm').addEventListener('submit', async function (event) {
	event.preventDefault();

	validateForm(true); // Validate all fields on submit

	// Only proceed if form is valid
	if (!document.getElementById('reserveButton').disabled) {
		const name = document.getElementById('name').value;
		const email = document.getElementById('email').value;
		const phone = document.getElementById('phone').value;
		const dateInput = document.getElementById('datePicker').value;
		const duration = document.getElementById('timeSelection').value;
		const platform = document.getElementById('selectedPlatform').innerText;
		const price = document.getElementById('totalPrice').innerText;

		const date = new Date(dateInput).toISOString();

		const reservationData = {
			name,
			email,
			phone,
			date,
			duration,
			platform,
			price,
		};

		try {
			const response = await fetch('http://localhost:5000/api/reservations', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(reservationData),
			});

			const data = await response.json();

			if (response.ok) {
				let modal = bootstrap.Modal.getInstance(document.getElementById('reservationModal'));
				modal.hide();
				new bootstrap.Modal(document.getElementById('confirmationModal')).show();

				resetReservationForm();
			} else {
				errorEl.innerText = `Błąd: ${data.message}`;
			}
		} catch (error) {
			console.error('Błąd połączenia z serwerem:', error);
			errorEl.innerText = 'Nie udało się połączyć z serwerem.';
			resetReservationForm();
		}
	}
});

// Added also clearing when closing the reservation modal
document.getElementById('reservationModal').addEventListener('hidden.bs.modal', function () {
	resetReservationForm();
	errorEl.innerText = '';
	infoEl.innerText = '';
	infoEl.classList.add('d-none');
});

// Function loading availability
async function loadOccupancyInfo(date, platform) {
	const occupancyList = document.querySelector('.occupancy-list');
	const loadingIndicator = document.querySelector('.loading-indicator');

	// Show loader
	loadingIndicator.style.display = 'block';
	occupancyList.innerHTML = '';

	// Give the browser a moment to show the loader
	await new Promise(resolve => setTimeout(resolve, 0));

	try {
		const response = await fetch(
			`http://localhost:5000/api/occupancy?date=${encodeURIComponent(date)}&platform=${encodeURIComponent(platform)}`
		);

		if (!response.ok) {
			throw new Error(`Błąd HTTP! status: ${response.status}`);
		}

		const result = await response.json();

		if (!result.success) {
			throw new Error(result.error || 'Nieznany błąd');
		}

		const reservations = result.data;
		const limits = { PC: 20, PS: 3, XBOX: 3 };
		const TOTAL_SLOTS = limits[platform.toUpperCase()] || 0;
		const hoursStatus = Array(23).fill(0);

		// Processing of reservations
		reservations.forEach(reservation => {
			// For MongoDB data in the format "2025-04-14T09:00:00.000Z" -> Z: the time in UTC (universal time)
			const dateStr = reservation.date.includes('T') ? reservation.date : reservation.date.replace(' ', 'T');
			const reservationDate = new Date(dateStr);

			if (isNaN(reservationDate.getTime())) {
				console.warn('Nieprawidłowa data rezerwacji:', reservation.date);
				return;
			}

			const startHour = reservationDate.getHours();
			const duration = parseInt(reservation.duration) || 1;

			// Mark busy hours
			for (let i = 0; i < duration; i++) {
				const hour = startHour + i;
				if (hour < 24) {
					hoursStatus[hour]++;
				}
			}
		});

		setTimeout(() => {
			occupancyList.innerHTML = '';

			// In the loop generating the hours view
			for (let hour = 8; hour < 24; hour++) {
				const isAvailable = hour < 23; // Hours 8-22 available
				const busy = isAvailable ? hoursStatus[hour] || 0 : 0;
				const free = isAvailable ? TOTAL_SLOTS - busy : 0;

				const li = document.createElement('li');
				li.className = `d-flex justify-content-between align-items-center py-2 px-3 ${
					!isAvailable ? 'disabled-time' : ''
				}`;

				li.innerHTML = `
			    <span class="fw-bold">${hour.toString().padStart(2, '0')}:00</span>
			    <span>
			        ${
								isAvailable
									? `
			            <span class="${free <= 0 ? 'text-danger fw-bold' : 'text-success'}">
			                ${free} wolne
			            </span>
			            <span class="text-muted small ms-2">
			                (z ${TOTAL_SLOTS})
			            </span>
			            	${busy > 0 ? `<span class="text-secondary small ms-2">${busy} zajęte</span>` : ''}
			        	`
									: '<span class="text-muted">Zamknięte</span>'
							}
			    </span>
			`;

				occupancyList.appendChild(li);
			}

			loadingIndicator.style.display = 'none';
		}, 500);
	} catch (error) {
		console.error('Błąd ładowania dostępności:', error);

		occupancyList.innerHTML = `
            <li class="text-danger p-3">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                ${error.message}
            </li>
        `;
	}
}

document.getElementById('datePicker').addEventListener('change', function () {
	const rawDate = this.value;

	const date = rawDate.split('T')[0]; // Format YYYY-MM-DD HH

	const platform = document.getElementById('selectedPlatform').innerText.trim();

	if (date && platform) {
		loadOccupancyInfo(date, platform);
	}
});

// Update when the modal is opened
document.getElementById('reservationModal').addEventListener('shown.bs.modal', function () {
	const date = document.getElementById('datePicker').value;
	const platform = document.getElementById('selectedPlatform').innerText.trim();

	if (date && platform) {
		loadOccupancyInfo(date, platform);
	} else {
		document.querySelector('.occupancy-list').innerHTML = `
            <li class="text-warning">
                Wybierz datę i platformę, aby zobaczyć dostępność
            </li>
        `;
	}
});
