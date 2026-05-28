document.addEventListener('DOMContentLoaded', function () {

  // 1. MENU BURGER
  const burger = document.getElementById('burger');
  const nav    = document.getElementById('nav');

  if (burger && nav) {
    burger.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen);
      const spans = burger.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        const spans = burger.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      });
    });
  }

  // 2. HEADER AU SCROLL
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.style.background = window.scrollY > 60
        ? 'rgba(17,17,17,1)'
        : 'rgba(17,17,17,0.96)';
    });
  }

  // 3. FILTRE ÉVÉNEMENTS
  const filterBtns = document.querySelectorAll('.filter');
  const eventCards = document.querySelectorAll('.event-card');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      const selected = btn.getAttribute('data-filter');
      eventCards.forEach(function (card) {
        card.style.display = card.getAttribute('data-year') === selected ? '' : 'none';
      });
    });
  });

  // Afficher uniquement "À venir" au chargement
  eventCards.forEach(function (card) {
    if (card.getAttribute('data-year') !== 'avenir') {
      card.style.display = 'none';
    }
  });

  // 4. SMOOTH SCROLL
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // 5. ANIMATIONS AU SCROLL
  const fadeEls = document.querySelectorAll(
    '.event-card, .join__card, .univers__card, .about__grid, .festival__grid, .cotisations__card, .partner'
  );

  fadeEls.forEach(function (el) {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  function onScroll() {
    fadeEls.forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight - 60) {
        el.style.opacity   = '1';
        el.style.transform = 'translateY(0)';
      }
    });
  }

  window.addEventListener('scroll', onScroll);
  onScroll();

  // 6. FEEDBACK FORMULAIRES
  document.querySelectorAll('form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Message envoyé !';
      btn.style.background = '#4a7c59';
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = original;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    });
  });

});