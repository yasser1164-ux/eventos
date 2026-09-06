// ---------- Nav: scroll state, mobile toggle, active link ----------
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const scrollProgress = document.getElementById('scrollProgress');
const toTop = document.getElementById('toTop');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', open);
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

const sections = document.querySelectorAll('main .section, .hero');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 20);

  const docH = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.style.width = docH > 0 ? `${(y / docH) * 100}%` : '0%';

  toTop.classList.toggle('visible', y > 600);

  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 140;
    if (y >= top) current = sec.id;
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---------- Scroll reveal ----------
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// stagger reveal within the same container slightly
document.querySelectorAll('.expertise-grid, .project-grid, .credentials-grid, .about-cards').forEach(group => {
  [...group.children].forEach((child, i) => {
    child.style.transitionDelay = `${i * 70}ms`;
  });
});

// ---------- Animated counters ----------
const counters = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.count, 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.6 });
counters.forEach(el => counterObserver.observe(el));

// ---------- Animated proficiency bars ----------
const bars = document.querySelectorAll('.bar-fill');
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.style.width = `${el.dataset.level}%`;
    barObserver.unobserve(el);
  });
}, { threshold: 0.4 });
bars.forEach(el => barObserver.observe(el));

// ---------- Hero phrase rotator (crossfade, not a typewriter) ----------
const rotatorWord = document.querySelector('.rotator-word');
const phrases = [
  'a $20B project portfolio',
  'capital project delivery',
  'technical assurance at scale',
  'engineering trust'
];
let phraseIdx = 0;
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (rotatorWord && !prefersReduced) {
  setInterval(() => {
    rotatorWord.classList.add('fade');
    setTimeout(() => {
      phraseIdx = (phraseIdx + 1) % phrases.length;
      rotatorWord.textContent = phrases[phraseIdx];
      rotatorWord.classList.remove('fade');
    }, 400);
  }, 2600);
}

// ---------- Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();
