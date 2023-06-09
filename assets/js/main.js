(function () {
	'use strict';
	const select = (el, all = false) => {
		el = el.trim();
		if (all) {
			return [...document.querySelectorAll(el)];
		} else {
			return document.querySelector(el);
		}
	};
	const on = (type, el, listener, all = false) => {
		let selectEl = select(el, all);
		if (selectEl) {
			if (all) {
				selectEl.forEach((e) => e.addEventListener(type, listener));
			} else {
				selectEl.addEventListener(type, listener);
			}
		}
	};
	const onscroll = (el, listener) => {
		el.addEventListener('scroll', listener);
	};
	let navbarlinks = select('#navbar .scrollto', true);
	const navbarlinksActive = () => {
		let position = window.scrollY + 200;
		navbarlinks.forEach((navbarlink) => {
			if (!navbarlink.hash) return;
			let section = select(navbarlink.hash);
			if (!section) return;
			if (position >= section.offsetTop && position <= section.offsetTop + section.offsetHeight) {
				navbarlink.classList.add('active');
			} else {
				navbarlink.classList.remove('active');
			}
		});
	};
	window.addEventListener('load', navbarlinksActive);
	onscroll(document, navbarlinksActive);
	const scrollto = (el) => {
		let header = select('#header');
		let offset = header.offsetHeight;

		if (!header.classList.contains('header-scrolled')) {
			offset -= 16;
		}

		let elementPos = select(el).offsetTop;
		window.scrollTo({
			top: elementPos - offset,
			behavior: 'smooth'
		});
	};
	let selectHeader = select('#header');
	if (selectHeader) {
		let headerOffset = selectHeader.offsetTop;
		let nextElement = selectHeader.nextElementSibling;
		const headerFixed = () => {
			if (headerOffset - window.scrollY <= 0) {
				selectHeader.classList.add('fixed-top');
				nextElement.classList.add('scrolled-offset');
			} else {
				selectHeader.classList.remove('fixed-top');
				nextElement.classList.remove('scrolled-offset');
			}
		};
		window.addEventListener('load', headerFixed);
		onscroll(document, headerFixed);
	}
	let backtotop = select('.back-to-top');
	if (backtotop) {
		const toggleBacktotop = () => {
			if (window.scrollY > 100) {
				backtotop.classList.add('active');
			} else {
				backtotop.classList.remove('active');
			}
		};
		window.addEventListener('load', toggleBacktotop);
		onscroll(document, toggleBacktotop);
	}
	on('click', '.mobile-nav-toggle', function (e) {
		select('#navbar').classList.toggle('navbar-mobile');
		this.classList.toggle('bi-list');
		this.classList.toggle('bi-x');
	});
	on(
		'click',
		'.navbar .dropdown > a',
		function (e) {
			if (select('#navbar').classList.contains('navbar-mobile')) {
				e.preventDefault();
				this.nextElementSibling.classList.toggle('dropdown-active');
			}
		},
		true
	);

	on(
		'click',
		'.scrollto',
		function (e) {
			if (select(this.hash)) {
				e.preventDefault();

				let navbar = select('#navbar');
				if (navbar.classList.contains('navbar-mobile')) {
					navbar.classList.remove('navbar-mobile');
					let navbarToggle = select('.mobile-nav-toggle');
					navbarToggle.classList.toggle('bi-list');
					navbarToggle.classList.toggle('bi-x');
				}
				scrollto(this.hash);
			}
		},
		true
	);

	window.addEventListener('load', () => {
		if (window.location.hash) {
			if (select(window.location.hash)) {
				scrollto(window.location.hash);
			}
		}
	});

	let preloader = select('#preloader');
	if (preloader) {
		window.addEventListener('load', () => {
			preloader.remove();
		});
	}

	window.addEventListener('load', () => {
		let programmesContainer = select('.programmes-container');
		if (programmesContainer) {
			let programmesIsotope = new Isotope(programmesContainer, {
				itemSelector: '.programmes-item'
			});

			let programmesFilters = select('#programmes-flters li', true);

			on(
				'click',
				'#programmes-flters li',
				function (e) {
					e.preventDefault();
					programmesFilters.forEach(function (el) {
						el.classList.remove('filter-active');
					});
					this.classList.add('filter-active');

					programmesIsotope.arrange({
						filter: this.getAttribute('data-filter')
					});
					programmesIsotope.on('arrangeComplete', function () {
						AOS.refresh();
					});
				},
				true
			);
		}
	});

	const programmesLightbox = GLightbox({
		selector: '.programmes-lightbox'
	});

	new Swiper('.programmes-details-slider', {
		speed: 400,
		loop: true,
		autoplay: {
			delay: 5000,
			disableOnInteraction: false
		},
		pagination: {
			el: '.swiper-pagination',
			type: 'bullets',
			clickable: true
		}
	});

	window.addEventListener('load', () => {
		AOS.init({
			duration: 1000,
			easing: 'ease-in-out',
			once: true,
			mirror: false
		});

		const targets = document.querySelectorAll('img');

		const lazyLoad = (target) => {
			const io = new IntersectionObserver((entries, observer) => {
				console.log(entries);
				entries.forEach((entry) => {
					if (entry.target.getAttribute('data-lazy') == 'assets/img/portfolio/portfolio-11.jpg') {
						setTimeout(() => {
							document.querySelector('#programmes-flters > li.filter-active').click();
							console.log('clicked');
						}, 2000);
					}

					if (entry.isIntersecting) {
						const img = entry.target;
						const src = img.getAttribute('data-lazy');
						if (src) img.setAttribute('src', src);

						observer.disconnect();
					}

					console.log(entry.target.getAttribute('data-lazy'));
				});
			});

			io.observe(target);
		};

		targets.forEach(lazyLoad);

		var element = document.getElementById('stats');

		window.addEventListener('scroll', function () {
			// Get the position of the element
			var position = element.getBoundingClientRect();

			// Check if the element is visible on the screen
			if (position.top >= 0 && position.bottom <= window.innerHeight) {
				setTimeout(() => {
					const counters = document.querySelectorAll('.stat-value');
					const speed = 500;

					counters.forEach((counter) => {
						const animate = () => {
							const value = +counter.getAttribute('akhi');
							const data = +counter.innerText;

							const time = value / speed;
							if (data < value) {
								counter.innerText = Math.ceil(data + time);
								setTimeout(animate, 1);
							} else {
								counter.innerText = value;
							}
						};

						animate();
					});
				}, 1000);
			}
		});
	});
})();
