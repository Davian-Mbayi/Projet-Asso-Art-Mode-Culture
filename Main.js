/* ═══════════════════════════════════════════════════════
   ART MODE & CULTURE — MAIN.JS
   Version 2.0 — Logo 3D tilt + Liquid interactions
═══════════════════════════════════════════════════════ */

/* ════════════════════════════════════
   NAVIGATION
════════════════════════════════════ */
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');

  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const navEl = document.getElementById('nav-' + page);
  if (navEl) navEl.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
  observeReveal();
}

/* ════════════════════════════════════
   MOBILE MENU
════════════════════════════════════ */
function openMobile() {
  document.getElementById('mobileMenu').classList.add('open');
}
function closeMobile() {
  document.getElementById('mobileMenu').classList.remove('open');
}

/* ════════════════════════════════════
   SCROLL — NAV STYLE
════════════════════════════════════ */
window.addEventListener('scroll', () => {
  document.getElementById('mainNav').classList.toggle('scrolled', window.scrollY > 60);
});

/* ════════════════════════════════════
   LOGO 3D — TILT + MIRROR EFFECT
════════════════════════════════════ */
function initLogo3D() {
  const wrapper = document.querySelector('.hero-logo-3d-wrapper');
  if (!wrapper) return;

  // Créer le reflet miroir dynamiquement
  const logoImg = wrapper.querySelector('img');
  if (logoImg && !wrapper.querySelector('.hero-logo-mirror')) {
    const mirror = document.createElement('img');
    mirror.src = logoImg.src;
    mirror.alt = '';
    mirror.className = 'hero-logo-mirror';
    wrapper.appendChild(mirror);
  }

  let animFrame;
  let currentX = 0, currentY = 0;
  let targetX = 0, targetY = 0;

  wrapper.addEventListener('mousemove', (e) => {
    const rect = wrapper.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);

    // Amplifier légèrement pour un effet prononcé mais pas excessif
    targetX = dy * -18;  // tilt vertical
    targetY = dx * 18;   // tilt horizontal
  });

  wrapper.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
  });

  // Smooth interpolation
  function animate() {
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;

    const scale = 1 + Math.abs(currentX + currentY) * 0.001;
    wrapper.style.transform = `
      perspective(400px)
      rotateX(${currentX}deg)
      rotateY(${currentY}deg)
      scale3d(${scale}, ${scale}, ${scale})
    `;

    animFrame = requestAnimationFrame(animate);
  }
  animate();

  // Click pulse effect
  wrapper.addEventListener('click', () => {
    wrapper.style.transition = 'transform 0.15s ease';
    wrapper.style.transform = 'perspective(400px) scale3d(0.92, 0.92, 0.92)';
    setTimeout(() => {
      wrapper.style.transition = '';
    }, 150);
  });
}

/* ════════════════════════════════════
   LIQUID GLASS — Parallax orbs
════════════════════════════════════ */
function initLiquidBg() {
  const orbs = document.querySelectorAll('.liquid-orb');
  if (!orbs.length) return;

  document.addEventListener('mousemove', (e) => {
    const mx = (e.clientX / window.innerWidth - 0.5) * 2;
    const my = (e.clientY / window.innerHeight - 0.5) * 2;

    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 8;
      const ox = mx * factor;
      const oy = my * factor;
      orb.style.transform = `translate(${ox}px, ${oy}px)`;
    });
  });
}

/* ════════════════════════════════════
   REVEAL ON SCROLL
════════════════════════════════════ */
function observeReveal() {
  setTimeout(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    els.forEach(el => {
      if (!el.classList.contains('visible')) io.observe(el);
    });
  }, 50);
}

/* ════════════════════════════════════
   COUNTERS ANIMATION
════════════════════════════════════ */
function startCounters() {
  document.querySelectorAll('.counter').forEach(el => {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const step = Math.max(1, Math.floor(target / 60));
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current >= 1000
        ? (current / 1000).toFixed(1) + 'k+'
        : current + '+';
      if (current >= target) clearInterval(interval);
    }, 30);
  });
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      startCounters();
      counterObs.disconnect();
    }
  });
}, { threshold: 0.3 });

/* ════════════════════════════════════
   EVENTS FILTER
════════════════════════════════════ */
function filterEvents(year, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#eventsGrid .event-card').forEach(card => {
    card.style.display =
      (year === 'tous' || card.dataset.year.includes(year)) ? 'block' : 'none';
  });
}

/* ════════════════════════════════════
   DON — Sélection montant
════════════════════════════════════ */
let selectedMontant = 50;

function selectMontant(btn, val) {
  document.querySelectorAll('.montant-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedMontant = val;
  const donBtn = document.getElementById('donBtn');
  if (donBtn) donBtn.textContent = 'Faire un don de ' + val + ' €';
}

/* ════════════════════════════════════
   LIGHTBOX
════════════════════════════════════ */
function openLightbox(el) {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  // Clear existing content then add close button + image
  lightbox.innerHTML = '';

  const closeBtn = document.createElement('button');
  closeBtn.style.cssText = 'position:absolute; top:24px; right:32px; color:var(--gold); background:none; border:none; font-size:2rem; cursor:pointer; z-index:1001;';
  closeBtn.setAttribute('aria-label', 'Fermer');
  closeBtn.innerHTML = '&times;';
  closeBtn.onclick = function(e) { e.stopPropagation(); closeLightbox(); };

  const img = document.createElement('img');
  img.className = 'lightbox-img';
  // Try to find an <img> inside the clicked element, or use element if it's an img
  const source = el && (el.tagName === 'IMG' ? el : el.querySelector && el.querySelector('img'));
  if (source && source.src) img.src = source.src;
  else if (el && el.dataset && el.dataset.src) img.src = el.dataset.src;
  img.alt = (source && source.alt) ? source.alt : '';
  img.onclick = function(e) { e.stopPropagation(); };

  lightbox.appendChild(closeBtn);
  lightbox.appendChild(img);
  lightbox.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').style.display = 'none';
  document.body.style.overflow = '';
}

// Fermer lightbox avec Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

/* ════════════════════════════════════
   BUTTON RIPPLE EFFECT
════════════════════════════════════ */
function initButtonRipples() {
  document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px; height: ${size}px;
        left: ${x}px; top: ${y}px;
        background: rgba(255,255,255,0.15);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleAnim 0.5s ease-out forwards;
        pointer-events: none;
        z-index: 10;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Ajouter le keyframe si pas encore présent
  if (!document.querySelector('#rippleStyle')) {
    const style = document.createElement('style');
    style.id = 'rippleStyle';
    style.textContent = `
      @keyframes rippleAnim {
        to { transform: scale(1); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

/* ════════════════════════════════════
   GALERIE — CATEGORIES FILTER
════════════════════════════════════ */
function filterGalerie(cat, btn) {
  document.querySelectorAll('.galerie-cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.galerie-full-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'scale(0.95)';
    setTimeout(() => {
      item.style.display =
        (cat === 'tous' || item.dataset.cat === cat) ? 'flex' : 'none';
      if (item.style.display !== 'none') {
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
          item.style.transition = 'opacity .3s, transform .3s';
        }, 20);
      }
    }, 150);
  });
}

/* ════════════════════════════════════
   INIT
════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  observeReveal();
  initLogo3D();
  initLiquidBg();
  initButtonRipples();

  // Counters observer
  const chiffresEl = document.querySelector('.chiffres-grid');
  if (chiffresEl) counterObs.observe(chiffresEl);

  // Custom montant input
  const customInput = document.getElementById('customMontant');
  if (customInput) {
    customInput.addEventListener('input', function() {
      if (this.value) {
        document.querySelectorAll('.montant-btn').forEach(b => b.classList.remove('active'));
        const donBtn = document.getElementById('donBtn');
        if (donBtn) donBtn.textContent = 'Faire un don de ' + this.value + ' €';
      }
    });
  }
});