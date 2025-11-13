/* ========================================
   YARNA AB - Main JavaScript
   Autonomous Software Systems
   Intelligence in every Automation™
   ======================================== */

(function() {
    'use strict';

    // ========================================
    // LOGGING UTILITY
    // ========================================
    const Logger = {
        isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
        logLevel: 'info', // 'error', 'warn', 'info', 'debug'

        levels: {
            error: 0,
            warn: 1,
            info: 2,
            debug: 3
        },

        _shouldLog: function(level) {
            return this.levels[level] <= this.levels[this.logLevel];
        },

        _formatMessage: function(level, component, message, data) {
            const timestamp = new Date().toISOString();
            const prefix = `[${timestamp}] [${level.toUpperCase()}] [${component}]`;
            return { prefix, message, data };
        },

        _log: function(level, component, message, data = null) {
            if (!this._shouldLog(level)) return;

            const formatted = this._formatMessage(level, component, message, data);
            const logData = data ? [formatted.prefix, formatted.message, data] : [formatted.prefix, formatted.message];

            switch(level) {
                case 'error':
                    console.error(...logData);
                    break;
                case 'warn':
                    console.warn(...logData);
                    break;
                case 'info':
                    console.info(...logData);
                    break;
                case 'debug':
                    console.log(...logData);
                    break;
            }

            // Store critical errors for potential reporting
            if (level === 'error') {
                this._storeError(component, message, data);
            }
        },

        _storeError: function(component, message, data) {
            try {
                const errors = JSON.parse(localStorage.getItem('app_errors') || '[]');
                errors.push({
                    timestamp: new Date().toISOString(),
                    component,
                    message,
                    data: data ? JSON.stringify(data) : null
                });
                // Keep only last 50 errors
                if (errors.length > 50) errors.shift();
                localStorage.setItem('app_errors', JSON.stringify(errors));
            } catch (e) {
                console.error('Failed to store error:', e);
            }
        },

        error: function(component, message, data) {
            this._log('error', component, message, data);
        },

        warn: function(component, message, data) {
            this._log('warn', component, message, data);
        },

        info: function(component, message, data) {
            this._log('info', component, message, data);
        },

        debug: function(component, message, data) {
            this._log('debug', component, message, data);
        },

        performance: function(component, operation, duration) {
            this.debug(component, `Performance: ${operation} took ${duration}ms`);
        },

        interaction: function(component, action, details) {
            this.info(component, `User interaction: ${action}`, details);
        },

        getStoredErrors: function() {
            try {
                return JSON.parse(localStorage.getItem('app_errors') || '[]');
            } catch (e) {
                return [];
            }
        },

        clearStoredErrors: function() {
            localStorage.removeItem('app_errors');
            this.info('Logger', 'Stored errors cleared');
        }
    };

    // Global error handler
    window.addEventListener('error', function(event) {
        Logger.error('GlobalErrorHandler', 'Uncaught error', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error ? event.error.stack : null
        });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', function(event) {
        Logger.error('GlobalErrorHandler', 'Unhandled promise rejection', {
            reason: event.reason,
            promise: event.promise
        });
    });

    // Expose logger globally for debugging
    window.Logger = Logger;
    Logger.info('System', 'Logging system initialized');

    // ========================================
    // Initialize on DOM Ready
    // ========================================
    document.addEventListener('DOMContentLoaded', function() {
        const startTime = performance.now();
        Logger.info('System', 'DOM Content Loaded - Starting initialization');

        try {
            initHeader();
            initMobileMenu();
            initSlider();
            initScrollAnimations();
            initROICalculator();
            initStats();
            initComparisonBars();
            initParticles();
            initContactForm();

            const duration = performance.now() - startTime;
            Logger.performance('System', 'Full initialization', Math.round(duration));
            Logger.info('System', 'All components initialized successfully');
        } catch (error) {
            Logger.error('System', 'Failed during initialization', {
                error: error.message,
                stack: error.stack
            });
        }
    });

    // ========================================
    // Header Scroll Effect
    // ========================================
    function initHeader() {
        const component = 'Header';
        Logger.debug(component, 'Initializing header scroll effect');

        try {
            const header = document.querySelector('header');
            if (!header) {
                Logger.warn(component, 'Header element not found in DOM');
                return;
            }

            Logger.debug(component, 'Header element found, attaching scroll listener');

            window.addEventListener('scroll', function() {
                try {
                    if (window.scrollY > 50) {
                        header.classList.add('scrolled');
                        Logger.debug(component, 'Scroll threshold passed - header scrolled state');
                    } else {
                        header.classList.remove('scrolled');
                    }
                } catch (error) {
                    Logger.error(component, 'Error in scroll handler', {
                        error: error.message,
                        scrollY: window.scrollY
                    });
                }
            });

            Logger.info(component, 'Header scroll effect initialized successfully');
        } catch (error) {
            Logger.error(component, 'Failed to initialize header', {
                error: error.message,
                stack: error.stack
            });
        }
    }

    // ========================================
    // Mobile Menu
    // ========================================
    function initMobileMenu() {
        const component = 'MobileMenu';
        Logger.debug(component, 'Initializing mobile menu');

        try {
            const menuToggle = document.querySelector('.menu-toggle');
            const nav = document.querySelector('nav');

            if (!menuToggle || !nav) {
                Logger.warn(component, 'Mobile menu elements not found', {
                    hasMenuToggle: !!menuToggle,
                    hasNav: !!nav
                });
                return;
            }

            Logger.debug(component, 'Mobile menu elements found');

            menuToggle.addEventListener('click', function() {
                try {
                    nav.classList.toggle('active');
                    const isActive = nav.classList.contains('active');

                    Logger.interaction(component, 'Menu toggle clicked', { isActive });

                    // Animate hamburger to X
                    const spans = menuToggle.querySelectorAll('span');
                    if (isActive) {
                        spans[0].style.transform = 'rotate(45deg) translateY(7px)';
                        spans[1].style.opacity = '0';
                        spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
                    } else {
                        spans[0].style.transform = '';
                        spans[1].style.opacity = '';
                        spans[2].style.transform = '';
                    }
                } catch (error) {
                    Logger.error(component, 'Error toggling menu', {
                        error: error.message
                    });
                }
            });

            // Close menu when clicking on a link
            const navLinks = nav.querySelectorAll('.nav-link');
            Logger.debug(component, `Found ${navLinks.length} navigation links`);

            navLinks.forEach((link, index) => {
                link.addEventListener('click', function() {
                    try {
                        if (window.innerWidth <= 768) {
                            Logger.interaction(component, 'Nav link clicked', {
                                linkIndex: index,
                                href: link.getAttribute('href'),
                                screenWidth: window.innerWidth
                            });

                            nav.classList.remove('active');
                            const spans = menuToggle.querySelectorAll('span');
                            spans[0].style.transform = '';
                            spans[1].style.opacity = '';
                            spans[2].style.transform = '';
                        }
                    } catch (error) {
                        Logger.error(component, 'Error handling nav link click', {
                            error: error.message,
                            linkIndex: index
                        });
                    }
                });
            });

            Logger.info(component, 'Mobile menu initialized successfully');
        } catch (error) {
            Logger.error(component, 'Failed to initialize mobile menu', {
                error: error.message,
                stack: error.stack
            });
        }
    }

    // ========================================
    // Hero Stats Slider
    // ========================================
    function initSlider() {
        const component = 'HeroSlider';
        Logger.debug(component, 'Initializing hero stats slider');

        try {
            const slides = document.querySelectorAll('.stat-slide');
            const dotsContainer = document.querySelector('.slider-dots');

            if (!slides.length || !dotsContainer) {
                Logger.warn(component, 'Slider elements not found', {
                    slidesCount: slides.length,
                    hasDotsContainer: !!dotsContainer
                });
                return;
            }

            Logger.debug(component, `Found ${slides.length} slides`);

            let currentSlide = 0;
            const totalSlides = slides.length;

            // Create dots
            slides.forEach((_, index) => {
                try {
                    const dot = document.createElement('button');
                    dot.classList.add('slider-dot');
                    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
                    if (index === 0) dot.classList.add('active');
                    dot.addEventListener('click', () => {
                        Logger.interaction(component, 'Dot clicked', { slideIndex: index });
                        goToSlide(index);
                    });
                    dotsContainer.appendChild(dot);
                } catch (error) {
                    Logger.error(component, 'Error creating dot', {
                        error: error.message,
                        index
                    });
                }
            });

            const dots = document.querySelectorAll('.slider-dot');
            Logger.debug(component, `Created ${dots.length} navigation dots`);

            function goToSlide(n) {
                try {
                    const previousSlide = currentSlide;

                    // Remove active class from current slide and dot
                    slides[currentSlide].classList.remove('active');
                    dots[currentSlide].classList.remove('active');

                    // Update current slide
                    currentSlide = (n + totalSlides) % totalSlides;

                    // Add active class to new slide and dot
                    slides[currentSlide].classList.add('active');
                    dots[currentSlide].classList.add('active');

                    Logger.debug(component, 'Slide changed', {
                        from: previousSlide,
                        to: currentSlide
                    });
                } catch (error) {
                    Logger.error(component, 'Error in goToSlide', {
                        error: error.message,
                        targetSlide: n
                    });
                }
            }

            function nextSlide() {
                Logger.debug(component, 'Next slide triggered');
                goToSlide(currentSlide + 1);
            }

            function prevSlide() {
                Logger.debug(component, 'Previous slide triggered');
                goToSlide(currentSlide - 1);
            }

            // Auto-advance slider
            let autoSlideInterval = setInterval(nextSlide, 5000);
            Logger.debug(component, 'Auto-advance enabled (5s interval)');

            // Pause auto-advance on hover
            const sliderContainer = document.querySelector('.hero-stats-slider');
            if (sliderContainer) {
                sliderContainer.addEventListener('mouseenter', () => {
                    clearInterval(autoSlideInterval);
                    Logger.debug(component, 'Auto-advance paused (hover)');
                });

                sliderContainer.addEventListener('mouseleave', () => {
                    autoSlideInterval = setInterval(nextSlide, 5000);
                    Logger.debug(component, 'Auto-advance resumed');
                });
            }

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                try {
                    if (e.key === 'ArrowLeft') {
                        Logger.interaction(component, 'Keyboard navigation', { key: 'ArrowLeft' });
                        prevSlide();
                    }
                    if (e.key === 'ArrowRight') {
                        Logger.interaction(component, 'Keyboard navigation', { key: 'ArrowRight' });
                        nextSlide();
                    }
                } catch (error) {
                    Logger.error(component, 'Error in keyboard handler', {
                        error: error.message,
                        key: e.key
                    });
                }
            });

            // Touch/swipe support
            let touchStartX = 0;
            let touchEndX = 0;

            if (sliderContainer) {
                sliderContainer.addEventListener('touchstart', (e) => {
                    try {
                        touchStartX = e.changedTouches[0].screenX;
                        Logger.debug(component, 'Touch start', { x: touchStartX });
                    } catch (error) {
                        Logger.error(component, 'Error in touchstart', { error: error.message });
                    }
                });

                sliderContainer.addEventListener('touchend', (e) => {
                    try {
                        touchEndX = e.changedTouches[0].screenX;
                        Logger.debug(component, 'Touch end', { x: touchEndX });
                        handleSwipe();
                    } catch (error) {
                        Logger.error(component, 'Error in touchend', { error: error.message });
                    }
                });
            }

            function handleSwipe() {
                try {
                    const swipeThreshold = 50;
                    const diff = touchStartX - touchEndX;

                    if (Math.abs(diff) > swipeThreshold) {
                        if (diff > 0) {
                            Logger.interaction(component, 'Swipe', { direction: 'left' });
                            nextSlide();
                        } else {
                            Logger.interaction(component, 'Swipe', { direction: 'right' });
                            prevSlide();
                        }
                    }
                } catch (error) {
                    Logger.error(component, 'Error handling swipe', {
                        error: error.message,
                        touchStartX,
                        touchEndX
                    });
                }
            }

            Logger.info(component, 'Hero stats slider initialized successfully', {
                totalSlides,
                features: ['auto-advance', 'keyboard', 'touch', 'dots']
            });
        } catch (error) {
            Logger.error(component, 'Failed to initialize slider', {
                error: error.message,
                stack: error.stack
            });
        }
    }

    // ========================================
    // Scroll Animations
    // ========================================
    function initScrollAnimations() {
        const component = 'ScrollAnimations';
        Logger.debug(component, 'Initializing scroll animations');

        try {
            const animatedElements = document.querySelectorAll('.scroll-animate');

            if (!animatedElements.length) {
                Logger.warn(component, 'No animated elements found');
                return;
            }

            Logger.debug(component, `Found ${animatedElements.length} animated elements`);

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        try {
                            if (entry.isIntersecting) {
                                entry.target.classList.add('active');
                                Logger.debug(component, 'Element animated', {
                                    element: entry.target.className
                                });
                            }
                        } catch (error) {
                            Logger.error(component, 'Error animating element', {
                                error: error.message
                            });
                        }
                    });
                },
                {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                }
            );

            animatedElements.forEach(el => observer.observe(el));
            Logger.info(component, 'Scroll animations initialized successfully');
        } catch (error) {
            Logger.error(component, 'Failed to initialize scroll animations', {
                error: error.message,
                stack: error.stack
            });
        }
    }

    // ========================================
    // ROI Calculator
    // ========================================
    function initROICalculator() {
        const component = 'ROICalculator';
        Logger.debug(component, 'Initializing ROI calculator');

        try {
            const employeesSlider = document.getElementById('employees');
            const hoursSlider = document.getElementById('hours');
            const costSlider = document.getElementById('cost');

            if (!employeesSlider) {
                Logger.info(component, 'ROI calculator not on this page');
                return;
            }

            const employeesValue = document.getElementById('employees-value');
            const hoursValue = document.getElementById('hours-value');
            const costValue = document.getElementById('cost-value');
            const savingsDisplay = document.getElementById('savings-display');

            function calculateSavings() {
                try {
                    const employees = parseInt(employeesSlider.value);
                    const hours = parseInt(hoursSlider.value);
                    const cost = parseInt(costSlider.value);

                    employeesValue.textContent = employees;
                    hoursValue.textContent = hours;
                    costValue.textContent = `$${cost}`;

                    const weeklyCost = employees * hours * cost;
                    const estimatedSavings = weeklyCost * 0.80;
                    const annualSavings = estimatedSavings * 52;

                    Logger.debug(component, 'Savings calculated', {
                        employees,
                        hours,
                        cost,
                        annualSavings: Math.round(annualSavings)
                    });

                    animateValue(savingsDisplay, 0, Math.round(annualSavings), 1000);
                } catch (error) {
                    Logger.error(component, 'Error calculating savings', {
                        error: error.message
                    });
                }
            }

            // Add event listeners
            [employeesSlider, hoursSlider, costSlider].forEach((slider, index) => {
                slider.addEventListener('input', () => {
                    Logger.interaction(component, 'Slider adjusted', {
                        slider: ['employees', 'hours', 'cost'][index],
                        value: slider.value
                    });
                    calculateSavings();
                });
            });

            // Initial calculation
            calculateSavings();
            Logger.info(component, 'ROI calculator initialized successfully');
        } catch (error) {
            Logger.error(component, 'Failed to initialize ROI calculator', {
                error: error.message,
                stack: error.stack
            });
        }
    }

    // ========================================
    // Animated Statistics
    // ========================================
    function initStats() {
        const component = 'Stats';
        Logger.debug(component, 'Initializing animated statistics');

        try {
            const statElements = document.querySelectorAll('.stat-number[data-target]');

            if (!statElements.length) {
                Logger.info(component, 'No stat elements found on this page');
                return;
            }

            Logger.debug(component, `Found ${statElements.length} stat elements`);

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        try {
                            if (entry.isIntersecting) {
                                const target = parseFloat(entry.target.getAttribute('data-target'));
                                const suffix = entry.target.getAttribute('data-suffix') || '';

                                Logger.debug(component, 'Animating stat', {
                                    target,
                                    suffix
                                });

                                animateValue(entry.target, 0, target, 2000, suffix);
                                observer.unobserve(entry.target);
                            }
                        } catch (error) {
                            Logger.error(component, 'Error animating stat', {
                                error: error.message
                            });
                        }
                    });
                },
                { threshold: 0.5 }
            );

            statElements.forEach(el => observer.observe(el));
            Logger.info(component, 'Animated statistics initialized successfully');
        } catch (error) {
            Logger.error(component, 'Failed to initialize stats', {
                error: error.message,
                stack: error.stack
            });
        }
    }

    // ========================================
    // Comparison Bar Animations
    // ========================================
    function initComparisonBars() {
        const component = 'ComparisonBars';
        Logger.debug(component, 'Initializing comparison bar animations');

        try {
            const bars = document.querySelectorAll('.bar-fill');

            if (!bars.length) {
                Logger.info(component, 'No comparison bars found on this page');
                return;
            }

            Logger.debug(component, `Found ${bars.length} comparison bars`);

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        try {
                            if (entry.isIntersecting) {
                                const width = entry.target.getAttribute('data-width');
                                entry.target.style.width = width;
                                Logger.debug(component, 'Bar animated', { width });
                                observer.unobserve(entry.target);
                            }
                        } catch (error) {
                            Logger.error(component, 'Error animating bar', {
                                error: error.message
                            });
                        }
                    });
                },
                { threshold: 0.5 }
            );

            bars.forEach(bar => {
                bar.style.width = '0%';
                observer.observe(bar);
            });

            Logger.info(component, 'Comparison bars initialized successfully');
        } catch (error) {
            Logger.error(component, 'Failed to initialize comparison bars', {
                error: error.message,
                stack: error.stack
            });
        }
    }

    // ========================================
    // Animated Particles Background
    // ========================================
    function initParticles() {
        const component = 'Particles';
        Logger.debug(component, 'Initializing particle background');

        try {
            const particlesContainer = document.querySelector('.particles');

            if (!particlesContainer) {
                Logger.info(component, 'Particles container not found on this page');
                return;
            }

            const particleCount = 30;
            const colors = ['rgba(59, 130, 246, 0.3)', 'rgba(96, 165, 250, 0.3)', 'rgba(37, 99, 235, 0.3)'];

            Logger.debug(component, `Creating ${particleCount} particles`);

            for (let i = 0; i < particleCount; i++) {
                try {
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
                } catch (error) {
                    Logger.error(component, 'Error creating particle', {
                        error: error.message,
                        particleIndex: i
                    });
                }
            }

            Logger.info(component, 'Particles initialized successfully', { count: particleCount });
        } catch (error) {
            Logger.error(component, 'Failed to initialize particles', {
                error: error.message,
                stack: error.stack
            });
        }
    }

    // ========================================
    // Contact Form Handling
    // ========================================
    function initContactForm() {
        const component = 'ContactForm';
        Logger.debug(component, 'Initializing contact form');

        try {
            const form = document.querySelector('form');

            if (!form) {
                Logger.info(component, 'Contact form not found on this page');
                return;
            }

            Logger.debug(component, 'Contact form found');

            form.addEventListener('submit', function(e) {
                try {
                    e.preventDefault();

                    // Get form data
                    const formData = new FormData(form);
                    const data = Object.fromEntries(formData.entries());

                    Logger.interaction(component, 'Form submitted', {
                        fields: Object.keys(data)
                    });

                    // Show success message (in a real app, this would submit to a server)
                    alert('Thank you for your message! We will get back to you shortly.');
                    form.reset();

                    Logger.info(component, 'Form submission successful');
                } catch (error) {
                    Logger.error(component, 'Error submitting form', {
                        error: error.message
                    });
                }
            });

            // Add real-time validation
            const inputs = form.querySelectorAll('.form-input, .form-textarea');
            Logger.debug(component, `Found ${inputs.length} form inputs`);

            inputs.forEach((input, index) => {
                input.addEventListener('blur', function() {
                    try {
                        Logger.interaction(component, 'Input blurred', {
                            inputName: this.name || `input-${index}`,
                            hasValue: !!this.value
                        });
                        validateInput(this);
                    } catch (error) {
                        Logger.error(component, 'Error validating input', {
                            error: error.message,
                            inputIndex: index
                        });
                    }
                });
            });

            Logger.info(component, 'Contact form initialized successfully');
        } catch (error) {
            Logger.error(component, 'Failed to initialize contact form', {
                error: error.message,
                stack: error.stack
            });
        }
    }

    // ========================================
    // Helper Functions
    // ========================================

    function animateValue(element, start, end, duration, suffix = '') {
        try {
            if (!element) {
                Logger.warn('animateValue', 'Element is null or undefined');
                return;
            }

            const range = end - start;
            const increment = range / (duration / 16); // 60 FPS
            let current = start;

            const timer = setInterval(() => {
                try {
                    current += increment;
                    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                        current = end;
                        clearInterval(timer);
                    }

                    // Format number with commas
                    const formatted = Math.round(current).toLocaleString();
                    element.textContent = `${suffix === '$' ? '$' : ''}${formatted}${suffix !== '$' ? suffix : ''}`;
                } catch (error) {
                    clearInterval(timer);
                    Logger.error('animateValue', 'Error during animation frame', {
                        error: error.message,
                        current,
                        end
                    });
                }
            }, 16);
        } catch (error) {
            Logger.error('animateValue', 'Failed to start animation', {
                error: error.message,
                start,
                end,
                duration
            });
        }
    }

    function validateInput(input) {
        try {
            if (!input) {
                Logger.warn('validateInput', 'Input element is null or undefined');
                return false;
            }

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

            Logger.debug('validateInput', 'Input validated', {
                inputName: input.name,
                type,
                isValid,
                hasValue: !!value
            });

            return isValid;
        } catch (error) {
            Logger.error('validateInput', 'Error validating input', {
                error: error.message
            });
            return false;
        }
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

    // ========================================
    // Performance Monitoring
    // ========================================
    window.addEventListener('load', function() {
        try {
            if (window.performance && window.performance.timing) {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                const connectTime = perfData.responseEnd - perfData.requestStart;
                const renderTime = perfData.domComplete - perfData.domLoading;

                Logger.performance('PageLoad', 'Complete page load', pageLoadTime);
                Logger.debug('PageLoad', 'Performance metrics', {
                    pageLoadTime: `${pageLoadTime}ms`,
                    connectTime: `${connectTime}ms`,
                    renderTime: `${renderTime}ms`,
                    domContentLoaded: `${perfData.domContentLoadedEventEnd - perfData.navigationStart}ms`
                });
            }

            // Log browser info
            Logger.info('System', 'Browser information', {
                userAgent: navigator.userAgent,
                language: navigator.language,
                platform: navigator.platform,
                screenResolution: `${window.screen.width}x${window.screen.height}`,
                viewportSize: `${window.innerWidth}x${window.innerHeight}`,
                colorDepth: window.screen.colorDepth
            });

            // Log page visibility changes
            document.addEventListener('visibilitychange', function() {
                Logger.info('System', `Page visibility changed: ${document.hidden ? 'hidden' : 'visible'}`);
            });

        } catch (error) {
            Logger.error('PageLoad', 'Error in performance monitoring', {
                error: error.message
            });
        }
    });

    // Console message for developers
    console.log(
        '%cYARNA AB - Website Logger Active',
        'color: #3b82f6; font-size: 16px; font-weight: bold;'
    );
    console.log(
        '%cLogging system initialized. Use Logger.getStoredErrors() to view stored errors.',
        'color: #64748b; font-size: 12px;'
    );
    console.log(
        '%cLog levels: error, warn, info, debug',
        'color: #64748b; font-size: 12px;'
    );

})();
