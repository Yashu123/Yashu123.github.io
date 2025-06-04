document.addEventListener('DOMContentLoaded', () => {

    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuButton.addEventListener('click', () => {
        const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
        mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.classList.toggle('hidden');
        mobileMenuButton.querySelectorAll('svg').forEach(svg => svg.classList.toggle('hidden'));
    });
    
    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuButton.setAttribute('aria-expanded', 'false');
            mobileMenu.classList.add('hidden');
            mobileMenuButton.querySelectorAll('svg').forEach(svg => svg.classList.toggle('hidden'));
        });
    });

    // Services Tabs
    const tabs = document.querySelectorAll('.tab-button');
    const contents = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('border-blue-500', 'text-blue-600'));
            tabs.forEach(t => t.classList.add('border-transparent', 'text-slate-500'));
            tab.classList.remove('border-transparent', 'text-slate-500');
            tab.classList.add('border-blue-500', 'text-blue-600');
            
            contents.forEach(c => c.classList.add('hidden'));
            const contentId = 'content-' + tab.id.split('-')[1];
            document.getElementById(contentId).classList.remove('hidden');
        });
    });

    // Services Chart
    const ctx = document.getElementById('servicesChart').getContext('2d');
    const servicesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Exports', 'Imports'],
            datasets: [{
                label: 'Service Focus',
                data: [70, 30],
                backgroundColor: [
                    'rgba(37, 99, 235, 0.8)', // blue-600
                    'rgba(148, 163, 184, 0.8)' // slate-400
                ],
                borderColor: [
                    'rgba(37, 99, 235, 1)',
                    'rgba(148, 163, 184, 1)'
                ],
                borderWidth: 1,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                       font: {
                            size: 14,
                            family: 'Inter, sans-serif'
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed !== null) {
                                label += context.parsed + '%';
                            }
                            return label;
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });

    // Active Nav Link on Scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.main-header nav a.nav-link');
    
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.4
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if(link.getAttribute('href').substring(1) === entry.target.id) {
                    link.classList.add('active');
                }
            });
        }
      });
    }, observerOptions);

    sections.forEach(section => {
      observer.observe(section);
    });

    // Scroll-based animations
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                animationObserver.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    animateElements.forEach(element => {
        animationObserver.observe(element);
    });

    // Contact Form Validation
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('form-success');
    
    const fields = {
        businessName: { required: true },
        email: { required: true, isEmail: true },
        phone: { required: true }
    };
    
    const validateField = (fieldId, value) => {
        const errorEl = document.getElementById(`${fieldId}Error`);
        const inputEl = document.getElementById(fieldId);
        let valid = true;
        
        if (fields[fieldId].required && !value) {
            errorEl.textContent = `${inputEl.placeholder.replace('*', '')} is required.`;
            valid = false;
        } else if (fields[fieldId].isEmail && !/^\S+@\S+\.\S+$/.test(value)) {
            errorEl.textContent = 'Please enter a valid email address.';
            valid = false;
        }
        
        errorEl.classList.toggle('hidden', valid);
        return valid;
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isFormValid = true;
        for (const fieldId in fields) {
            const input = document.getElementById(fieldId);
            if (!validateField(fieldId, input.value.trim())) {
                isFormValid = false;
            }
        }
        if (isFormValid) {
            fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    form.reset();
                    form.classList.add('hidden');
                    successMessage.classList.remove('hidden');
                } else {
                    alert('There was a problem submitting your form.');
                }
            }).catch(() => {
                alert('There was a problem submitting your form.');
            });
        }
    });
    
    for (const fieldId in fields) {
        document.getElementById(fieldId).addEventListener('input', (e) => {
            validateField(fieldId, e.target.value.trim());
        });
    }

    // Footer Year
    document.getElementById('currentYear').textContent = new Date().getFullYear();
});