/* ========================================
   YARNA AB - Main JavaScript
   Autonomous Software Systems
   Intelligence in every Automation™
   ======================================== */

(function() {
    'use strict';

    // Wait for logger to be available
    const waitForLogger = setInterval(() => {
        if (window.YarnaLogger) {
            clearInterval(waitForLogger);
            initializeApp();
        }
    }, 10);

    function initializeApp() {
        const logger = window.YarnaLogger;
        logger.info('Main application initialization started');
        logger.startTimer('AppInitialization');

        try {
            // ========================================
            // Initialize on DOM Ready
            // ========================================
            document.addEventListener('DOMContentLoaded', function() {
                logger.info('DOM Content Loaded');

                try {
                    initHeader();
                    initMobileMenu();
                    initScrollAnimations();
                    initROICalculator();
                    initStats();
                    initComparisonBars();
                    initParticles();
                    initContactForm();

                    logger.endTimer('AppInitialization');
                    logger.info('All components initialized successfully');
                } catch (error) {
                    logger.error('Error during component initialization', {}, error);
                }
            });
        } catch (error) {
            logger.error('Critical error in app initialization', {}, error);
        }
    }

    // ========================================
    // Header Scroll Effect
    // ========================================
    function initHeader() {
        const logger = window.YarnaLogger;
        logger.debug('Initializing header scroll effect');

        try {
            const header = document.querySelector('header');
            if (!header) {
                logger.warn('Header element not found');
                return;
            }

            window.addEventListener('scroll', function() {
                try {
                    if (window.scrollY > 50) {
                        header.classList.add('scrolled');
                        logger.debug('Header scrolled state activated');
                    } else {
                        header.classList.remove('scrolled');
                        logger.debug('Header scrolled state removed');
                    }
                } catch (error) {
                    logger.error('Error in scroll handler', { scrollY: window.scrollY }, error);
                }
            });

            logger.info('Header scroll effect initialized');
        } catch (error) {
            logger.error('Failed to initialize header', {}, error);
        }
    }

    // ========================================
    // Mobile Menu
    // ========================================
    function initMobileMenu() {
        const logger = window.YarnaLogger;
        logger.debug('Initializing mobile menu');

        try {
            const menuToggle = document.querySelector('.menu-toggle');
            const nav = document.querySelector('nav');

            if (!menuToggle || !nav) {
                logger.warn('Mobile menu elements not found', {
                    menuToggle: !!menuToggle,
                    nav: !!nav
                });
                return;
            }

            menuToggle.addEventListener('click', function() {
                try {
                    nav.classList.toggle('active');
                    const isActive = nav.classList.contains('active');

                    logger.trackInteraction('menu_toggle', 'mobile-menu', { isActive });

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
                    logger.error('Error toggling mobile menu', {}, error);
                }
            });

            // Close menu when clicking on a link
            const navLinks = nav.querySelectorAll('.nav-link');
            logger.debug(`Found ${navLinks.length} nav links`);

            navLinks.forEach((link, index) => {
                link.addEventListener('click', function() {
                    try {
                        logger.trackInteraction('nav_link_click', link.textContent.trim(), {
                            href: link.href,
                            index
                        });

                        if (window.innerWidth <= 768) {
                            nav.classList.remove('active');
                            const spans = menuToggle.querySelectorAll('span');
                            spans[0].style.transform = '';
                            spans[1].style.opacity = '';
                            spans[2].style.transform = '';
                            logger.debug('Mobile menu closed after navigation');
                        }
                    } catch (error) {
                        logger.error('Error in nav link click handler', { link: link.href }, error);
                    }
                });
            });

            logger.info('Mobile menu initialized successfully');
        } catch (error) {
            logger.error('Failed to initialize mobile menu', {}, error);
        }
    }

    // ========================================
    // Scroll Animations
    // ========================================
    function initScrollAnimations() {
        const logger = window.YarnaLogger;
        logger.debug('Initializing scroll animations');

        try {
            const animatedElements = document.querySelectorAll('.scroll-animate');

            if (!animatedElements.length) {
                logger.debug('No animated elements found');
                return;
            }

            logger.info(`Found ${animatedElements.length} elements for scroll animation`);

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        try {
                            if (entry.isIntersecting) {
                                entry.target.classList.add('active');
                                logger.debug('Element animated into view', {
                                    element: entry.target.className
                                });
                            }
                        } catch (error) {
                            logger.error('Error in intersection observer callback', {}, error);
                        }
                    });
                },
                {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                }
            );

            animatedElements.forEach(el => observer.observe(el));
            logger.info('Scroll animations initialized successfully');
        } catch (error) {
            logger.error('Failed to initialize scroll animations', {}, error);
        }
    }

    // ========================================
    // ROI Calculator
    // ========================================
    function initROICalculator() {
        const logger = window.YarnaLogger;
        logger.debug('Initializing ROI calculator');

        try {
            const employeesSlider = document.getElementById('employees');
            const hoursSlider = document.getElementById('hours');
            const costSlider = document.getElementById('cost');

            if (!employeesSlider) {
                logger.debug('ROI calculator not on this page');
                return;
            }

            const employeesValue = document.getElementById('employees-value');
            const hoursValue = document.getElementById('hours-value');
            const costValue = document.getElementById('cost-value');
            const savingsDisplay = document.getElementById('savings-display');

            function calculateSavings() {
                try {
                    logger.startTimer('ROICalculation');

                    const employees = parseInt(employeesSlider.value);
                    const hours = parseInt(hoursSlider.value);
                    const cost = parseInt(costSlider.value);

                    logger.debug('Calculating ROI', { employees, hours, cost });

                    employeesValue.textContent = employees;
                    hoursValue.textContent = hours;
                    costValue.textContent = `$${cost}`;

                    const weeklyCost = employees * hours * cost;
                    const estimatedSavings = weeklyCost * 0.80; // 80% efficiency gain
                    const annualSavings = estimatedSavings * 52;

                    logger.info('ROI calculated', {
                        employees,
                        hours,
                        cost,
                        annualSavings: `$${Math.round(annualSavings).toLocaleString()}`
                    });

                    animateValue(savingsDisplay, 0, Math.round(annualSavings), 1000);
                    logger.endTimer('ROICalculation');
                } catch (error) {
                    logger.error('Error calculating ROI', {}, error);
                }
            }

            // Add event listeners
            [employeesSlider, hoursSlider, costSlider].forEach(slider => {
                slider.addEventListener('input', () => {
                    try {
                        logger.trackInteraction('roi_slider_change', slider.id, {
                            value: slider.value
                        });
                        calculateSavings();
                    } catch (error) {
                        logger.error('Error in slider input handler', { slider: slider.id }, error);
                    }
                });
            });

            // Initial calculation
            calculateSavings();
            logger.info('ROI calculator initialized successfully');
        } catch (error) {
            logger.error('Failed to initialize ROI calculator', {}, error);
        }
    }

    // ========================================
    // Animated Statistics
    // ========================================
    function initStats() {
        const logger = window.YarnaLogger;
        logger.debug('Initializing animated statistics');

        try {
            const statElements = document.querySelectorAll('.stat-number');

            if (!statElements.length) {
                logger.debug('No stat elements found on this page');
                return;
            }

            logger.info(`Found ${statElements.length} stat elements`);

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        try {
                            if (entry.isIntersecting) {
                                const target = parseFloat(entry.target.getAttribute('data-target'));
                                const suffix = entry.target.getAttribute('data-suffix') || '';

                                logger.debug('Animating stat', { target, suffix });
                                animateValue(entry.target, 0, target, 2000, suffix);
                                observer.unobserve(entry.target);
                            }
                        } catch (error) {
                            logger.error('Error animating stat', {}, error);
                        }
                    });
                },
                { threshold: 0.5 }
            );

            statElements.forEach(el => observer.observe(el));
            logger.info('Stats initialization complete');
        } catch (error) {
            logger.error('Failed to initialize stats', {}, error);
        }
    }

    // ========================================
    // Comparison Bar Animations
    // ========================================
    function initComparisonBars() {
        const logger = window.YarnaLogger;
        logger.debug('Initializing comparison bars');

        try {
            const bars = document.querySelectorAll('.bar-fill');

            if (!bars.length) {
                logger.debug('No comparison bars found on this page');
                return;
            }

            logger.info(`Found ${bars.length} comparison bars`);

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        try {
                            if (entry.isIntersecting) {
                                const width = entry.target.getAttribute('data-width');
                                logger.debug('Animating comparison bar', { width });
                                entry.target.style.width = width;
                                observer.unobserve(entry.target);
                            }
                        } catch (error) {
                            logger.error('Error animating comparison bar', {}, error);
                        }
                    });
                },
                { threshold: 0.5 }
            );

            bars.forEach(bar => {
                bar.style.width = '0%';
                observer.observe(bar);
            });

            logger.info('Comparison bars initialized successfully');
        } catch (error) {
            logger.error('Failed to initialize comparison bars', {}, error);
        }
    }

    // ========================================
    // Animated Particles Background
    // ========================================
    function initParticles() {
        const logger = window.YarnaLogger;
        logger.debug('Initializing particle animation');

        try {
            const particlesContainer = document.querySelector('.particles');

            if (!particlesContainer) {
                logger.debug('Particles container not found on this page');
                return;
            }

            logger.startTimer('ParticleGeneration');

            const particleCount = 30;
            const colors = ['rgba(59, 130, 246, 0.3)', 'rgba(96, 165, 250, 0.3)', 'rgba(37, 99, 235, 0.3)'];

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
                    logger.warn(`Error creating particle ${i}`, {}, error);
                }
            }

            logger.endTimer('ParticleGeneration', { particleCount });
            logger.info('Particles initialized successfully', { particleCount });
        } catch (error) {
            logger.error('Failed to initialize particles', {}, error);
        }
    }

    // ========================================
    // Contact Form Handling
    // ========================================
    function initContactForm() {
        const logger = window.YarnaLogger;
        logger.debug('Initializing contact form');

        try {
            const form = document.querySelector('form');

            if (!form) {
                logger.debug('No form found on this page');
                return;
            }

            form.addEventListener('submit', function(e) {
                try {
                    e.preventDefault();
                    logger.startTimer('FormSubmission');

                    // Get form data
                    const formData = new FormData(form);
                    const data = Object.fromEntries(formData.entries());

                    logger.info('Form submitted', {
                        fields: Object.keys(data),
                        dataLength: JSON.stringify(data).length
                    });

                    logger.trackInteraction('form_submit', 'contact-form', {
                        fields: Object.keys(data).length
                    });

                    // Show success message (in a real app, this would submit to a server)
                    alert('Thank you for your message! We will get back to you shortly.');
                    form.reset();

                    logger.endTimer('FormSubmission');
                    logger.info('Form submission completed successfully');
                } catch (error) {
                    logger.error('Error submitting form', {}, error);
                    alert('There was an error submitting your form. Please try again.');
                }
            });

            // Add real-time validation
            const inputs = form.querySelectorAll('.form-input, .form-textarea');
            logger.debug(`Found ${inputs.length} form inputs`);

            inputs.forEach(input => {
                input.addEventListener('blur', function() {
                    try {
                        const isValid = validateInput(this);
                        logger.debug('Input validation', {
                            field: this.name || this.id,
                            isValid
                        });
                    } catch (error) {
                        logger.error('Error validating input', { field: this.name || this.id }, error);
                    }
                });

                input.addEventListener('focus', function() {
                    logger.trackInteraction('form_field_focus', this.name || this.id);
                });
            });

            logger.info('Contact form initialized successfully');
        } catch (error) {
            logger.error('Failed to initialize contact form', {}, error);
        }
    }

    // ========================================
    // Helper Functions
    // ========================================

    function animateValue(element, start, end, duration, suffix = '') {
        const logger = window.YarnaLogger;

        try {
            logger.debug('Animating value', { start, end, duration, suffix });

            const range = end - start;
            const increment = range / (duration / 16); // 60 FPS
            let current = start;

            const timer = setInterval(() => {
                try {
                    current += increment;
                    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                        current = end;
                        clearInterval(timer);
                        logger.debug('Value animation completed', { finalValue: end });
                    }

                    // Format number with commas
                    const formatted = Math.round(current).toLocaleString();
                    element.textContent = `${suffix === '$' ? '$' : ''}${formatted}${suffix !== '$' ? suffix : ''}`;
                } catch (error) {
                    logger.error('Error in animation frame', { current }, error);
                    clearInterval(timer);
                }
            }, 16);
        } catch (error) {
            logger.error('Failed to start value animation', { start, end }, error);
        }
    }

    function validateInput(input) {
        const logger = window.YarnaLogger;

        try {
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
                logger.warn('Input validation failed', {
                    field: input.name || input.id,
                    type: type,
                    hasValue: !!value
                });
            }

            return isValid;
        } catch (error) {
            logger.error('Error in input validation', { field: input.name || input.id }, error);
            return false;
        }
    }

    // ========================================
    // Smooth Scroll for Anchor Links
    // ========================================
    function initSmoothScroll() {
        const logger = window.YarnaLogger;
        logger.debug('Initializing smooth scroll for anchor links');

        try {
            const anchors = document.querySelectorAll('a[href^="#"]');
            logger.debug(`Found ${anchors.length} anchor links`);

            anchors.forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    try {
                        const href = this.getAttribute('href');
                        if (href === '#') return;

                        const target = document.querySelector(href);
                        if (target) {
                            e.preventDefault();

                            logger.trackInteraction('smooth_scroll', href);
                            logger.startTimer('SmoothScroll_' + href);

                            const headerOffset = 80;
                            const elementPosition = target.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                            window.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth'
                            });

                            setTimeout(() => {
                                logger.endTimer('SmoothScroll_' + href);
                            }, 500);
                        }
                    } catch (error) {
                        logger.error('Error in smooth scroll', { href: this.getAttribute('href') }, error);
                    }
                });
            });

            logger.info('Smooth scroll initialized successfully');
        } catch (error) {
            logger.error('Failed to initialize smooth scroll', {}, error);
        }
    }

    // Initialize smooth scroll when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSmoothScroll);
    } else {
        initSmoothScroll();
    }

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
        const logger = window.YarnaLogger;

        try {
            logger.debug('Updating active navigation link');

            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            const navLinks = document.querySelectorAll('.nav-link');

            logger.debug('Current page', { currentPage, linkCount: navLinks.length });

            navLinks.forEach(link => {
                try {
                    const href = link.getAttribute('href');
                    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                        link.classList.add('active');
                        logger.debug('Active link set', { href });
                    } else {
                        link.classList.remove('active');
                    }
                } catch (error) {
                    logger.warn('Error updating nav link', { link: link.href }, error);
                }
            });

            logger.info('Active navigation link updated');
        } catch (error) {
            logger.error('Failed to update active nav link', {}, error);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateActiveNavLink);
    } else {
        updateActiveNavLink();
    }

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
