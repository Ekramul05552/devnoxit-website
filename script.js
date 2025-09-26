document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

/* particles.js config */
particlesJS("particles-js", {
  "particles": {
    "number": {
      "value": 80,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#ffffff"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      }
    },
    "opacity": {
      "value": 0.5,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 3,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 40,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#ffffff",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 6,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "repulse"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 400,
        "size": 40,
        "duration": 2,
        "opacity": 8,
        "speed": 3
      },
      "repulse": {
        "distance": 200,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
});

/* Intersection Observer for fade-in animations */
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

/* Mobile Navigation Toggle */
const hamburgerMenu = document.querySelector('.hamburger-menu');
const mobileNav = document.querySelector('.mobile-nav');

hamburgerMenu.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
});

/* Contact Form Multi-Step Logic */
document.addEventListener('DOMContentLoaded', () => {
    const formSteps = document.querySelectorAll('.form-step');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const progressBar = document.querySelector('.progress-bar');
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        const requiredFields = contactForm.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            field.addEventListener('input', () => {
                if (field.value) {
                    hideError(field);
                }
            });
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let firstErrorField = null;

            requiredFields.forEach(field => {
                if (!field.value) {
                    if (!firstErrorField) {
                        firstErrorField = field;
                    }
                    showError(field);
                } else {
                    hideError(field);
                }
            });

            if (firstErrorField) {
                firstErrorField.focus();
                return;
            }

            const scriptURL = 'https://script.google.com/macros/s/AKfycbx96rDrqe5XLHuqC_4RAeILQHEJWDN5HO8ElEKygAFiz9XcBoQ2F7Iyk1_Djj2VB4dO0A/exec';
            const formData = new FormData(contactForm);
            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            fetch(scriptURL, { method: 'POST', body: formData})
                .then(response => {
                    formSteps[currentStep].classList.remove('active');
                    document.getElementById('thank-you-message').classList.add('active');
                    progressBar.style.width = '100%';
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

        let currentStep = 0;

        nextButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (currentStep === 1) {
                    const message = contactForm.querySelector('textarea[name="Description"]');
                    if (!message.value) {
                        showError(message);
                        return; // Stop execution if validation fails
                    } else {
                        hideError(message); // Hide error if validation passes
                    }
                }

                // Allow advancing to the thank you message step
                if (currentStep < formSteps.length - 1) {
                    formSteps[currentStep].classList.remove('active');
                    currentStep++;
                    formSteps[currentStep].classList.add('active');
                    updateProgressBar();
                }
            });
        });

        prevButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (currentStep > 0) {
                    formSteps[currentStep].classList.remove('active');
                    currentStep--;
                    formSteps[currentStep].classList.add('active');
                    updateProgressBar();
                }
            });
        });

        function showError(field) {
            const errorWrapper = field.closest('.input-wrapper');
            if (errorWrapper) {
                const errorMessage = errorWrapper.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.style.display = 'block';
                }
                field.classList.add('invalid');
            }
        }

        function hideError(field) {
            const errorWrapper = field.closest('.input-wrapper');
            if (errorWrapper) {
                const errorMessage = errorWrapper.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.style.display = 'none';
                }
                field.classList.remove('invalid');
            }
        }

        function updateProgressBar() {
            if (progressBar) {
                const progress = ((currentStep) / (formSteps.length - 1)) * 100;
                progressBar.style.width = `${progress}%`;

                if(currentStep === 0) {
                    progressBar.style.width = `33.33%`;
                } else if (currentStep === 1) {
                    progressBar.style.width = `66.66%`;
                } else if (currentStep === 2) {
                    progressBar.style.width = `100%`;
                }
            }
        }

        // Initialize first step
        if (formSteps.length > 0) {
            formSteps.classList.add('active');
        }
        updateProgressBar();
    }
});

/* Pre-select service in contact form */
document.addEventListener('DOMContentLoaded', () => {
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
});