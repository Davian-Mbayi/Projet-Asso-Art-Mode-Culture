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
   LOGO 3D — TILT pur sur l'image
════════════════════════════════════ */
function initLogo3D() {
  const wrapper = document.querySelector('.hero-logo-3d-wrapper');
  if (!wrapper) return;
  const img = wrapper.querySelector('img');
  if (!img) return;

  // Supprimer tout miroir existant
  wrapper.querySelectorAll('.hero-logo-mirror').forEach(el => el.remove());

  let curX = 0, curY = 0, tgtX = 0, tgtY = 0;

  wrapper.addEventListener('mousemove', (e) => {
    const r = wrapper.getBoundingClientRect();
    tgtX = ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -22;
    tgtY = ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) *  22;
  });
  wrapper.addEventListener('mouseleave', () => { tgtX = 0; tgtY = 0; });

  (function tick() {
    curX += (tgtX - curX) * 0.1;
    curY += (tgtY - curY) * 0.1;
    img.style.transform = `perspective(600px) rotateX(${curX}deg) rotateY(${curY}deg)`;
    requestAnimationFrame(tick);
  })();

  wrapper.addEventListener('click', () => {
    img.style.transition = 'transform 0.12s ease';
    img.style.transform = 'perspective(600px) scale(0.93)';
    setTimeout(() => { img.style.transition = ''; }, 130);
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
  lightbox.innerHTML = '';

  // Bouton fermer — position fixed pour rester en haut à droite quoi qu'il arrive
  const closeBtn = document.createElement('button');
  closeBtn.style.cssText = 'position:fixed; top:20px; right:24px; color:#C8A96B; background:rgba(0,0,0,0.6); border:1px solid rgba(200,169,107,0.4); border-radius:50%; width:44px; height:44px; font-size:1.4rem; line-height:1; cursor:pointer; z-index:10001; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(8px); transition: background .2s;';
  closeBtn.setAttribute('aria-label', 'Fermer');
  closeBtn.innerHTML = '&times;';
  closeBtn.onmouseenter = () => closeBtn.style.background = 'rgba(200,169,107,0.25)';
  closeBtn.onmouseleave = () => closeBtn.style.background = 'rgba(0,0,0,0.6)';
  closeBtn.onclick = function(e) { e.stopPropagation(); closeLightbox(); };

  // Image en plein écran
  const img = document.createElement('img');
  img.className = 'lightbox-img';
  const source = el && (el.tagName === 'IMG' ? el : el.querySelector && el.querySelector('img'));
  if (source && source.src) img.src = source.src;
  else if (el && el.dataset && el.dataset.src) img.src = el.dataset.src;
  img.alt = (source && source.alt) ? source.alt : '';
  img.onclick = function(e) { e.stopPropagation(); }; // clic sur l'image ne ferme pas

  lightbox.appendChild(closeBtn);
  lightbox.appendChild(img);
  lightbox.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) lb.style.display = 'none';
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
/* ════════════════════════════════════
   ADHÉSIONS — Stockage + Export CSV
════════════════════════════════════ */

// Clé localStorage pour stocker tous les adhérents
const ADHERENTS_KEY = 'amc_adherents';

function getadherents() {
  try { return JSON.parse(localStorage.getItem(ADHERENTS_KEY) || '[]'); }
  catch { return []; }
}

function saveAdherent(data) {
  const list = getadherents();
  list.push(data);
  localStorage.setItem(ADHERENTS_KEY, JSON.stringify(list));
}

function submitAdhesion() {
  const nom    = document.getElementById('nom')?.value?.trim();
  const email  = document.getElementById('email')?.value?.trim();
  const profil = document.getElementById('profil')?.value;
  const tel    = document.getElementById('tel')?.value?.trim();
  const ville  = document.getElementById('ville')?.value?.trim();
  const dob    = document.getElementById('dateNaissance')?.value;
  const msg    = document.getElementById('message')?.value?.trim();
  const rgpd   = document.getElementById('rgpd')?.checked;

  if (!nom)    { alert('Merci de renseigner votre nom.'); return; }
  if (!email)  { alert('Merci de renseigner votre email.'); return; }
  if (!profil) { alert('Merci de choisir votre profil.'); return; }
  if (!rgpd)   { alert('Merci d\'accepter la politique de confidentialité.'); return; }

  const adherent = {
    id: Date.now(),
    dateInscription: new Date().toLocaleDateString('fr-FR'),
    nom, email, tel, ville, dateNaissance: dob,
    profil, message: msg,
    statut: 'En attente de paiement'
  };

  // 1. Sauvegarder localement
  saveAdherent(adherent);

  // 2. Ouvrir un email pré-rempli vers l'asso
  const subject = encodeURIComponent(`Nouvelle adhésion AMC — ${nom} (${profil})`);
  const body = encodeURIComponent(
    `Nouvelle demande d'adhésion reçue :\n\n` +
    `Nom : ${nom}\n` +
    `Email : ${email}\n` +
    `Téléphone : ${tel || 'Non renseigné'}\n` +
    `Ville : ${ville || 'Non renseignée'}\n` +
    `Date de naissance : ${dob || 'Non renseignée'}\n` +
    `Profil : ${profil}\n` +
    `Date d'inscription : ${adherent.dateInscription}\n\n` +
    `Message :\n${msg || 'Aucun message'}\n\n` +
    `---\nCotisation annuelle : 30 €\nStatut : En attente de paiement`
  );
  window.location.href = `mailto:artmodeculture@gmail.com?subject=${subject}&body=${body}`;

  // 3. Afficher confirmation et rediriger vers paiement
  document.getElementById('adhesionForm').style.display = 'none';
  document.getElementById('adhesionSuccess').style.display = 'block';

  // Après 3 secondes, proposer de passer au paiement
  setTimeout(() => { navigate('paiement'); }, 3500);
}

/* Export CSV de tous les adhérents */
function exportCSV() {
  const list = getadherents();
  if (!list.length) { alert('Aucun adhérent enregistré pour le moment.'); return; }

  const headers = ['ID', 'Date inscription', 'Nom', 'Email', 'Téléphone', 'Ville', 'Date naissance', 'Profil', 'Statut', 'Message'];
  const rows = list.map(a => [
    a.id, a.dateInscription, a.nom, a.email,
    a.tel || '', a.ville || '', a.dateNaissance || '',
    a.profil, a.statut, (a.message || '').replace(/\n/g, ' ')
  ]);

  const csv = [headers, ...rows]
    .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(';'))
    .join('\n');

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `adherents_AMC_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ════════════════════════════════════
   PAIEMENT — Placeholder handler
════════════════════════════════════ */
function handlePayment() {
  const nom   = document.getElementById('pay-nom')?.value?.trim();
  const email = document.getElementById('pay-email')?.value?.trim();
  if (!nom || !email) {
    alert('Merci de renseigner votre nom et email avant de procéder au paiement.');
    return;
  }
  // TODO : remplacer par l'intégration réelle (Stripe, PayPal, HelloAsso...)
  alert(`Merci ${nom} !\n\nLe système de paiement en ligne sera disponible très prochainement.\n\nEn attendant, vous pouvez régler par virement ou chèque à l'ordre d'Art Mode & Culture.\n\nContactez-nous : artmodeculture@gmail.com`);
}