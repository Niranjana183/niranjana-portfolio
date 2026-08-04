// Initialize Lucide Icons
lucide.createIcons();

// Lenis Smooth Scroll Configuration
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
});

// Update ScrollTrigger on Lenis Scroll
lenis.on('scroll', ScrollTrigger.update);

// Integrate Lenis with GSAP Ticker
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Custom Cursor & Spotlight Logic
const cursor = document.getElementById('custom-cursor');
const follower = document.getElementById('custom-follower');
const bgSpotlight = document.getElementById('bg-spotlight');

// Ensure custom cursor and follower are attached to body root for top stacking context
if (cursor && cursor.parentElement !== document.body) {
    document.body.appendChild(cursor);
}
if (follower && follower.parentElement !== document.body) {
    document.body.appendChild(follower);
}

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let followerX = mouseX;
let followerY = mouseY;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Position custom dot
    if (cursor) {
        gsap.set(cursor, { x: mouseX, y: mouseY });
    }
    
    // Position background spotlight
    if (bgSpotlight) {
        gsap.to(bgSpotlight, {
            x: mouseX,
            y: mouseY,
            duration: 0.6,
            ease: "power2.out"
        });
    }
});

// Lerped follower cursor
gsap.ticker.add(() => {
    const dt = 1.0 - Math.pow(1.0 - 0.15, gsap.ticker.deltaRatio());
    followerX += (mouseX - followerX) * dt;
    followerY += (mouseY - followerY) * dt;
    gsap.set(follower, { x: followerX, y: followerY });
});

// Cursor hover state changes
function bindCursorHover(elements) {
    elements.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });
}
const interactiveElements = document.querySelectorAll('a, button, input, textarea, .project-grid-card, .magnetic-button, [onclick]');
bindCursorHover(interactiveElements);

// Magnetic Buttons
const magneticButtons = document.querySelectorAll('.magnetic-button');
magneticButtons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
        const bound = btn.getBoundingClientRect();
        const x = e.clientX - bound.left - bound.width / 2;
        const y = e.clientY - bound.top - bound.height / 2;
        
        gsap.to(btn, {
            x: x * 0.35,
            y: y * 0.35,
            duration: 0.3,
            ease: "power2.out"
        });
    });
    
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.3)"
        });
    });
});

// Project Cards mouse spotlight and 3D tilting
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Spotlight gradient position
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
        
        // Tilt calculations
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5; // max tilt 5 degrees
        const rotateY = ((x - centerX) / centerX) * 5;
        
        gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            duration: 0.3,
            ease: "power2.out",
            transformPerspective: 1000
        });
    });
    
    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.6,
            ease: "power2.out"
        });
    });
});

// Header Blur and Border fade on scroll
const header = document.querySelector('header');
ScrollTrigger.create({
    start: 'top -20',
    onEnter: () => header.classList.add('bg-[#050505]/75', 'border-white/10'),
    onLeaveBack: () => header.classList.remove('bg-[#050505]/75', 'border-white/10')
});

// Hero text reveal animation and entrance animations
document.fonts.ready.then(() => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        // Run SplitType
        const split = new SplitType(heroTitle, { types: 'chars' });
        gsap.fromTo(split.chars, 
            {
                opacity: 0,
                y: 80,
                rotate: 4
            },
            {
                opacity: 1,
                y: 0,
                rotate: 0,
                stagger: 0.03,
                duration: 1.2,
                ease: "power4.out",
                delay: 0.2
            }
        );
    }

    // Fade in animations for other hero items
    gsap.from('.hero-title + div, p.text-textSecondary, .hero-title + p + div', {
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out",
        delay: 0.6
    });

    // Fade in right hero column image and card
    gsap.from('.image-container', {
        opacity: 0,
        duration: 1.4,
        ease: "power3.out",
        delay: 0.4
    });

    gsap.from('.floating-widget-entrance', {
        opacity: 0,
        x: 40,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.8
    });
});

// Scroll parallax and slow zoom animation for portrait
gsap.to('.hero-portrait', {
    yPercent: 12, // Slight parallax
    scale: 1.05,  // Slow 105% zoom
    ease: 'none',
    scrollTrigger: {
        trigger: '#home',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    }
});

// ScrollTrigger reveals for sections
gsap.from('#about h2, #about p', {
    opacity: 0,
    y: 40,
    stagger: 0.2,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
        trigger: '#about',
        start: 'top 80%',
        toggleActions: 'play none none none'
    }
});

// --- Premium Tech Orbit Interactive Logic ---
const orbitContainer = document.getElementById('tech-orbit-container');
const orbitWrapper = document.querySelector('.orbit-wrapper');
const pythonSphere = document.querySelector('.python-center-sphere');
const orbitTooltip = document.getElementById('orbit-tooltip');

const techDescriptions = {
    python: { title: "Python", desc: "My primary backend language" },
    django: { title: "Django", desc: "Building scalable web applications" },
    restapi: { title: "REST API", desc: "Secure backend communication & REST APIs" },
    postgresql: { title: "PostgreSQL", desc: "Relational database schema optimization" },
    mysql: { title: "MySQL", desc: "Structured query relational database" },
    mongodb: { title: "MongoDB", desc: "Document-oriented NoSQL database" },
    java: { title: "Java", desc: "Backend object-oriented systems" },
    html5: { title: "HTML5", desc: "Semantic frontend structure" },
    css3: { title: "CSS3", desc: "Modern layouts and responsive styling" },
    javascript: { title: "JavaScript", desc: "Dynamic interactive frontend logic" },
    flutter: { title: "Flutter", desc: "Cross-platform mobile applications" },
    aws: { title: "AWS", desc: "Cloud computing and API deployments" },
    git: { title: "Git", desc: "Distributed version control system" },
    cloudcomputing: { title: "Cloud Computing", desc: "Server systems and hosting architectures" }
};

// Define rings and their items
const innerItems = document.querySelectorAll('.inner-orbit-item');
const middleItems = document.querySelectorAll('.middle-orbit-item');
const outerItems = document.querySelectorAll('.outer-orbit-item');

let rotationAngle = 0;
let isOrbitPaused = false;

// Set initial absolute positions using trig
function positionOrbitItems() {
    // Inner Ring: R = 276px. 4 items
    const rInner = 276;
    innerItems.forEach((item, index) => {
        const startAngle = (index / innerItems.length) * Math.PI * 2;
        item.dataset.startAngle = startAngle;
        item.dataset.radius = rInner;
        item.dataset.direction = "1"; // clockwise
    });

    // Middle Ring: R = 372px. 5 items
    const rMiddle = 372;
    middleItems.forEach((item, index) => {
        const startAngle = (index / middleItems.length) * Math.PI * 2;
        item.dataset.startAngle = startAngle;
        item.dataset.radius = rMiddle;
        item.dataset.direction = "-1"; // counter-clockwise
    });

    // Outer Ring: R = 468px. 4 items
    const rOuter = 468;
    outerItems.forEach((item, index) => {
        const startAngle = (index / outerItems.length) * Math.PI * 2 + Math.PI / 4;
        item.dataset.startAngle = startAngle;
        item.dataset.radius = rOuter;
        item.dataset.direction = "1"; // clockwise
    });
}
positionOrbitItems();

// Update loop for slow orbital rotation
gsap.ticker.add(() => {
    if (isOrbitPaused) return;

    const deltaRatio = gsap.ticker.deltaRatio();
    rotationAngle += 0.003 * deltaRatio;

    const allItems = [...innerItems, ...middleItems, ...outerItems];
    allItems.forEach((item) => {
        const startAngle = parseFloat(item.dataset.startAngle);
        const radius = parseFloat(item.dataset.radius);
        const dir = parseFloat(item.dataset.direction);
        
        // Calculate current angle
        const currentAngle = startAngle + (rotationAngle * dir);
        const x = Math.cos(currentAngle) * radius;
        const y = Math.sin(currentAngle) * radius;

        gsap.set(item, { x: x, y: y, xPercent: -50, yPercent: -50 });
    });
});

// Initial placement before rotation tick starts
const allOrbitItems = [...innerItems, ...middleItems, ...outerItems];
allOrbitItems.forEach((item) => {
    const startAngle = parseFloat(item.dataset.startAngle);
    const radius = parseFloat(item.dataset.radius);
    const x = Math.cos(startAngle) * radius;
    const y = Math.sin(startAngle) * radius;
    gsap.set(item, { x: x, y: y, xPercent: -50, yPercent: -50 });
});

// Center sphere custom hover
pythonSphere.addEventListener('mouseenter', (e) => {
    isOrbitPaused = true;
    showTooltip(e, 'python');
    gsap.to(pythonSphere, {
        scale: 1.05,
        boxShadow: "0 0 50px rgba(232, 177, 124, 0.5)",
        duration: 0.4,
        ease: "power2.out"
    });
});
pythonSphere.addEventListener('mouseleave', () => {
    isOrbitPaused = false;
    hideTooltip();
    gsap.to(pythonSphere, {
        scale: 1,
        boxShadow: "0 0 30px rgba(232, 177, 124, 0.3)",
        duration: 0.6,
        ease: "power2.out"
    });
});

// Card hovers & interactions
allOrbitItems.forEach((card) => {
    const techKey = card.dataset.tech;

    card.addEventListener('mouseenter', (e) => {
        isOrbitPaused = true;
        showTooltip(e, techKey);

        // Hover scale & lift
        gsap.to(card, {
            scale: 1.18,
            zIndex: 40,
            duration: 0.4,
            ease: "power2.out"
        });
    });

    card.addEventListener('mousemove', (e) => {
        // Track tooltip position
        positionTooltipAtMouse(e);

        // Mouse 3D Tilt interaction
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -12; // tilt max 12deg
        const rotateY = ((x - centerX) / centerX) * 12;

        gsap.to(card.querySelector('.tech-card-inner'), {
            rotateX: rotateX,
            rotateY: rotateY,
            transformPerspective: 600,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    card.addEventListener('mouseleave', () => {
        isOrbitPaused = false;
        hideTooltip();

        gsap.to(card, {
            scale: 1,
            zIndex: 10,
            duration: 0.6,
            ease: "power2.out"
        });

        gsap.to(card.querySelector('.tech-card-inner'), {
            rotateX: 0,
            rotateY: 0,
            duration: 0.6,
            ease: "power2.out"
        });
    });
});

// Tooltip Helpers
function showTooltip(e, key) {
    const data = techDescriptions[key];
    if (!data) return;

    orbitTooltip.querySelector('.tooltip-title').textContent = data.title;
    orbitTooltip.querySelector('.tooltip-desc').textContent = data.desc;
    
    gsap.to(orbitTooltip, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
    });
    positionTooltipAtMouse(e);
}

function positionTooltipAtMouse(e) {
    if (!orbitContainer) return;
    const containerRect = orbitContainer.getBoundingClientRect();
    const x = e.clientX - containerRect.left;
    const y = e.clientY - containerRect.top - 65; // position above cursor

    gsap.set(orbitTooltip, {
        left: x,
        top: y,
        xPercent: -50
    });
}

function hideTooltip() {
    gsap.to(orbitTooltip, {
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: "power2.in"
    });
}

// Mouse Parallax on entire Orbit Container
orbitContainer.addEventListener('mousemove', (e) => {
    const rect = orbitContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.06;
    const deltaY = (e.clientY - centerY) * 0.06;

    gsap.to(orbitWrapper, {
        x: deltaX,
        y: deltaY,
        duration: 0.5,
        ease: "power2.out"
    });
});

orbitContainer.addEventListener('mouseleave', () => {
    gsap.to(orbitWrapper, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
    });
});

// Generate Slow Particles
function createOrbitParticles() {
    const particlesContainer = document.getElementById('orbit-particles');
    if (!particlesContainer) return;
    
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute w-1.5 h-1.5 rounded-full bg-[#E8B17C] opacity-0 blur-[1px] pointer-events-none';
        particlesContainer.appendChild(particle);
        
        // Initial random placement
        const w = particlesContainer.clientWidth || 500;
        const h = particlesContainer.clientHeight || 500;
        
        gsap.set(particle, {
            x: Math.random() * w,
            y: Math.random() * h,
            scale: Math.random() * 0.8 + 0.4
        });
        
        animateParticle(particle, w, h);
    }
}

function animateParticle(particle, w, h) {
    const duration = Math.random() * 20 + 15;
    
    gsap.to(particle, {
        x: Math.random() * w,
        y: Math.random() * h,
        opacity: Math.random() * 0.6 + 0.1,
        duration: duration / 2,
        yoyo: true,
        repeat: 1,
        ease: "sine.inOut",
        onComplete: () => animateParticle(particle, w, h)
    });
}

// Initialize particles once document is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createOrbitParticles);
} else {
    createOrbitParticles();
}

// ScrollTrigger for Skills section reveal
gsap.from('#skills .tech-editorial-title, #skills p', {
    opacity: 0,
    y: 40,
    stagger: 0.15,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: {
        trigger: '#skills',
        start: 'top 80%',
        toggleActions: 'play none none none'
    }
});

gsap.from('#skills .orbit-wrapper', {
    opacity: 0,
    scale: 0.8,
    duration: 1.4,
    ease: "power4.out",
    scrollTrigger: {
        trigger: '#skills',
        start: 'top 75%',
        toggleActions: 'play none none none'
    }
});

gsap.from('#skills .glass-card', {
    opacity: 0,
    x: 30,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: {
        trigger: '#skills',
        start: 'top 80%',
        toggleActions: 'play none none none'
    }
});

// Sequenced project cards reveal
gsap.from('.project-grid-card', {
    opacity: 0,
    y: 50,
    stagger: 0.1,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
        trigger: '#projects',
        start: 'top 75%',
        toggleActions: 'play none none none'
    }
});

// Contact items reveal
gsap.from('#contact h2, #contact p, #contact form', {
    opacity: 0,
    y: 40,
    stagger: 0.15,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
        trigger: '#contact',
        start: 'top 80%',
        toggleActions: 'play none none none'
    }
});

// --- Mediswift Case Study Modal Logic ---
function openMediswiftLightbox() {
    const lightbox = document.getElementById('mediswift-lightbox');
    if (!lightbox) return;
    
    document.body.classList.add('modal-open', 'lightbox-open');
    document.body.style.overflow = 'hidden';

    // Stop Lenis scroll so modal scrolls smoothly inside container
    if (typeof lenis !== 'undefined' && lenis) {
        lenis.stop();
    }
    
    lightbox.classList.remove('hidden');
    lightbox.scrollTop = 0;
    
    setTimeout(() => {
        lightbox.classList.remove('opacity-0');
        lightbox.classList.add('opacity-100');
    }, 10);
    
    if (window.lucide) {
        window.lucide.createIcons();
    }
    
    // Bind hover for modal controls
    const modalButtons = lightbox.querySelectorAll('button, a, [onclick]');
    bindCursorHover(modalButtons);
    
    document.addEventListener('keydown', handleLightboxKeydown);
}

function closeMediswiftLightbox() {
    const lightbox = document.getElementById('mediswift-lightbox');
    if (!lightbox) return;
    
    lightbox.classList.remove('opacity-100');
    lightbox.classList.add('opacity-0');
    
    setTimeout(() => {
        lightbox.classList.add('hidden');
        document.body.style.overflow = '';
        document.body.classList.remove('modal-open', 'lightbox-open');
        document.body.classList.remove('cursor-hover');
        
        // Resume Lenis scroll when modal is closed
        if (typeof lenis !== 'undefined' && lenis) {
            lenis.start();
        }
    }, 300);
    
    document.removeEventListener('keydown', handleLightboxKeydown);
}

// --- AutoResQ Case Study Modal Logic ---
function openAutoresqLightbox() {
    const lightbox = document.getElementById('autoresq-lightbox');
    if (!lightbox) return;
    
    document.body.classList.add('modal-open', 'lightbox-open');
    document.body.style.overflow = 'hidden';

    // Stop Lenis scroll so modal scrolls smoothly inside container
    if (typeof lenis !== 'undefined' && lenis) {
        lenis.stop();
    }
    
    lightbox.classList.remove('hidden');
    lightbox.scrollTop = 0;
    
    setTimeout(() => {
        lightbox.classList.remove('opacity-0');
        lightbox.classList.add('opacity-100');
    }, 10);
    
    if (window.lucide) {
        window.lucide.createIcons();
    }
    
    // Bind hover for modal controls
    const modalButtons = lightbox.querySelectorAll('button, a, [onclick]');
    bindCursorHover(modalButtons);
    
    document.addEventListener('keydown', handleLightboxKeydown);
}

function closeAutoresqLightbox() {
    const lightbox = document.getElementById('autoresq-lightbox');
    if (!lightbox) return;
    
    lightbox.classList.remove('opacity-100');
    lightbox.classList.add('opacity-0');
    
    setTimeout(() => {
        lightbox.classList.add('hidden');
        document.body.style.overflow = '';
        document.body.classList.remove('modal-open', 'lightbox-open');
        document.body.classList.remove('cursor-hover');
        
        // Resume Lenis scroll when modal is closed
        if (typeof lenis !== 'undefined' && lenis) {
            lenis.start();
        }
    }, 300);
    
    document.removeEventListener('keydown', handleLightboxKeydown);
}

// --- College Admission Case Study Modal Logic ---
function openCollegeLightbox() {
    const lightbox = document.getElementById('college-admission-lightbox');
    if (!lightbox) return;
    
    document.body.classList.add('modal-open', 'lightbox-open');
    document.body.style.overflow = 'hidden';

    // Stop Lenis scroll so modal scrolls smoothly inside container
    if (typeof lenis !== 'undefined' && lenis) {
        lenis.stop();
    }
    
    lightbox.classList.remove('hidden');
    lightbox.scrollTop = 0;
    
    setTimeout(() => {
        lightbox.classList.remove('opacity-0');
        lightbox.classList.add('opacity-100');
    }, 10);
    
    if (window.lucide) {
        window.lucide.createIcons();
    }
    
    // Bind hover for modal controls
    const modalButtons = lightbox.querySelectorAll('button, a, [onclick]');
    bindCursorHover(modalButtons);
    
    document.addEventListener('keydown', handleLightboxKeydown);
}

function closeCollegeLightbox() {
    const lightbox = document.getElementById('college-admission-lightbox');
    if (!lightbox) return;
    
    lightbox.classList.remove('opacity-100');
    lightbox.classList.add('opacity-0');
    
    setTimeout(() => {
        lightbox.classList.add('hidden');
        document.body.style.overflow = '';
        document.body.classList.remove('modal-open', 'lightbox-open');
        document.body.classList.remove('cursor-hover');
        
        // Resume Lenis scroll when modal is closed
        if (typeof lenis !== 'undefined' && lenis) {
            lenis.start();
        }
    }, 300);
    
    document.removeEventListener('keydown', handleLightboxKeydown);
}

// --- GBM-Engine Case Study Modal Logic ---
function openGbmLightbox() {
    const lightbox = document.getElementById('gbm-lightbox');
    if (!lightbox) return;
    
    document.body.classList.add('modal-open', 'lightbox-open');
    document.body.style.overflow = 'hidden';

    // Stop Lenis scroll so modal scrolls smoothly inside container
    if (typeof lenis !== 'undefined' && lenis) {
        lenis.stop();
    }
    
    lightbox.classList.remove('hidden');
    lightbox.scrollTop = 0;
    
    setTimeout(() => {
        lightbox.classList.remove('opacity-0');
        lightbox.classList.add('opacity-100');
    }, 10);
    
    if (window.lucide) {
        window.lucide.createIcons();
    }
    
    // Bind hover for modal controls
    const modalButtons = lightbox.querySelectorAll('button, a, [onclick]');
    bindCursorHover(modalButtons);
    
    document.addEventListener('keydown', handleLightboxKeydown);
}

function closeGbmLightbox() {
    const lightbox = document.getElementById('gbm-lightbox');
    if (!lightbox) return;
    
    lightbox.classList.remove('opacity-100');
    lightbox.classList.add('opacity-0');
    
    setTimeout(() => {
        lightbox.classList.add('hidden');
        document.body.style.overflow = '';
        document.body.classList.remove('modal-open', 'lightbox-open');
        document.body.classList.remove('cursor-hover');
        
        // Resume Lenis scroll when modal is closed
        if (typeof lenis !== 'undefined' && lenis) {
            lenis.start();
        }
    }, 300);
    
    document.removeEventListener('keydown', handleLightboxKeydown);
}

function handleLightboxKeydown(e) {
    if (e.key === 'Escape') {
        closeMediswiftLightbox();
        closeAutoresqLightbox();
        closeCollegeLightbox();
        closeGbmLightbox();
    }
}

// --- EmailJS Contact Form Integration ---
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    if (typeof emailjs !== 'undefined') {
        emailjs.init({
            publicKey: "SbEO49Ap1D2r500vF",
        });
    }

    const submitBtn = document.getElementById('submit-btn');
    const submitText = document.getElementById('submit-text');
    const submitIcon = document.getElementById('submit-icon');
    const submitLoader = document.getElementById('submit-loader');

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function resetErrors() {
        [nameInput, emailInput, messageInput].forEach(input => {
            input.classList.remove('border-red-500', 'border-opacity-100');
        });
        [nameError, emailError, messageError].forEach(error => {
            error.classList.add('hidden');
        });
    }

    function showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `transform translate-y-10 opacity-0 transition-all duration-300 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 ${
            type === 'success' 
                ? 'bg-[#111111]/90 border border-green-500/30 text-white' 
                : 'bg-[#111111]/90 border border-red-500/30 text-white'
        } backdrop-blur-md`;
        
        toast.innerHTML = `
            ${type === 'success' 
                ? '<div class="p-2 bg-green-500/20 rounded-full"><i data-lucide="check" class="w-4 h-4 text-green-400"></i></div>'
                : '<div class="p-2 bg-red-500/20 rounded-full"><i data-lucide="x" class="w-4 h-4 text-red-400"></i></div>'
            }
            <div>
                <p class="text-sm font-semibold tracking-wide ${type === 'success' ? 'text-green-400' : 'text-red-400'}">${type === 'success' ? 'Message sent successfully!' : 'Failed to send message.'}</p>
                <p class="text-xs text-textSecondary font-medium mt-0.5">${message}</p>
            </div>
        `;

        toastContainer.appendChild(toast);
        if (window.lucide) {
            window.lucide.createIcons();
        }

        // Animate in
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                toast.classList.remove('translate-y-10', 'opacity-0');
            });
        });

        // Remove after 5 seconds
        setTimeout(() => {
            toast.classList.add('translate-y-10', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        resetErrors();

        let isValid = true;

        if (!nameInput.value.trim()) {
            nameInput.classList.add('border-red-500', 'border-opacity-100');
            nameError.classList.remove('hidden');
            isValid = false;
        }

        if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
            emailInput.classList.add('border-red-500', 'border-opacity-100');
            emailError.classList.remove('hidden');
            isValid = false;
        }

        if (!messageInput.value.trim()) {
            messageInput.classList.add('border-red-500', 'border-opacity-100');
            messageError.classList.remove('hidden');
            isValid = false;
        }

        if (!isValid) return;

        if (typeof emailjs === 'undefined') {
            showToast("Email service is currently unavailable.", "error");
            return;
        }

        // Loading state
        submitBtn.disabled = true;
        submitText.textContent = 'Sending...';
        submitIcon.classList.add('hidden');
        submitLoader.classList.remove('hidden');

        emailjs.sendForm('service_5phjx2n', 'template_bovkcxq', this)
            .then(() => {
                showToast("I'll get back to you soon.", "success");
                contactForm.reset();
            })
            .catch((error) => {
                console.error('EmailJS Error:', error);
                showToast("Please try again later.", "error");
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitText.textContent = 'Send Message';
                submitIcon.classList.remove('hidden');
                submitLoader.classList.add('hidden');
            });
    });
});
