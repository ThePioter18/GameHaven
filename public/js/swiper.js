const swiper = new Swiper('.swiper', {
	direction: 'horizontal',
	loop: true,

	autoplay: {
		delay: 3000,
		disableOnInteraction: false,
	},

	slidesPerView: 1,
	spaceBetween: 20,

	// Responsive breakpoints
	breakpoints: {
		768: {
			slidesPerView: 2,
			spaceBetween: 30,
		},
		992: {
			slidesPerView: 3,
			spaceBetween: 10,
		},
		1200: {
			slidesPerView: 4,
			spaceBetween: 0,
		},
	},

	pagination: {
		el: '.swiper-pagination',
		clickable: true,
	},

	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
});
