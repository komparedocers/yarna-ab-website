document.addEventListener('DOMContentLoaded', function () {

    // Initialize AOS (Animate on Scroll)
    AOS.init({
        duration: 800,
        once: true,
    });

    // Initialize Product Swiper
    const productSwiperEl = document.querySelector('.product-swiper');
    if (productSwiperEl) {
        const slideCount = productSwiperEl.querySelectorAll('.swiper-slide').length;
        const loopEnabled = slideCount > 3;

        new Swiper('.product-swiper', {
            loop: loopEnabled,
            slidesPerView: 1,
            spaceBetween: 30,
            autoplay: loopEnabled ? { delay: 5000, disableOnInteraction: false } : false,
            pagination: { el: '.swiper-pagination', clickable: true },
            breakpoints: {
                768: { slidesPerView: Math.min(2, slideCount), spaceBetween: 40 },
                992: { slidesPerView: Math.min(3, slideCount), spaceBetween: 50 },
            },
        });
    }

    // Particles.js configuration
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            "particles": {
                "number": {"value": 80, "density": {"enable": true, "value_area": 800}},
                "color": {"value": "#2b6cb0"},
                "shape": {"type": "circle"},
                "opacity": {"value": 0.5, "random": false},
                "size": {"value": 3, "random": true},
                "line_linked": {"enable": true, "distance": 150, "color": "#2b6cb0", "opacity": 0.4, "width": 1},
                "move": {"enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out"}
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {"onhover": {"enable": true, "mode": "repulse"}, "onclick": {"enable": true, "mode": "push"}},
                "modes": {"repulse": {"distance": 100}, "push": {"particles_nb": 4}}
            },
            "retina_detect": true
        });
    }

    // ROI Calculator Logic
    const employeesSlider = document.getElementById('employees');
    const hoursSlider = document.getElementById('hours');
    const costSlider = document.getElementById('cost');

    const employeesValue = document.getElementById('employees-value');
    const hoursValue = document.getElementById('hours-value');
    const costValue = document.getElementById('cost-value');
    const savingsDisplay = document.getElementById('savings-display');

    function calculateSavings() {
        if (!employeesSlider) return; // Don't run on pages without the calculator

        const employees = parseInt(employeesSlider.value);
        const hours = parseInt(hoursSlider.value);
        const cost = parseInt(costSlider.value);

        employeesValue.textContent = employees;
        hoursValue.textContent = hours;
        costValue.textContent = `$${cost}`;

        const weeklyCost = employees * hours * cost;
        const estimatedSavings = weeklyCost * 0.80; // Assuming 80% efficiency gain
        const annualSavings = estimatedSavings * 52;

        savingsDisplay.textContent = `$${Math.round(annualSavings).toLocaleString()}`;
    }

    if (employeesSlider) {
        [employeesSlider, hoursSlider, costSlider].forEach(slider => {
            slider.addEventListener('input', calculateSavings);
        });
        // Initial calculation
        calculateSavings();
    }

    // Animated Stats Logic
    function animateStats() {
        const counters = document.querySelectorAll('.stat-number');
        const speed = 200; // Lower is faster

        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText.replace(/\D/g, '');
                const increment = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + increment).toLocaleString();
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target.toLocaleString() + (counter.getAttribute('data-suffix') || '');
                }
            };
            updateCount();
        });
    }

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.ai-impact-section');
    if (statsSection) {
        observer.observe(statsSection);
    }
});
