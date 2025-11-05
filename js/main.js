/* ========================================
   YARNA AB - Main JavaScript
   Autonomous Software Systems
   Intelligence in every Automation™
   ======================================== */

(function() {
    'use strict';

    // ========================================
    // Initialize on DOM Ready
    // ========================================
    document.addEventListener('DOMContentLoaded', function() {
        initHeader();
        initMobileMenu();
        initSlider();
        initScrollAnimations();
        initROICalculator();
        initStats();
        initComparisonBars();
        initParticles();
        initContactForm();
    });

    // ========================================
    // Header Scroll Effect
    // ========================================
    function initHeader() {
        const header = document.querySelector('header');
        if (!header) return;

        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // ========================================
    // Mobile Menu
    // ========================================
    function initMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const nav = document.querySelector('nav');

        if (!menuToggle || !nav) return;

        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');

            // Animate hamburger to X
            const spans = menuToggle.querySelectorAll('span');
            if (nav.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(7px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });

        // Close menu when clicking on a link
        const navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    nav.classList.remove('active');
                    const spans = menuToggle.querySelectorAll('span');
                    spans[0].style.transform = '';
                    spans[1].style.opacity = '';
                    spans[2].style.transform = '';
                }
            });
        });
    }

    // ========================================
    // Hero Stats Slider
    // ========================================
    function initSlider() {
        const slides = document.querySelectorAll('.stat-slide');
        const dotsContainer = document.querySelector('.slider-dots');

        if (!slides.length || !dotsContainer) return;

        let currentSlide = 0;
        const totalSlides = slides.length;

        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.slider-dot');

        function goToSlide(n) {
            // Remove active class from current slide and dot
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');

            // Update current slide
            currentSlide = (n + totalSlides) % totalSlides;

            // Add active class to new slide and dot
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }

        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        function prevSlide() {
            goToSlide(currentSlide - 1);
        }

        // Auto-advance slider
        let autoSlideInterval = setInterval(nextSlide, 5000);

        // Pause auto-advance on hover
        const sliderContainer = document.querySelector('.hero-stats-slider');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => {
                clearInterval(autoSlideInterval);
            });

            sliderContainer.addEventListener('mouseleave', () => {
                autoSlideInterval = setInterval(nextSlide, 5000);
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        if (sliderContainer) {
            sliderContainer.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });

            sliderContainer.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            });
        }

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }
    }

    // ========================================
    // Scroll Animations
    // ========================================
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.scroll-animate');

        if (!animatedElements.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        animatedElements.forEach(el => observer.observe(el));
    }

    // ========================================
    // ROI Calculator
    // ========================================
    function initROICalculator() {
        const employeesSlider = document.getElementById('employees');
        const hoursSlider = document.getElementById('hours');
        const costSlider = document.getElementById('cost');

        if (!employeesSlider) return; // Not on a page with calculator

        const employeesValue = document.getElementById('employees-value');
        const hoursValue = document.getElementById('hours-value');
        const costValue = document.getElementById('cost-value');
        const savingsDisplay = document.getElementById('savings-display');

        function calculateSavings() {
            const employees = parseInt(employeesSlider.value);
            const hours = parseInt(hoursSlider.value);
            const cost = parseInt(costSlider.value);

            employeesValue.textContent = employees;
            hoursValue.textContent = hours;
            costValue.textContent = `$${cost}`;

            const weeklyCost = employees * hours * cost;
            const estimatedSavings = weeklyCost * 0.80; // 80% efficiency gain
            const annualSavings = estimatedSavings * 52;

            animateValue(savingsDisplay, 0, Math.round(annualSavings), 1000);
        }

        // Add event listeners
        [employeesSlider, hoursSlider, costSlider].forEach(slider => {
            slider.addEventListener('input', calculateSavings);
        });

        // Initial calculation
        calculateSavings();
    }

    // ========================================
    // Animated Statistics
    // ========================================
    function initStats() {
        const statElements = document.querySelectorAll('.stat-number[data-target]');

        if (!statElements.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const target = parseFloat(entry.target.getAttribute('data-target'));
                        const suffix = entry.target.getAttribute('data-suffix') || '';
                        animateValue(entry.target, 0, target, 2000, suffix);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        statElements.forEach(el => observer.observe(el));
    }

    // ========================================
    // Comparison Bar Animations
    // ========================================
    function initComparisonBars() {
        const bars = document.querySelectorAll('.bar-fill');

        if (!bars.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const width = entry.target.getAttribute('data-width');
                        entry.target.style.width = width;
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        bars.forEach(bar => {
            bar.style.width = '0%';
            observer.observe(bar);
        });
    }

    // ========================================
    // Animated Particles Background
    // ========================================
    function initParticles() {
        const particlesContainer = document.querySelector('.particles');

        if (!particlesContainer) return;

        const particleCount = 30;
        const colors = ['rgba(59, 130, 246, 0.3)', 'rgba(96, 165, 250, 0.3)', 'rgba(37, 99, 235, 0.3)'];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // Random size
            const size = Math.random() * 6 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            // Random position
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;

            // Random color
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];

            // Random animation duration
            particle.style.animationDuration = `${Math.random() * 20 + 10}s`;
            particle.style.animationDelay = `${Math.random() * 5}s`;

            particlesContainer.appendChild(particle);
        }
    }

    // ========================================
    // Contact Form Handling
    // ========================================
    function initContactForm() {
        const form = document.querySelector('form');

        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Show success message (in a real app, this would submit to a server)
            alert('Thank you for your message! We will get back to you shortly.');
            form.reset();
        });

        // Add real-time validation
        const inputs = form.querySelectorAll('.form-input, .form-textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });
        });
    }

    // ========================================
    // Helper Functions
    // ========================================

    function animateValue(element, start, end, duration, suffix = '') {
        const range = end - start;
        const increment = range / (duration / 16); // 60 FPS
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }

            // Format number with commas
            const formatted = Math.round(current).toLocaleString();
            element.textContent = `${suffix === '$' ? '$' : ''}${formatted}${suffix !== '$' ? suffix : ''}`;
        }, 16);
    }

    function validateInput(input) {
        const value = input.value.trim();
        const type = input.type;

        let isValid = true;

        if (input.required && !value) {
            isValid = false;
        } else if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
        }

        if (isValid) {
            input.style.borderColor = '';
        } else {
            input.style.borderColor = '#ef4444';
        }

        return isValid;
    }

    // ========================================
    // Smooth Scroll for Anchor Links
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // Lazy Load Images (if any)
    // ========================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ========================================
    // Active Navigation Link Highlighting
    // ========================================
    function updateActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    updateActiveNavLink();

    // ========================================
    // Performance: Debounce Function
    // ========================================
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Optimize scroll events
    const optimizedScroll = debounce(function() {
        // Any scroll-heavy operations can go here
    }, 100);

    window.addEventListener('scroll', optimizedScroll);

})();
