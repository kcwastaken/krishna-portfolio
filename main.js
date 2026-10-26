/* ════════════════════════════════════════════════════════════
   KRISHNA CHAUDHARY — ARCADE PORTFOLIO
   Interactive Coin Mechanic, 8-Bit Web Audio & Warp Transitions
   ════════════════════════════════════════════════════════════ */

/* ── 8-Bit Retro Sound Synthesizer (Web Audio API) ── */
class RetroArcadeAudio {
    constructor() {
        this.ctx = null;
        this.muted = localStorage.getItem('arcade_sound_muted') === 'true';
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem('arcade_sound_muted', this.muted);
        if (typeof pokeThemeAudio !== 'undefined' && pokeThemeAudio) {
            if (this.muted) {
                pokeThemeAudio.pause();
            } else if (typeof activePokemonEntities !== 'undefined' && activePokemonEntities.length > 0) {
                pokeThemeAudio.play().catch(() => {});
            }
        }
        return this.muted;
    }

    playChestOpen() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        // Wooden creak / spring
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(360, now + 0.18);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);

        // Treasure shimmer chimes
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
            const chime = this.ctx.createOscillator();
            const chimeGain = this.ctx.createGain();
            const t = now + 0.08 + idx * 0.06;
            chime.type = 'triangle';
            chime.frequency.setValueAtTime(freq, t);
            chimeGain.gain.setValueAtTime(0.12, t);
            chimeGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
            chime.connect(chimeGain);
            chimeGain.connect(this.ctx.destination);
            chime.start(t);
            chime.stop(t + 0.26);
        });
    }

    playCoinPickup() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1250, now + 0.07);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
    }

    // Classic 2-Tone Arcade Coin Ring: B5 (987.77 Hz) -> E6 (1318.51 Hz)
    playCoinInsert() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        osc1.type = 'square';
        osc1.frequency.setValueAtTime(987.77, now);
        gain1.gain.setValueAtTime(0.2, now);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc1.connect(gain1);
        gain1.connect(this.ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.08);

        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(1318.51, now + 0.08);
        gain2.gain.setValueAtTime(0.25, now + 0.08);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
        osc2.connect(gain2);
        gain2.connect(this.ctx.destination);
        osc2.start(now + 0.08);
        osc2.stop(now + 0.55);
    }

    playJump() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(620, now + 0.16);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
    }

    playGameStart() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const arpeggio = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
        arpeggio.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = now + idx * 0.05;
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t);
            gain.gain.setValueAtTime(0.15, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.16);
        });
    }

    playCheatUnlock() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [
            { f: 523.25, d: 0.09 },
            { f: 587.33, d: 0.09 },
            { f: 659.25, d: 0.09 },
            { f: 783.99, d: 0.11 },
            { f: 880.00, d: 0.11 },
            { f: 1046.50, d: 0.35 }
        ];
        let offset = 0;
        notes.forEach((n) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(n.f, now + offset);
            gain.gain.setValueAtTime(0.18, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.001, now + offset + n.d);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + offset);
            osc.stop(now + offset + n.d);
            offset += n.d * 0.85;
        });
    }
}

const arcadeAudio = new RetroArcadeAudio();

/* ── DOM References ── */
const chestImage = document.getElementById('chestImage');
const chestHint = document.getElementById('chestHint');
const coinPile = document.getElementById('coinPile');
const coins = document.querySelectorAll('.coin-pile .draggable');
const slot = document.getElementById('dropZone');
const arcadeDoor = document.getElementById('arcadeDoor');
const coinRejectBtn = document.getElementById('coinRejectBtn');
const titleScreen = document.getElementById('titleScreen');
const portfolioScreen = document.getElementById('portfolioScreen');
const skipIntroBtn = document.getElementById('skipIntro');
const soundToggle = document.getElementById('soundToggle');
const playerBadge = document.querySelector('.player-badge');
const insertInstructions = document.getElementById('insertInstructions');
const heroSprite = document.getElementById('heroSprite');
const pixelHero = document.getElementById('pixelHero');
const heroBubble = document.getElementById('heroBubble');

let isChestOpen = false;
let isDragging = false;
let hasInserted = false;
let grabOffsetX = 0;
let grabOffsetY = 0;
let currentCoin = null;

/* ── Sound Toggle Setup ── */
if (soundToggle) {
    if (arcadeAudio.muted) {
        soundToggle.textContent = '🔇';
        soundToggle.classList.add('muted');
        soundToggle.title = 'Sound: MUTED (Click to unmute)';
    }
    soundToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isMuted = arcadeAudio.toggleMute();
        soundToggle.textContent = isMuted ? '🔇' : '🔊';
        soundToggle.classList.toggle('muted', isMuted);
        soundToggle.title = isMuted ? 'Sound: MUTED' : 'Sound: ON';
        if (!isMuted) {
            arcadeAudio.playCoinPickup();
        }
    });
}

/* ── Open Chest Logic ── */
function openChest() {
    if (isChestOpen) return;
    isChestOpen = true;
    chestImage.src = 'chest-open.png';
    chestImage.classList.add('opened');
    chestImage.style.pointerEvents = 'none';
    if (chestHint) chestHint.classList.add('hidden');
    coinPile.classList.remove('hidden');

    if (insertInstructions) {
        insertInstructions.textContent = 'DRAG COIN → INSERT TO PLAY';
        insertInstructions.classList.add('ready');
    }

    arcadeAudio.playChestOpen();

    if (pixelHero) {
        pixelHero.classList.remove('jump', 'victory');
        void pixelHero.offsetWidth;
        pixelHero.classList.add('jump');
        setTimeout(() => pixelHero.classList.remove('jump'), 400);
    }
}

if (chestImage) {
    chestImage.addEventListener('click', openChest);
}

/* ── Enter Portfolio Transition ── */
function enterPortfolio() {
    if (!titleScreen || !portfolioScreen) return;
    titleScreen.classList.add('fade-out');
    setTimeout(() => {
        titleScreen.classList.add('hidden');
        titleScreen.classList.remove('fade-out');

        portfolioScreen.classList.remove('hidden');
        portfolioScreen.classList.add('fade-in');

        window.scrollTo({ top: 0, behavior: 'instant' });

        initScrollAnimations();
        animateStats();
    }, 400);
}

if (skipIntroBtn) {
    skipIntroBtn.addEventListener('click', enterPortfolio);
}

/* ── Insert Coin & Reveal Portfolio ── */
function insertCoinAndTransition(coin) {
    if (hasInserted) return;
    hasInserted = true;

    arcadeAudio.playCoinInsert();

    // Lock coin inside slot visually
    coin.classList.remove('dragging');
    coin.classList.add('inserted');
    if (slot) {
        slot.appendChild(coin);
        coin.style.position = 'absolute';
        coin.style.left = '50%';
        coin.style.top = '-20px';
        coin.style.transform = 'translateX(-50%)';
        coin.style.transition = 'top 0.35s ease-in, transform 0.35s, opacity 0.3s';

        // Flash burst on slot
        const burst = document.createElement('div');
        burst.className = 'slot-flash-burst';
        slot.appendChild(burst);
        setTimeout(() => burst.remove(), 450);

        setTimeout(() => {
            coin.style.top = '12px';
            coin.style.transform = 'translateX(-50%) scaleX(0.1)';
            coin.style.opacity = '0';
        }, 30);
    }

    if (slot) slot.classList.add('highlight');
    if (arcadeDoor) arcadeDoor.classList.add('drag-over');

    // Hero victory jump
    if (pixelHero) {
        pixelHero.classList.remove('jump');
        void pixelHero.offsetWidth;
        pixelHero.classList.add('victory');
    }

    // Player Badge Update
    if (playerBadge) {
        playerBadge.textContent = '★ PLAYER 1 READY ★';
        playerBadge.classList.add('game-started');
    }

    if (insertInstructions) {
        insertInstructions.textContent = '★ COIN ACCEPTED! LOADING PORTFOLIO... ★';
    }

    // Warp Stars & CRT Flash
    setTimeout(() => {
        arcadeAudio.playGameStart();
        const starsLayer = document.querySelector('.stars-layer');
        const shootingStars = document.querySelector('.shooting-stars');
        if (starsLayer) starsLayer.classList.add('stars-warp');
        if (shootingStars) shootingStars.classList.add('stars-warp');

        const crtFlash = document.createElement('div');
        crtFlash.className = 'crt-flash-overlay';
        document.body.appendChild(crtFlash);
        setTimeout(() => crtFlash.remove(), 400);
    }, 150);

    // Reveal main page
    setTimeout(enterPortfolio, 550);
}

/* ── Pure Drag & Drop (Zero Drift, Locked to Mouse) ── */
const resetCoin = () => {
    if (!currentCoin) return;
    currentCoin.classList.remove('dragging');
    currentCoin.style.position = 'relative';
    currentCoin.style.left = 'auto';
    currentCoin.style.top = 'auto';
    currentCoin.style.zIndex = '100';
    currentCoin.style.margin = '';
    currentCoin.style.transition = '';
    if (slot) slot.classList.remove('highlight');
    if (arcadeDoor) arcadeDoor.classList.remove('drag-over');
    currentCoin = null;
};

const startDrag = (e) => {
    if (!isChestOpen || hasInserted) return;
    e.preventDefault();
    currentCoin = e.target;
    isDragging = true;

    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

    const rect = currentCoin.getBoundingClientRect();
    grabOffsetX = clientX - rect.left;
    grabOffsetY = clientY - rect.top;

    currentCoin.style.position = 'fixed';
    currentCoin.style.left = (clientX - grabOffsetX) + 'px';
    currentCoin.style.top = (clientY - grabOffsetY) + 'px';
    currentCoin.style.margin = '0';
    currentCoin.style.zIndex = '10000';
    currentCoin.classList.add('dragging');

    arcadeAudio.playCoinPickup();
};

const drag = (e) => {
    if (!isDragging || !currentCoin) return;
    e.preventDefault();
    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

    const coinLeft = clientX - grabOffsetX;
    const coinTop = clientY - grabOffsetY;

    currentCoin.style.left = coinLeft + 'px';
    currentCoin.style.top = coinTop + 'px';

    const doorEl = arcadeDoor || slot;
    if (doorEl) {
        const doorRect = doorEl.getBoundingClientRect();
        const coinW = currentCoin.offsetWidth || 30;
        const coinH = currentCoin.offsetHeight || 30;
        const coinCenterX = coinLeft + coinW / 2;
        const coinCenterY = coinTop + coinH / 2;

        const overDoor = (
            coinCenterX >= doorRect.left - 20 &&
            coinCenterX <= doorRect.right + 20 &&
            coinCenterY >= doorRect.top - 20 &&
            coinCenterY <= doorRect.bottom + 20
        );

        if (slot) slot.classList.toggle('highlight', overDoor);
        if (arcadeDoor) arcadeDoor.classList.toggle('drag-over', overDoor);
    }
};

const stopDrag = (e) => {
    if (!isDragging || !currentCoin) return;
    isDragging = false;

    const clientX = e.type.includes('mouse') ? (e.clientX || 0) : (e.changedTouches ? e.changedTouches[0].clientX : 0);
    const clientY = e.type.includes('mouse') ? (e.clientY || 0) : (e.changedTouches ? e.changedTouches[0].clientY : 0);

    const doorEl = arcadeDoor || slot;
    const doorRect = doorEl ? doorEl.getBoundingClientRect() : null;
    const coinRect = currentCoin.getBoundingClientRect();

    const coinCenterX = coinRect.left + coinRect.width / 2;
    const coinCenterY = coinRect.top + coinRect.height / 2;

    const droppedOnTarget = doorRect && (
        (coinCenterX >= doorRect.left - 25 && coinCenterX <= doorRect.right + 25 &&
         coinCenterY >= doorRect.top - 25 && coinCenterY <= doorRect.bottom + 25) ||
        (clientX >= doorRect.left - 25 && clientX <= doorRect.right + 25 &&
         clientY >= doorRect.top - 25 && clientY <= doorRect.bottom + 25)
    );

    if (droppedOnTarget && !hasInserted) {
        const coinToInsert = currentCoin;
        currentCoin = null;
        insertCoinAndTransition(coinToInsert);
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

/* ── Interactive Pixel Hero Easter Egg (Click Only) ── */
if (heroSprite && pixelHero) {
    const heroPhrases = [
        "READY PLAYER 1! 🚀",
        "INSERT 25¢ TO PLAY! 🕹️",
        "LET'S BUILD COOL AI! 🤖",
        "DRAG COIN TO THE SLOT! ✨",
        "HIGH SCORE: 999999! 🏆",
        "SUPER KC BROTHERS! 🍄"
    ];
    let phraseIndex = 0;
    let bubbleTimeout = null;

    const jumpHero = () => {
        arcadeAudio.playJump();
        pixelHero.classList.remove('jump', 'victory');
        void pixelHero.offsetWidth;
        pixelHero.classList.add('jump');
        setTimeout(() => pixelHero.classList.remove('jump'), 400);

        if (heroBubble) {
            heroBubble.textContent = heroPhrases[phraseIndex % heroPhrases.length];
            phraseIndex++;
            heroBubble.classList.add('visible');
            clearTimeout(bubbleTimeout);
            bubbleTimeout = setTimeout(() => {
                heroBubble.classList.remove('visible');
            }, 2000);
        }
    };

    heroSprite.addEventListener('click', jumpHero);
}

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

/* ════════════════════════════════════════════════════════════
   NEW INTERACTIVE MODULES: 3D TILT, FILTERING, RESUME, KONAMI
   ════════════════════════════════════════════════════════════ */

/* ── 1. Interactive 3D Parallax Tilt for Player Card HUD ── */
const playerCard = document.getElementById('playerCardHud');
if (playerCard) {
    let cardBounds = null;

    const onMouseEnter = () => {
        cardBounds = playerCard.getBoundingClientRect();
    };

    const onMouseMove = (e) => {
        if (!cardBounds) cardBounds = playerCard.getBoundingClientRect();
        const mouseX = e.clientX - cardBounds.left;
        const mouseY = e.clientY - cardBounds.top;

        const xPct = mouseX / cardBounds.width - 0.5;
        const yPct = mouseY / cardBounds.height - 0.5;

        // Subtle 3D rotation (-14 to +14 deg)
        const rotX = -yPct * 20;
        const rotY = xPct * 20;

        playerCard.style.transform = `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const onMouseLeave = () => {
        cardBounds = null;
        playerCard.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    };

    playerCard.addEventListener('mouseenter', onMouseEnter);
    playerCard.addEventListener('mousemove', onMouseMove);
    playerCard.addEventListener('mouseleave', onMouseLeave);
}

/* ── 2. Active Quests (Projects) Category Filter ── */
const filterTabs = document.querySelectorAll('#questFilters .filter-tab');
const questCards = document.querySelectorAll('#questCardContainer .quest-card');

if (filterTabs.length && questCards.length) {
    filterTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            filterTabs.forEach((t) => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.dataset.filter || 'all';
            arcadeAudio.playCoinPickup();

            questCards.forEach((card) => {
                const category = card.dataset.category || '';
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden-filter');
                } else {
                    card.classList.add('hidden-filter');
                }
            });
        });
    });
}

/* ── 3. Tap to Flip Cards (Mobile Friendly) ── */
questCards.forEach((card) => {
    card.addEventListener('click', (e) => {
        // If clicking a link inside back card, allow standard navigation
        if (e.target.closest('a')) return;
        card.classList.toggle('flipped');
    });
});

/* ── 4. Resume Modal Controller & High-Res Document Viewer ── */
const resumeBtn = document.getElementById('resumeBtn');
const resumeModal = document.getElementById('resumeModal');
const closeResumeBtn = document.getElementById('closeResumeBtn');
const resumeCloseFooter = document.getElementById('resumeCloseFooter');
const resumeBackdrop = document.getElementById('resumeBackdrop');
const resumeZoomIn = document.getElementById('resumeZoomIn');
const resumeZoomOut = document.getElementById('resumeZoomOut');
const resumeZoomFit = document.getElementById('resumeZoomFit');
const resumeZoomVal = document.getElementById('resumeZoomVal');
const resumeSheetWrap = document.getElementById('resumeSheetWrap');

let currentResumeZoom = 100;
const applyResumeZoom = (val) => {
    currentResumeZoom = Math.max(60, Math.min(220, val));
    if (resumeZoomVal) resumeZoomVal.textContent = currentResumeZoom + '%';
    if (resumeSheetWrap) {
        if (currentResumeZoom === 100) {
            resumeSheetWrap.style.maxWidth = '780px';
        } else {
            resumeSheetWrap.style.maxWidth = `${Math.round(780 * (currentResumeZoom / 100))}px`;
        }
    }
};

if (resumeZoomIn) resumeZoomIn.addEventListener('click', () => applyResumeZoom(currentResumeZoom + 20));
if (resumeZoomOut) resumeZoomOut.addEventListener('click', () => applyResumeZoom(currentResumeZoom - 20));
if (resumeZoomFit) resumeZoomFit.addEventListener('click', () => applyResumeZoom(100));

const openResume = () => {
    if (!resumeModal) return;
    resumeModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    applyResumeZoom(100);
    arcadeAudio.playCoinPickup();
};

const closeResume = () => {
    if (!resumeModal) return;
    resumeModal.classList.add('hidden');
    document.body.style.overflow = '';
};

if (resumeBtn) resumeBtn.addEventListener('click', openResume);
if (closeResumeBtn) closeResumeBtn.addEventListener('click', closeResume);
if (resumeCloseFooter) resumeCloseFooter.addEventListener('click', closeResume);
if (resumeBackdrop) resumeBackdrop.addEventListener('click', closeResume);

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal && !resumeModal.classList.contains('hidden')) {
        closeResume();
    }
});

/* ── 5. Konami Code Easter Egg (↑ ↑ ↓ ↓ ← → ← → B A) & Pokémon Shatter ── */
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;
const godModeBanner = document.getElementById('godModeBanner');
const dismissBannerBtn = document.getElementById('dismissBannerBtn');
const konamiHint = document.querySelector('.konami-hint');

// The 14 Verified Pokémon with Accurate Names & Cries
const pokemonList = [
    { src: 'pokemons/pokemon-1.gif', cry: 'MEW! ✨', size: 135 },
    { src: 'pokemons/pokemon-2.gif', cry: 'UMBREON! 🌙', size: 130 },
    { src: 'pokemons/pokemon-3.gif', cry: 'DEINO! 🐉', size: 130 },
    { src: 'pokemons/pokemon-4.gif', cry: 'GENGAR! 👻', size: 140 },
    { src: 'pokemons/pokemon-5.gif', cry: 'RAYQUAZA! ⚡', size: 135 },
    { src: 'pokemons/pokemon-6.gif', cry: 'MEOWTH! 💰', size: 125 },
    { src: 'pokemons/pokemon-7.gif', cry: 'CHARIZARD! 🔥', size: 135 },
    { src: 'pokemons/pokemon-8.gif', cry: 'CERULEDGE! ⚔️', size: 135 },
    { src: 'pokemons/pokemon-9.gif', cry: 'BULBASAUR! 🍃', size: 130 },
    { src: 'pokemons/pokemon-10.gif', cry: 'PRIMEAPE! 💢', size: 135 },
    { src: 'pokemons/pokemon-11.gif', cry: 'CERULEDGE! ⚔️', size: 135 },
    { src: 'pokemons/pokemon-12.gif', cry: 'LUCARIO! 🥊', size: 135 },
    { src: 'pokemons/pokemon-13.gif', cry: 'GYARADOS! 🌊', size: 140 },
    { src: 'pokemons/pokemon-14.gif', cry: 'MEWTWO! 🔮', size: 140 }
];

let activePokemonEntities = [];
let pokemonAnimFrameId = null;
let pokeThemeAudio = null;

const playPokeTheme = () => {
    if (!pokeThemeAudio) {
        pokeThemeAudio = new Audio('pokemon-battle.mp3');
        pokeThemeAudio.loop = true;
    }
    // Comfortable non-loud volume (22%)
    pokeThemeAudio.volume = 0.22;
    if (!arcadeAudio.muted) {
        pokeThemeAudio.currentTime = 0;
        const playPromise = pokeThemeAudio.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {});
        }
    }
};

const stopPokeTheme = () => {
    if (pokeThemeAudio && !pokeThemeAudio.paused) {
        const fadeInterval = setInterval(() => {
            if (pokeThemeAudio.volume > 0.04) {
                pokeThemeAudio.volume = Math.max(0, pokeThemeAudio.volume - 0.04);
            } else {
                clearInterval(fadeInterval);
                pokeThemeAudio.pause();
                pokeThemeAudio.currentTime = 0;
                pokeThemeAudio.volume = 0.22;
            }
        }, 40);
    }
};

const clearActivePokemons = () => {
    if (pokemonAnimFrameId) {
        cancelAnimationFrame(pokemonAnimFrameId);
        pokemonAnimFrameId = null;
    }
    stopPokeTheme();
    const layer = document.getElementById('pokemonShatterLayer');
    if (layer) layer.remove();
    activePokemonEntities = [];
    if (godModeBanner) godModeBanner.classList.add('hidden');
};

const triggerGodMode = () => {
    if (godModeBanner) godModeBanner.classList.remove('hidden');
    arcadeAudio.playCheatUnlock();
    playPokeTheme();

    // Shockwave explosion effect
    const shockwave = document.createElement('div');
    shockwave.className = 'shatter-shockwave';
    document.body.appendChild(shockwave);
    setTimeout(() => shockwave.remove(), 800);

    // Spawn 16 Lightweight Confetti Particles
    const colors = ['#ffcc00', '#ff007f', '#00d4ff', '#33ff88', '#ffffff'];
    const confettiFrag = document.createDocumentFragment();
    for (let i = 0; i < 16; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'pixel-confetti';
        confetti.style.left = (i * 6 + Math.random() * 4) + 'vw';
        confetti.style.top = '-10px';
        confetti.style.backgroundColor = colors[i % colors.length];
        confetti.style.animationDuration = (1.4 + Math.random() * 1.2) + 's';
        confettiFrag.appendChild(confetti);
        setTimeout(() => confetti.remove(), 2600);
    }
    document.body.appendChild(confettiFrag);

    // Spawn Pokémon Shatter Layer
    let layer = document.getElementById('pokemonShatterLayer');
    if (!layer) {
        layer = document.createElement('div');
        layer.id = 'pokemonShatterLayer';
        layer.className = 'pokemon-shatter-layer';
        document.body.appendChild(layer);
    }

    const spawnCenterX = window.innerWidth / 2;
    const spawnCenterY = window.innerHeight / 2;
    const pokeFrag = document.createDocumentFragment();

    pokemonList.forEach((poke, idx) => {
        const el = document.createElement('div');
        el.className = 'wild-pokemon-entity';
        el.style.width = poke.size + 'px';

        const bubble = document.createElement('div');
        bubble.className = 'poke-speech-bubble';
        bubble.textContent = poke.cry;

        const img = document.createElement('img');
        img.src = poke.src;
        img.alt = poke.cry;
        img.loading = 'eager';

        el.appendChild(bubble);
        el.appendChild(img);
        pokeFrag.appendChild(el);

        // Calculate shatter burst angle & initial velocity
        const angle = (idx / pokemonList.length) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        const blastSpeed = 15 + Math.random() * 12;

        const entity = {
            el,
            bubble,
            x: spawnCenterX - poke.size / 2,
            y: spawnCenterY - poke.size / 2,
            vx: Math.cos(angle) * blastSpeed,
            vy: Math.sin(angle) * blastSpeed - 7,
            width: poke.size,
            height: poke.size,
            scale: 0.3,
            targetScale: 1,
            cry: poke.cry,
            mode: 'shatter',
            isDragging: false,
            dragOffsetX: 0,
            dragOffsetY: 0,
            lastX: 0,
            lastY: 0,
            lastTime: 0,
            baseY: 0,
            roamTimer: Math.random() * 20,
            facing: 1
        };

        // Pointer Down: Click and Hold to Drag
        el.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            e.stopPropagation();

            try {
                el.setPointerCapture(e.pointerId);
            } catch (err) {}

            entity.isDragging = true;
            entity.mode = 'drag';
            entity.dragOffsetX = e.clientX - entity.x;
            entity.dragOffsetY = e.clientY - entity.y;
            entity.lastX = e.clientX;
            entity.lastY = e.clientY;
            entity.lastTime = performance.now();
            entity.vx = 0;
            entity.vy = 0;

            arcadeAudio.playJump();
            bubble.classList.add('visible');
            el.classList.add('is-dragged');

            // Bring active dragged pokemon to the front
            layer.appendChild(el);
        });

        // Pointer Move: Drag smoothly to any level
        el.addEventListener('pointermove', (e) => {
            if (!entity.isDragging) return;
            e.preventDefault();

            const winW = window.innerWidth;
            const winH = window.innerHeight;

            const now = performance.now();
            const dt = Math.max(1, now - entity.lastTime);

            // Compute drag velocity for optional throw/toss
            entity.vx = ((e.clientX - entity.lastX) / dt) * 16;
            entity.vy = ((e.clientY - entity.lastY) / dt) * 16;
            entity.lastX = e.clientX;
            entity.lastY = e.clientY;
            entity.lastTime = now;

            // Follow pointer directly
            entity.x = Math.max(5, Math.min(winW - entity.width - 5, e.clientX - entity.dragOffsetX));
            entity.y = Math.max(45, Math.min(winH - entity.height - 10, e.clientY - entity.dragOffsetY));
            entity.baseY = entity.y; // Update its roaming level!

            if (Math.abs(entity.vx) > 0.5) {
                entity.facing = entity.vx > 0 ? 1 : -1;
            }

            el.style.transform = `translate3d(${entity.x.toFixed(1)}px, ${entity.y.toFixed(1)}px, 0) scale(1.1) scaleX(${entity.facing})`;
        });

        // Pointer Up: Release at the exact user-chosen level
        const onPointerUp = (e) => {
            if (!entity.isDragging) return;
            entity.isDragging = false;
            try {
                el.releasePointerCapture(e.pointerId);
            } catch (err) {}

            el.classList.remove('is-dragged');
            entity.baseY = entity.y; // Stays at this exact level!

            const tossSpeed = Math.hypot(entity.vx, entity.vy);
            if (tossSpeed > 4) {
                entity.mode = 'glide';
                entity.vx = Math.max(-14, Math.min(14, entity.vx));
                entity.vy = Math.max(-14, Math.min(14, entity.vy));
            } else {
                entity.mode = 'roam';
                entity.vx = (Math.random() > 0.5 ? 1 : -1) * (0.8 + Math.random() * 0.8);
                entity.vy = 0;
            }

            setTimeout(() => bubble.classList.remove('visible'), 2000);
        };

        el.addEventListener('pointerup', onPointerUp);
        el.addEventListener('pointercancel', onPointerUp);

        activePokemonEntities.push(entity);
    });

    layer.appendChild(pokeFrag);

    // Start Physics Animation Loop
    if (!pokemonAnimFrameId) {
        let lastTime = performance.now();
        const loop = (now) => {
            const dt = Math.min((now - lastTime) / 16.6, 2);
            lastTime = now;

            const winW = window.innerWidth;
            const winH = window.innerHeight;

            activePokemonEntities.forEach((p) => {
                // If being actively dragged, pointermove directly controls position
                if (p.isDragging) return;

                // Grow scale from initial spawn
                if (p.scale < p.targetScale) {
                    p.scale = Math.min(p.targetScale, p.scale + 0.08 * dt);
                }

                if (p.mode === 'shatter') {
                    p.x += p.vx * dt;
                    p.y += p.vy * dt;
                    p.vy += 0.35 * dt;
                    p.vx *= Math.pow(0.985, dt);
                    p.vy *= Math.pow(0.985, dt);

                    // Bounces off screen boundaries
                    if (p.x <= 10) {
                        p.x = 10;
                        p.vx = -p.vx * 0.75;
                    } else if (p.x >= winW - p.width - 10) {
                        p.x = winW - p.width - 10;
                        p.vx = -p.vx * 0.75;
                    }

                    if (p.y <= 50) {
                        p.y = 50;
                        p.vy = -p.vy * 0.75;
                    } else if (p.y >= winH - p.height - 15) {
                        p.y = winH - p.height - 15;
                        p.vy = -p.vy * 0.65;
                    }

                    // Once shatter velocity calms down, enter roam mode wherever it landed!
                    if (Math.hypot(p.vx, p.vy) < 2.5) {
                        p.mode = 'roam';
                        p.baseY = p.y;
                        p.vx = (Math.random() > 0.5 ? 1 : -1) * (0.8 + Math.random() * 0.8);
                        p.vy = 0;
                    }
                } else if (p.mode === 'glide') {
                    p.x += p.vx * dt;
                    p.y += p.vy * dt;
                    p.vx *= Math.pow(0.92, dt);
                    p.vy *= Math.pow(0.92, dt);

                    if (p.x <= 10) {
                        p.x = 10;
                        p.vx = -p.vx * 0.7;
                    } else if (p.x >= winW - p.width - 10) {
                        p.x = winW - p.width - 10;
                        p.vx = -p.vx * 0.7;
                    }

                    if (p.y <= 50) {
                        p.y = 50;
                        p.vy = -p.vy * 0.7;
                    } else if (p.y >= winH - p.height - 15) {
                        p.y = winH - p.height - 15;
                        p.vy = -p.vy * 0.7;
                    }

                    if (Math.hypot(p.vx, p.vy) < 1.2) {
                        p.mode = 'roam';
                        p.baseY = p.y;
                        p.vx = (Math.random() > 0.5 ? 1 : -1) * (0.8 + Math.random() * 0.8);
                        p.vy = 0;
                    }
                } else if (p.mode === 'roam') {
                    p.roamTimer += dt;
                    p.x += p.vx * dt;

                    // Floating bobbing around its chosen level baseY
                    p.y = p.baseY + Math.sin(p.roamTimer * 0.05) * 4;

                    // Reverse at screen edges
                    if (p.x <= 15) {
                        p.x = 15;
                        p.vx = Math.abs(p.vx) || 1.2;
                    } else if (p.x >= winW - p.width - 15) {
                        p.x = winW - p.width - 15;
                        p.vx = -Math.abs(p.vx) || -1.2;
                    }

                    // Keep baseY within visible bounds
                    if (p.baseY < 55) p.baseY = 55;
                    if (p.baseY > winH - p.height - 15) p.baseY = winH - p.height - 15;
                }

                // Facing direction
                if (Math.abs(p.vx) > 0.15) {
                    p.facing = p.vx > 0 ? 1 : -1;
                }

                const ix = Math.round(p.x);
                const iy = Math.round(p.y);
                if (p.scale < 0.98) {
                    p.el.style.transform = `translate3d(${ix}px, ${iy}px, 0) scale(${p.scale.toFixed(2)}) scaleX(${p.facing})`;
                } else {
                    p.el.style.transform = `translate3d(${ix}px, ${iy}px, 0) scaleX(${p.facing})`;
                }
            });

            if (activePokemonEntities.length > 0) {
                pokemonAnimFrameId = requestAnimationFrame(loop);
            }
        };
        pokemonAnimFrameId = requestAnimationFrame(loop);
    }
};

if (dismissBannerBtn) dismissBannerBtn.addEventListener('click', clearActivePokemons);
if (konamiHint) {
    konamiHint.style.cursor = 'pointer';
    konamiHint.addEventListener('click', triggerGodMode);
}

window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    const expectedKey = konamiCode[konamiIndex].toLowerCase();

    if (key === expectedKey) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            konamiIndex = 0;
            triggerGodMode();
        }
    } else {
        konamiIndex = 0;
    }
});

/* ── 6. Button Hover Micro-Sound Effects ── */
document.querySelectorAll('.btn, .nav-link, .filter-tab').forEach((el) => {
    el.addEventListener('mouseenter', () => {
        if (!arcadeAudio.muted && typeof arcadeAudio.playCoinPickup === 'function') {
            // Very subtle blip
        }
    });
});