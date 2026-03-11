/* ============================================================
   ISO 9001 — Presentation Site · main.js
   ============================================================ */

// ── NAV: mobile toggle ────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks  = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close menu when a nav link is clicked (mobile)
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── NAV: active link on scroll ────────────────────────────────
const sections = document.querySelectorAll('section[id], header[id]');
const allNavLinks = document.querySelectorAll('.nav-links a');

function setActiveLink() {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.id;
  });
  allNavLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', setActiveLink, { passive: true });
setActiveLink();

// ── SCROLL ANIMATIONS ─────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;

      // Staggered delay for grid children
      if (el.dataset.index) {
        const delay = (parseInt(el.dataset.index, 10) - 1) * 80;
        setTimeout(() => el.classList.add('visible'), delay);
      } else {
        el.classList.add('visible');
      }

      observer.unobserve(el);
    }
  });
}, { threshold: 0.12 });

// Observe principle cards
document.querySelectorAll('.principle-card').forEach(el => observer.observe(el));

// Observe timeline items
document.querySelectorAll('.tl-item').forEach((el, i) => {
  el.style.transitionDelay = `${i * 80}ms`;
  observer.observe(el);
});

// Observe step cards
document.querySelectorAll('.step-card').forEach((el, i) => {
  el.style.transitionDelay = `${i * 100}ms`;
  observer.observe(el);
});

// Generic fade-hidden elements
document.querySelectorAll('.fade-hidden').forEach(el => observer.observe(el));

// ── PDCA: animated highlight on hover ────────────────────────
const pdcaSteps = document.querySelectorAll('.pdca-step');
pdcaSteps.forEach(step => {
  step.addEventListener('mouseenter', () => {
    pdcaSteps.forEach(s => {
      if (s !== step) s.style.opacity = '0.45';
    });
  });
  step.addEventListener('mouseleave', () => {
    pdcaSteps.forEach(s => s.style.opacity = '');
  });
});

// ── PDCA: auto-cycle highlight ────────────────────────────────
const pdcaIds = ['pdca-p', 'pdca-d', 'pdca-c', 'pdca-a'];
let pdcaIndex = 0;

function cyclePdca() {
  pdcaIds.forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (i === pdcaIndex) {
      el.style.boxShadow = '0 0 0 3px rgba(46,124,246,0.5)';
      el.style.transform = 'scale(1.07)';
    } else {
      el.style.boxShadow = '';
      el.style.transform = '';
    }
  });
  pdcaIndex = (pdcaIndex + 1) % pdcaIds.length;
}

// Only auto-cycle when section is visible
const pdcaSection = document.getElementById('pdca');
let pdcaTimer = null;
const pdcaObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    if (!pdcaTimer) pdcaTimer = setInterval(cyclePdca, 900);
  } else {
    clearInterval(pdcaTimer);
    pdcaTimer = null;
    pdcaIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.style.boxShadow = ''; el.style.transform = ''; }
    });
  }
}, { threshold: 0.4 });
if (pdcaSection) pdcaObserver.observe(pdcaSection);

// Stop auto-cycle on user hover
document.querySelector('.pdca-ring')?.addEventListener('mouseenter', () => {
  clearInterval(pdcaTimer);
  pdcaTimer = null;
  pdcaIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.style.boxShadow = ''; el.style.transform = ''; }
  });
});

// ── LIGHTBOX ──────────────────────────────────────────────────
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.thumb-expand').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const src = btn.dataset.lightbox;
    lightboxImg.src = src;
    lightboxImg.alt = btn.closest('.media-thumb')?.querySelector('img')?.alt || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { lightboxImg.src = ''; }, 300);
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// ── HERO: parallax on mouse ───────────────────────────────────
const heroBadge = document.querySelector('.hero-badge');
if (heroBadge) {
  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    heroBadge.style.transform =
      `translateY(-50%) rotate(${dx * 8}deg) translateX(${dx * 12}px)`;
  });
}

// ── SCROLL-TO-TOP on logo click ───────────────────────────────
document.querySelector('.nav-logo')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
