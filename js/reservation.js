let selectedPrice = 0;
function setReservation(price, platform) {
	selectedPrice = price;

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

// Modyfication of the function updating the price
document.getElementById('timeSelection').addEventListener('change', function () {
	const selectedOption = this.options[this.selectedIndex];
	const price = selectedOption.getAttribute('data-price');

	selectedPrice = Number(price);

	updateTotalPrice(); // Updating the total after the time change
});

// Function to update the total price
function updateTotalPrice() {
	const accessoriesPrice = parseFloat(document.getElementById('accessoriesPrice').innerText) || 0;
	const totalPrice = selectedPrice + accessoriesPrice;

	document.getElementById('totalPrice').innerText = totalPrice.toFixed(2);
}

// Flatpickr initialisation
function initializeFlatpickr() {
	return flatpickr('#datePicker', {
		enableTime: true,
		dateFormat: 'Y-m-d H:i',
		minDate: 'today',
		time_24hr: true,
		appendTo: document.body,
		static: true,
		locale: { firstDayOfWeek: 1 },
		allowInput: true,
		disableMobile: true,
		closeOnSelect: false,
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

// Form validation function
function validateForm() {
	const name = document.getElementById('name').value.trim();
	const email = document.getElementById('email').value.trim();
	const date = document.getElementById('datePicker').value.trim();
	const reserveButton = document.getElementById('reserveButton');

	// Unblock button if all fields are filled in
	if (name && email && date) {
		reserveButton.disabled = false;
	} else {
		reserveButton.disabled = true;
	}
}

// Function clearing the form
function resetReservationForm() {
	document.getElementById('name').value = '';
	document.getElementById('email').value = '';
	document.getElementById('datePicker').value = '';

	datePicker.destroy();
	datePicker = initializeFlatpickr();

	const timeSelect = document.getElementById('timeSelection');
	if (timeSelect.options.length > 0) {
		timeSelect.selectedIndex = 0;
		selectedPrice = Number(timeSelect.options[0].getAttribute('data-price'));
	}
	document.getElementById('reserveButton').disabled = true;
}

document.getElementById('name').addEventListener('input', validateForm);
document.getElementById('email').addEventListener('input', validateForm);
document.getElementById('datePicker').addEventListener('input', validateForm);

// Reservation handling
document.getElementById('reservationForm').addEventListener('submit', function (event) {
	event.preventDefault();

	let modal = bootstrap.Modal.getInstance(document.getElementById('reservationModal'));
	modal.hide();

	let confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
	confirmationModal.show();

	// clear form
	resetReservationForm();
});

// Added also clearing when closing the reservation modal
document.getElementById('reservationModal').addEventListener('hidden.bs.modal', function () {
	resetReservationForm();
});
