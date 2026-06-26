// ===== Theme Toggle =====
function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) {
        document.documentElement.setAttribute('data-theme', saved);
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
}

initTheme();

const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });
}

// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== Mobile Navigation =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===== Active Nav Link on Scroll =====
const sections = document.querySelectorAll('section[id]');

function setActiveLink() {
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        if (link) {
            if (scrollPos >= top && scrollPos < top + height) {
                link.classList.add('active-link');
            } else {
                link.classList.remove('active-link');
            }
        }
    });
}

window.addEventListener('scroll', setActiveLink);

// ===== Counter Animation =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 1500;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.round(eased * target);
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    });
}

// ===== Scroll Reveal =====
const revealElements = document.querySelectorAll(
    '.section-title, .section-subtitle, .about-text, .about-stats, ' +
    '.skill-category, .project-card, .timeline-item, .education-card, .reference-card, .contact-card'
);

revealElements.forEach(el => el.classList.add('reveal'));

let countersAnimated = false;

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');

            if (entry.target.classList.contains('about-stats') && !countersAnimated) {
                countersAnimated = true;
                animateCounters();
            }

            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ===== Back to Top =====
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 600);
});

if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== Contact Form =====
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

function setFormStatus(msg, type) {
    if (!formStatus) return;
    formStatus.textContent = msg;
    formStatus.className = 'form-status' + (type ? ' ' + type : '');
}

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const action = contactForm.getAttribute('action');
        const name = document.getElementById('cf-name').value;
        const email = document.getElementById('cf-email').value;
        const subject = document.getElementById('cf-subject').value || 'Portfolio enquiry';
        const message = document.getElementById('cf-message').value;

        // Fallback: Formspree not configured yet — open the visitor's email app.
        if (!action || action.includes('YOUR_FORM_ID')) {
            const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`);
            window.location.href =
                `mailto:sindiayanda30@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
            setFormStatus('Opening your email app to send the message…', 'success');
            return;
        }

        setFormStatus('Sending…', '');
        try {
            const res = await fetch(action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { Accept: 'application/json' }
            });
            if (res.ok) {
                contactForm.reset();
                setFormStatus("Thanks! Your message has been sent — I'll be in touch soon.", 'success');
            } else {
                setFormStatus('Something went wrong. Please email me directly at sindiayanda30@gmail.com.', 'error');
            }
        } catch (err) {
            setFormStatus('Network error. Please email me directly at sindiayanda30@gmail.com.', 'error');
        }
    });
}

// ===== Smooth Scroll for Safari =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
