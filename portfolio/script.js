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
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
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

// ---------- Typewriter ----------
const typewriter = document.getElementById('typewriter');
const phrases = [
  'capital projects.',
  'offshore facilities.',
  'project delivery.',
  'engineering trust.'
];
let phraseIdx = 0, charIdx = 0, deleting = false;

function typeLoop() {
  const current = phrases[phraseIdx];
  if (!deleting) {
    charIdx++;
    typewriter.textContent = current.slice(0, charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1500);
      return;
    }
  } else {
    charIdx--;
    typewriter.textContent = current.slice(0, charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
  }
  setTimeout(typeLoop, deleting ? 35 : 65);
}
typeLoop();

// ---------- Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Hero canvas: blueprint node network ----------
(function heroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  const hero = canvas.closest('.hero');
  let w, h, nodes;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    w = canvas.width = hero.offsetWidth;
    h = canvas.height = hero.offsetHeight;
    const count = Math.min(60, Math.floor((w * h) / 22000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 0.8
    }));
  }

  function step() {
    ctx.clearRect(0, 0, w, h);
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.strokeStyle = `rgba(77, 214, 196, ${0.14 * (1 - dist / 140)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    nodes.forEach(n => {
      ctx.fillStyle = 'rgba(255, 181, 71, 0.55)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    });

    if (!prefersReduced) requestAnimationFrame(step);
  }

  resize();
  window.addEventListener('resize', resize);
  step();
})();
