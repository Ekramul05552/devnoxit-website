document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // particles.js configuration
    if (document.getElementById('particles-js')) {
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#ffffff" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5, "random": false },
                "size": { "value": 3, "random": true },
                "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 },
                "move": { "enable": true, "speed": 6, "direction": "none", "out_mode": "out" }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": { "onhover": { "enable": true, "mode": "repulse" }, "onclick": { "enable": true, "mode": "push" }, "resize": true },
                "modes": { "repulse": { "distance": 200, "duration": 0.4 }, "push": { "particles_nb": 4 } }
            },
            "retina_detect": true
        });
    }

    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    });
    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));

    // Mobile Navigation Toggle
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    if (hamburgerMenu && mobileNav) {
        hamburgerMenu.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
        });
    }

    // Pre-select service in contact form
    const getQuoteButtons = document.querySelectorAll('.get-quote-btn');
    getQuoteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const serviceId = e.target.getAttribute('data-service');
            if (serviceId) {
                const checkbox = document.getElementById(serviceId);
                if (checkbox) {
                    checkbox.checked = true;
                }
            }
        });
    });

    // Contact Form Multi-Step Logic
    const formSteps = document.querySelectorAll('.form-step');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const progressBar = document.querySelector('.progress-bar');
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        const requiredFields = contactForm.querySelectorAll('[required]');
        let currentStep = 0;

        const updateProgressBar = () => {
            if (progressBar) {
                const progressPercentage = (currentStep / (formSteps.length - 2)) * 100;
                progressBar.style.width = `${progressPercentage}%`;
            }
        };
        
        const showStep = (stepIndex) => {
            formSteps.forEach((step, index) => {
                step.classList.toggle('active', index === stepIndex);
            });
            currentStep = stepIndex;
            updateProgressBar();
        };

        nextButtons.forEach(button => {
            button.addEventListener('click', () => {
                const currentFields = formSteps[currentStep].querySelectorAll('[required]');
                let isValid = true;
                currentFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        // You can add error message display logic here
                    }
                });

                if (isValid && currentStep < formSteps.length - 1) {
                    showStep(currentStep + 1);
                }
            });
        });

        prevButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (currentStep > 0) {
                    showStep(currentStep - 1);
                }
            });
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const scriptURL = 'https://script.google.com/macros/s/AKfycbx96rDrqe5XLHuqC_4RAeILQHEJWDN5HO8ElEKygAFiz9XcBoQ2F7Iyk1_Djj2VB4dO0A/exec';
            const formData = new FormData(contactForm);
            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            fetch(scriptURL, { method: 'POST', body: formData})
                .then(response => {
                    showStep(formSteps.length - 1); // Show thank you message
                    submitButton.disabled = false;
                    submitButton.textContent = 'Send Message';
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    alert('Error! There was a problem sending your message.');
                    submitButton.disabled = false;
                    submitButton.textContent = 'Send Message';
                });
        });

        showStep(0); // Initialize the first step
    }

    // Testimonial Slider
    const slider = document.querySelector('.testimonial-slider');
    if (slider) {
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
        });
        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
        });
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; //scroll-fast
            slider.scrollLeft = scrollLeft - walk;
        });
    }

});