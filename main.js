/* ============================================================
   ISO 9001 — main.js
   ============================================================ */

// ── NAV ───────────────────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks  = document.querySelector('.nav-links');
const navbar    = document.getElementById('navbar');

navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(l => l.addEventListener('click', () => navLinks.classList.remove('open')));

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// Active nav link
const sections = document.querySelectorAll('section[id]');
const allLinks  = document.querySelectorAll('.nav-links a');
function setActive() {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 90) cur = s.id; });
  allLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${cur}`));
}
window.addEventListener('scroll', setActive, { passive: true });
setActive();

document.querySelector('.nav-logo')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── SCROLL ANIMATIONS ────────────────────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const delay = el.dataset.index ? (parseInt(el.dataset.index) - 1) * 80 : 0;
    setTimeout(() => el.classList.add('visible'), delay);
    observer.unobserve(el);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.principle-card').forEach(el => observer.observe(el));
document.querySelectorAll('.tl-item').forEach((el, i) => { el.style.transitionDelay = `${i * 75}ms`; observer.observe(el); });
document.querySelectorAll('.step-card').forEach((el, i) => { el.style.transitionDelay = `${i * 100}ms`; observer.observe(el); });
document.querySelectorAll('.fade-hidden').forEach(el => observer.observe(el));

// ── PDCA ANIMATION ────────────────────────────────────────────
const pdcaIds    = ['pdca-p', 'pdca-d', 'pdca-c', 'pdca-a'];
const pdcaColors = ['rgba(29,78,216,0.35)', 'rgba(22,163,74,0.35)', 'rgba(234,88,12,0.35)', 'rgba(147,51,234,0.35)'];
let pdcaIdx = 0, pdcaTimer = null;

function cyclePdca() {
  pdcaIds.forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (i === pdcaIdx) {
      el.style.boxShadow = `0 0 0 4px ${pdcaColors[i]}`;
      el.style.transform = 'scale(1.08)';
    } else {
      el.style.boxShadow = '';
      el.style.transform = '';
    }
  });
  pdcaIdx = (pdcaIdx + 1) % 4;
}

const pdcaObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    if (!pdcaTimer) pdcaTimer = setInterval(cyclePdca, 900);
  } else {
    clearInterval(pdcaTimer); pdcaTimer = null;
    pdcaIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.style.boxShadow = ''; el.style.transform = ''; }
    });
  }
}, { threshold: 0.4 });

const pdcaSection = document.getElementById('pdca');
if (pdcaSection) pdcaObs.observe(pdcaSection);

document.querySelector('.pdca-ring')?.addEventListener('mouseenter', () => {
  clearInterval(pdcaTimer); pdcaTimer = null;
  pdcaIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.style.boxShadow = ''; el.style.transform = ''; }
  });
});

document.querySelectorAll('.pdca-step').forEach(step => {
  step.addEventListener('mouseenter', () => {
    document.querySelectorAll('.pdca-step').forEach(s => { if (s !== step) s.style.opacity = '0.4'; });
  });
  step.addEventListener('mouseleave', () => {
    document.querySelectorAll('.pdca-step').forEach(s => s.style.opacity = '');
  });
});

// ── SLIDES CAROUSEL ───────────────────────────────────────────
const SLIDE_CAPTIONS = [
  'ISO 9001:2015 – O Motor Estratégico de Alta Performance',
  'Uma Mudança de Paradigma: Da Burocracia ao ROI',
  'Matriz de Evolução: Como a Norma se Modernizou',
  'O Ecossistema da Qualidade: Os 7 Princípios Fundamentais',
  'A Arquitetura da Qualidade: Estrutura de Alto Nível (Anexo SL)',
  'O Novo Modelo Mental: O Motor PDCA em Ação',
  'Alinhamento Estratégico: Contexto e Partes Interessadas (Cláusula 4)',
  'O Centro de Gravidade: Liderança e Comprometimento (Cláusula 5)',
  'A Balança da Mentalidade de Risco (Cláusula 6)',
  'O Sistema Nervoso Operacional: Apoio e Comunicação (Cláusulas 7 e 7.4)',
  'Operação: O Coração do Motor (Cláusula 8)',
  'Calibração Contínua: Avaliação e Melhoria (Cláusulas 9 e 10)',
  'A Síntese do Sistema de Alta Performance',
  'O Roadmap de Implementação rumo à Certificação',
  'O ROI da Excelência Operacional',
];

const slideImgs    = document.querySelectorAll('.slide-img');
const dotsContainer = document.getElementById('slideDots');
const thumbsContainer = document.getElementById('slideThumbs');
const captionText  = document.getElementById('slideCaptionText');
const counterEl    = document.getElementById('slideCounter');
const TOTAL        = slideImgs.length;
let current        = 0;
let autoTimer      = null;

// Build dots
for (let i = 0; i < TOTAL; i++) {
  const dot = document.createElement('button');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', `Slide ${i + 1}`);
  dot.addEventListener('click', () => goTo(i));
  dotsContainer.appendChild(dot);
}

// Build thumbnails
for (let i = 0; i < TOTAL; i++) {
  const thumb = document.createElement('div');
  thumb.className = 'thumb' + (i === 0 ? ' active' : '');
  const img = document.createElement('img');
  img.src = `slides/slide-${String(i + 1).padStart(2, '0')}.png`;
  img.alt = SLIDE_CAPTIONS[i];
  img.loading = 'lazy';
  thumb.appendChild(img);
  thumb.addEventListener('click', () => goTo(i));
  thumbsContainer.appendChild(thumb);
}

function goTo(idx) {
  slideImgs[current].classList.remove('active');
  dotsContainer.children[current].classList.remove('active');
  thumbsContainer.children[current].classList.remove('active');

  current = (idx + TOTAL) % TOTAL;

  slideImgs[current].classList.add('active');
  dotsContainer.children[current].classList.add('active');
  const activeThumb = thumbsContainer.children[current];
  activeThumb.classList.add('active');
  activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

  captionText.textContent = SLIDE_CAPTIONS[current];
  counterEl.textContent   = `${current + 1} / ${TOTAL}`;
}

document.getElementById('slidePrev').addEventListener('click', () => { resetAuto(); goTo(current - 1); });
document.getElementById('slideNext').addEventListener('click', () => { resetAuto(); goTo(current + 1); });

// Keyboard
document.addEventListener('keydown', e => {
  const inSlides = document.getElementById('slides')?.getBoundingClientRect();
  if (inSlides && inSlides.top < window.innerHeight && inSlides.bottom > 0) {
    if (e.key === 'ArrowLeft')  { resetAuto(); goTo(current - 1); }
    if (e.key === 'ArrowRight') { resetAuto(); goTo(current + 1); }
  }
});

// Touch swipe
let touchStartX = 0;
const viewport = document.getElementById('slideViewport');
viewport?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
viewport?.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) { resetAuto(); goTo(current + (diff > 0 ? 1 : -1)); }
});

// Auto-advance
function startAuto() { autoTimer = setInterval(() => goTo(current + 1), 5000); }
function resetAuto()  { clearInterval(autoTimer); startAuto(); }

// Only auto-play when section visible
const slidesObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) startAuto();
  else { clearInterval(autoTimer); autoTimer = null; }
}, { threshold: 0.3 });

const slidesSection = document.getElementById('slides');
if (slidesSection) slidesObs.observe(slidesSection);

// Fullscreen
document.getElementById('slideFullscreen')?.addEventListener('click', () => {
  const el = document.getElementById('slideViewport');
  if (!document.fullscreenElement) {
    el.requestFullscreen?.() || el.webkitRequestFullscreen?.();
  } else {
    document.exitFullscreen?.() || document.webkitExitFullscreen?.();
  }
});

// ── LIGHTBOX ──────────────────────────────────────────────────
const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');

document.querySelectorAll('.thumb-expand').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    lightboxImg.src = btn.dataset.lightbox;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { lightboxImg.src = ''; }, 300);
}

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
