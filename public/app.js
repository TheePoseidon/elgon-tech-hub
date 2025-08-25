document.addEventListener('DOMContentLoaded', () => {
    // Create cursor glow effect
    const cursorGlow = document.createElement('div');
    cursorGlow.classList.add('cursor-glow');
    document.body.appendChild(cursorGlow);
    
    // Update cursor glow position
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });
    
    // Add active class when hovering over interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .brand__logo');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorGlow.classList.add('cursor-glow--active');
        });
        el.addEventListener('mouseleave', () => {
            cursorGlow.classList.remove('cursor-glow--active');
        });
    });
	// Update copyright year
	const yearSpan = document.getElementById('year');
	if (yearSpan) yearSpan.textContent = new Date().getFullYear();
	
	// Mobile menu toggle
	const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
	const navLinks = document.querySelector('.nav__links');
	const hero = document.querySelector('.hero');
	const header = document.querySelector('.site-header');
	
	if (mobileMenuBtn && navLinks) {
		mobileMenuBtn.addEventListener('click', () => {
			navLinks.classList.toggle('active');
			document.body.classList.toggle('menu-open');
			mobileMenuBtn.classList.toggle('open');
		});
		
		// Close mobile menu when clicking on a link
		const links = navLinks.querySelectorAll('a');
		links.forEach(link => {
			link.addEventListener('click', () => {
				navLinks.classList.remove('active');
				document.body.classList.remove('menu-open');
				mobileMenuBtn.classList.remove('open');
			});
		});
	}
	
	// Header compact effect on scroll
	window.addEventListener('scroll', () => {
		const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		
		if (header) {
			// Add compact class to header when scrolling down
			if (scrollTop > 50) {
				header.classList.add('compact');
			} else {
				header.classList.remove('compact');
			}
		}
	});
	
	// Add active class to navigation links based on scroll position
	const sections = document.querySelectorAll('section[id]');
	const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');
	
	function highlightNavLink() {
		let scrollPosition = window.scrollY;
		
		sections.forEach(section => {
			const sectionTop = section.offsetTop - 100;
			const sectionHeight = section.offsetHeight;
			const sectionId = section.getAttribute('id');
			
			if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
				navLinks.forEach(link => {
					link.classList.remove('active');
					if (link.getAttribute('href') === `#${sectionId}`) {
						link.classList.add('active');
					}
				});
			}
		});
	}
	
	// Add scroll event listener
	window.addEventListener('scroll', highlightNavLink);
	highlightNavLink(); // Call once on load

	// Handle contact form submission
	const form = document.getElementById('contactForm');
	const statusEl = document.getElementById('formStatus');

	if (form) {
		form.addEventListener('submit', async (e) => {
			e.preventDefault();
			statusEl.textContent = 'Sending...';
			const formData = new FormData(form);
			const payload = Object.fromEntries(formData.entries());
			try {
				const res = await fetch('/api/contact', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload)
				});
				if (!res.ok) {
					const err = await res.json().catch(() => ({ error: 'Failed to send' }));
					throw new Error(err.error || 'Failed to send');
				}
				statusEl.textContent = 'Message sent! We will reach out shortly.';
				statusEl.style.color = '#00ffa3';
				form.reset();
			} catch (err) {
				statusEl.textContent = err.message || 'Something went wrong.';
				statusEl.style.color = '#ff6b6b';
			}
		});
	}
});


