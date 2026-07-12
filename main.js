/* ── Title Screen: Coin Insert Mechanic ── */
const chestImage = document.getElementById('chestImage');
const coinPile = document.getElementById('coinPile');
const coins = document.querySelectorAll('.coin-pile .draggable');
const slot = document.getElementById('dropZone');
const titleScreen = document.getElementById('titleScreen');
const portfolioScreen = document.getElementById('portfolioScreen');
const skipIntroBtn = document.getElementById('skipIntro');

let isChestOpen = false;
let isDragging = false;
let startX, startY;
let currentCoin = null;

function enterPortfolio() {
    if (!titleScreen || !portfolioScreen) return;
    titleScreen.classList.add('fade-out');
    setTimeout(() => {
        titleScreen.classList.add('hidden');
        portfolioScreen.classList.remove('hidden');
        portfolioScreen.classList.add('fade-in');
        initScrollAnimations();
        animateStats();
    }, 600);
}

if (skipIntroBtn) {
    skipIntroBtn.addEventListener('click', enterPortfolio);
}

if (chestImage) {
    chestImage.addEventListener('click', () => {
        if (isChestOpen) return;
        isChestOpen = true;
        chestImage.src = 'chest-open.png';
        chestImage.classList.add('opened');
        chestImage.style.pointerEvents = 'none';
        coinPile.classList.remove('hidden');
    });
}

const resetCoin = () => {
    if (!currentCoin) return;
    currentCoin.classList.remove('dragging');
    currentCoin.style.position = 'relative';
    currentCoin.style.left = 'auto';
    currentCoin.style.top = 'auto';
    currentCoin.style.zIndex = '100';
    currentCoin.style.margin = '';
    currentCoin.style.transition = '';
    slot.classList.remove('highlight');
    currentCoin = null;
};

const startDrag = (e) => {
    if (!isChestOpen) return;
    e.preventDefault();
    currentCoin = e.target;
    isDragging = true;
    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
    startX = clientX;
    startY = clientY;
    const rect = currentCoin.getBoundingClientRect();
    currentCoin.style.position = 'fixed';
    currentCoin.style.left = rect.left + 'px';
    currentCoin.style.top = rect.top + 'px';
    currentCoin.style.margin = '0';
    currentCoin.style.zIndex = '1000';
    currentCoin.classList.add('dragging');
};

const drag = (e) => {
    if (!isDragging || !currentCoin) return;
    e.preventDefault();
    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
    const dx = clientX - startX;
    const dy = clientY - startY;
    startX = clientX;
    startY = clientY;
    const rect = currentCoin.getBoundingClientRect();
    const nextLeft = rect.left + dx;
    const nextTop = rect.top + dy;
    currentCoin.style.left = nextLeft + 'px';
    currentCoin.style.top = nextTop + 'px';
    const slotRect = slot.getBoundingClientRect();
    const coinCenterX = nextLeft + rect.width / 2;
    const coinCenterY = nextTop + rect.height / 2;
    const overSlot =
        coinCenterX > slotRect.left && coinCenterX < slotRect.right &&
        coinCenterY > slotRect.top && coinCenterY < slotRect.bottom;
    slot.classList.toggle('highlight', overSlot);
};

const stopDrag = () => {
    if (!isDragging || !currentCoin) return;
    isDragging = false;
    const slotRect = slot.getBoundingClientRect();
    const coinRect = currentCoin.getBoundingClientRect();
    const coinCenterX = coinRect.left + coinRect.width / 2;
    const coinCenterY = coinRect.top + coinRect.height / 2;
    const dropped =
        coinCenterX > slotRect.left && coinCenterX < slotRect.right &&
        coinCenterY > slotRect.top && coinCenterY < slotRect.bottom;

    if (dropped) {
        currentCoin.classList.remove('dragging');
        currentCoin.classList.add('inserted');
        slot.appendChild(currentCoin);
        currentCoin.style.position = 'absolute';
        currentCoin.style.left = '50%';
        currentCoin.style.top = '-30px';
        currentCoin.style.transform = 'translateX(-50%)';
        currentCoin.style.transition = 'top 0.4s ease-in, transform 0.4s, opacity 0.4s';
        setTimeout(() => {
            currentCoin.style.top = '25px';
            currentCoin.style.transform = 'translateX(-50%) scaleX(0.1)';
            currentCoin.style.opacity = '0';
        }, 50);
        setTimeout(enterPortfolio, 500);
    } else {
        resetCoin();
    }
};

coins.forEach((c) => {
    c.addEventListener('mousedown', startDrag);
    c.addEventListener('touchstart', startDrag, { passive: false });
});
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', stopDrag);
document.addEventListener('touchmove', drag, { passive: false });
document.addEventListener('touchend', stopDrag);

/* ── Scroll Reveal ── */
function initScrollAnimations() {
    const targets = document.querySelectorAll('.reveal');
    if (!targets.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach((el) => observer.observe(el));
}

if (portfolioScreen && !portfolioScreen.classList.contains('hidden')) {
    initScrollAnimations();
    animateStats();
}

/* ── Animated Stat Counters ── */
function animateStats() {
    document.querySelectorAll('[data-count]').forEach((el) => {
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1400;
        const start = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
    });
}

/* ── Skill Bar Animation ── */
function initSkillBars() {
    const bars = document.querySelectorAll('.skill-fill');
    if (!bars.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.width = entry.target.dataset.level + '%';
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.3 }
    );

    bars.forEach((bar) => observer.observe(bar));
}
initSkillBars();

/* ── Active Nav Highlight ── */
function initNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.top-nav .nav-link[href*="#"]');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach((link) => {
                        link.classList.toggle('active', link.getAttribute('href').includes('#' + id));
                    });
                }
            });
        },
        { threshold: 0.35, rootMargin: '-80px 0px -60% 0px' }
    );

    sections.forEach((s) => observer.observe(s));
}
initNavHighlight();

/* ── Mobile Nav Toggle ── */
const navToggle = document.getElementById('navToggle');
const topNav = document.querySelector('.top-nav');

if (navToggle && topNav) {
    navToggle.addEventListener('click', () => {
        topNav.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', topNav.classList.contains('open'));
    });

    topNav.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', () => topNav.classList.remove('open'));
    });
}

/* ── Contact Form Handler ── */
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const action = contactForm.getAttribute('action') || '';

        if (action.includes('YOUR_ID_HERE')) {
            formStatus.textContent = 'Form not configured yet — use the social links below to reach me directly.';
            formStatus.className = 'form-status warn';
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = 'SENDING...';

        try {
            const response = await fetch(action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { Accept: 'application/json' }
            });
            if (!response.ok) throw new Error('Failed');
            contactForm.reset();
            formStatus.textContent = 'Message sent! I will reply soon.';
            formStatus.className = 'form-status success';
        } catch {
            formStatus.textContent = 'Could not send — please email me directly.';
            formStatus.className = 'form-status error';
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'SEND MESSAGE';
        }
    });
}

/* ── Typing Effect for Subtitle ── */
const typedEl = document.getElementById('typedRole');
if (typedEl) {
    const roles = ['AI/ML Developer', 'Deep Learning Engineer', 'Computer Vision Builder', 'Full-Stack Creator'];
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const type = () => {
        const current = roles[roleIndex];
        typedEl.textContent = deleting
            ? current.substring(0, charIndex--)
            : current.substring(0, charIndex++);

        let delay = deleting ? 40 : 80;

        if (!deleting && charIndex === current.length + 1) {
            delay = 2000;
            deleting = true;
        } else if (deleting && charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            delay = 400;
        }

        setTimeout(type, delay);
    };

    type();
}
