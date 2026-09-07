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
  'a $5B project portfolio',
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

// ---------- Portrait ----------
// Until img/yasir.jpg is added, fall back to the monogram instead of a broken image.
const portraitImg = document.getElementById('portraitImg');
if (portraitImg) {
  const frame = document.getElementById('portraitFrame');
  const markMissing = () => frame.classList.add('no-photo');
  portraitImg.addEventListener('error', markMissing);
  if (portraitImg.complete && portraitImg.naturalWidth === 0) markMissing();
}

// ---------- Drawing sheets ----------
// Hovering a labelled block in a schematic explains that part of the mechanism
// and highlights the lines it connects to.
document.querySelectorAll('.dwg-figure').forEach(fig => {
  const readout = fig.querySelector('.dwg-readout');
  if (!readout) return;
  const svg = fig.querySelector('svg');
  const base = readout.dataset.base || readout.textContent;

  fig.querySelectorAll('[data-detail]').forEach(node => {
    const show = () => {
      readout.textContent = node.dataset.detail;
      if (node.dataset.focus) svg.setAttribute('data-focus', node.dataset.focus);
    };
    const reset = () => {
      readout.textContent = base;
      svg.removeAttribute('data-focus');
    };
    node.addEventListener('mouseenter', show);
    node.addEventListener('mouseleave', reset);
  });
});

// DWG-02 — reveal the review markups, and pair each delta with its comment
const mkToggle = document.getElementById('mkToggle');
if (mkToggle) {
  const fig = document.getElementById('fig-pid');
  const list = document.getElementById('mkList');

  mkToggle.addEventListener('click', () => {
    const on = fig.classList.toggle('show-markup');
    mkToggle.setAttribute('aria-pressed', on);
    mkToggle.textContent = on ? 'Hide review markups' : 'Show review markups';
    list.hidden = !on;
    if (!on) {
      fig.querySelectorAll('.mk-delta').forEach(d => d.classList.remove('is-active'));
      list.querySelectorAll('li').forEach(li => li.classList.remove('is-active'));
    }
  });

  const pair = (id, on) => {
    const delta = fig.querySelector(`.mk-delta[data-mk="${id}"]`);
    const item = list.querySelector(`li[data-mk="${id}"]`);
    if (delta) delta.classList.toggle('is-active', on);
    if (item) item.classList.toggle('is-active', on);
  };
  fig.querySelectorAll('.mk-delta').forEach(delta => {
    delta.addEventListener('mouseenter', () => pair(delta.dataset.mk, true));
    delta.addEventListener('mouseleave', () => pair(delta.dataset.mk, false));
  });
  list.querySelectorAll('li').forEach(item => {
    item.addEventListener('mouseenter', () => pair(item.dataset.mk, true));
    item.addEventListener('mouseleave', () => pair(item.dataset.mk, false));
  });
}

// DWG-04 — pressurise the discharge manifold
const testBtn = document.getElementById('testBtn');
if (testBtn) {
  const fig = document.getElementById('fig-pump');
  const readout = fig.querySelector('.dwg-readout');
  let timer;

  testBtn.addEventListener('click', () => {
    const on = fig.classList.toggle('is-testing');
    testBtn.classList.toggle('is-on', on);
    testBtn.textContent = on ? 'Reset' : 'Run hydrotest';
    clearTimeout(timer);

    if (on) {
      readout.textContent = 'Pressurising discharge manifold to 1.5 × design…';
      timer = setTimeout(() => {
        readout.textContent = 'Pressure held — PASS on the 1st attempt. No leaks at the manifold joints.';
      }, 1900);
    } else {
      readout.textContent = readout.dataset.base;
    }
  });
}

// ---------- Theme toggle ----------
// No stored choice means the page follows the visitor's system preference,
// which the CSS handles on its own. Clicking sets an explicit override.
const themeToggle = document.getElementById('themeToggle');
const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

function effectiveTheme() {
  const set = document.documentElement.getAttribute('data-theme');
  if (set === 'light' || set === 'dark') return set;
  return darkQuery.matches ? 'dark' : 'light';
}

themeToggle.addEventListener('click', () => {
  const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem('theme', next); } catch (e) {}
});

// ---------- Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();
