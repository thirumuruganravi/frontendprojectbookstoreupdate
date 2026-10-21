/* ============================================================
   animate.js — BookHaven Animation Engine
   Scroll Reveal · Particles · Spotlight · Ripple · Skeleton
   ============================================================ */

// ── 1. Intersection Observer — Scroll Reveal ─────────────────
(function initScrollReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Animate section-divider width
        const div = entry.target.querySelector?.('.section-divider');
        if (div) div.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  const revealEls = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger, .section-header'
  );
  revealEls.forEach(el => io.observe(el));

  // Also observe section-dividers standalone
  document.querySelectorAll('.section-divider').forEach(el => {
    el.classList.remove('revealed');
    io.observe(el.closest('.section-header') || el);
  });
})();

// ── 2. Cursor Spotlight (desktop only) ───────────────────────
(function initSpotlight() {
  if (window.innerWidth < 1024) return;
  const spot = document.createElement('div');
  spot.className = 'spotlight';
  document.body.appendChild(spot);
  document.addEventListener('mousemove', e => {
    spot.style.left = e.clientX + 'px';
    spot.style.top  = e.clientY + 'px';
  });
})();

// ── 3. Ripple Effect on Buttons ───────────────────────────────
(function initRipple() {
  function createRipple(e) {
    const btn  = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x    = e.clientX - rect.left;
    const y    = e.clientY - rect.top;

    const circle = document.createElement('span');
    circle.style.cssText = `
      position:absolute;
      left:${x}px; top:${y}px;
      width:10px; height:10px;
      background:rgba(255,255,255,.45);
      border-radius:50%;
      transform:translate(-50%,-50%) scale(0);
      animation:ripple .55s ease-out forwards;
      pointer-events:none; z-index:10;
    `;
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(circle);
    circle.addEventListener('animationend', () => circle.remove());
  }

  document.querySelectorAll('.btn--primary, .btn--outline, .btn--accent-outline').forEach(btn => {
    btn.addEventListener('click', createRipple);
  });

  // Delegate for dynamically created buttons
  document.addEventListener('click', e => {
    const btn = e.target.closest('.btn--primary, .btn--outline');
    if (btn && !btn.dataset.rippleBound) {
      btn.dataset.rippleBound = '1';
      createRipple({ currentTarget: btn, clientX: e.clientX, clientY: e.clientY });
    }
  });
})();

// ── 4. Badge Bounce on Update ─────────────────────────────────
(function initBadgeBounce() {
  // Patch cart/wishlist save to trigger badge bounce
  const origUpdateAllBadges = window.updateAllBadges;
  window.updateAllBadges = function() {
    origUpdateAllBadges?.();
    document.querySelectorAll('.badge--cart, .badge--wishlist').forEach(el => {
      el.classList.remove('bump');
      void el.offsetWidth; // reflow
      el.classList.add('bump');
      setTimeout(() => el.classList.remove('bump'), 500);
    });
  };
})();

// ── 5. Scroll-to-Top Button ───────────────────────────────────
(function initScrollTop() {
  const btn = document.createElement('button');
  btn.id = 'scroll-top';
  btn.setAttribute('aria-label', 'Scroll to top');
  btn.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ── 6. Navbar scroll shadow ───────────────────────────────────
(function initNavShadow() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('navbar--scrolled', window.scrollY > 8);
  }, { passive: true });
})();

// ── 7. Hero Floating Particles ────────────────────────────────
(function initParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const wrap = document.createElement('div');
  wrap.className = 'hero-particles';
  hero.appendChild(wrap);

  const colours = ['#E8742C','#F6AD55','#3D5A99','#1B2A4A'];

  for (let i = 0; i < 18; i++) {
    const dot = document.createElement('div');
    dot.className = 'hero-particle';
    dot.style.cssText = `
      left:${Math.random() * 100}%;
      top:${70 + Math.random() * 30}%;
      width:${4 + Math.random() * 6}px;
      height:${4 + Math.random() * 6}px;
      background:${colours[Math.floor(Math.random() * colours.length)]};
      animation-delay:${Math.random() * 4}s;
      animation-duration:${3 + Math.random() * 3}s;
      opacity:0;
    `;
    wrap.appendChild(dot);
  }
})();

// ── 8. Skeleton Loader for Books Grid ────────────────────────
window.showSkeletons = function(count = 8) {
  const grid = document.getElementById('books-grid');
  if (!grid) return;
  grid.innerHTML = Array.from({ length: count }, () => `
    <div class="skeleton-card">
      <div class="skeleton skeleton-img"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text short"></div>
      <div class="skeleton skeleton-text short" style="width:40%"></div>
      <div class="skeleton skeleton-btn"></div>
    </div>`).join('');
};

// ── 9. Add-to-Cart Cart-fly animation ────────────────────────
// ── 9. Add-to-Cart Cart-fly animation ────────────────────────
window.flyToCart = function(originEl) {
  if (!originEl) return;
  const cartBtn = document.querySelector('.navbar__icon-btn[href*="cart"]') ||
                  document.querySelector('.navbar__icon-btn [class*="cart"]')?.closest('.navbar__icon-btn');
  if (!cartBtn) return;

  const originRect = originEl.getBoundingClientRect();
  const targetRect = cartBtn.getBoundingClientRect();

  const dot = document.createElement('div');
  dot.style.cssText = `
    position: fixed;
    left: ${originRect.left + originRect.width / 2}px;
    top: ${originRect.top + originRect.height / 2}px;
    width: 20px; height: 20px; border-radius: 50%;
    background: linear-gradient(135deg, var(--color-accent), #f0913f);
    color: #fff; font-size: 10px; display: flex; align-items: center; justify-content: center;
    z-index: 9999; pointer-events: none;
    box-shadow: 0 4px 14px rgba(232,116,44,.6);
    transition: all .65s cubic-bezier(.2,.8,.25,1);
    transform: translate(-50%, -50%) scale(1);
  `;
  dot.innerHTML = '<i class="fa-solid fa-cart-shopping" style="font-size:10px;"></i>';
  document.body.appendChild(dot);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      dot.style.left = (targetRect.left + targetRect.width / 2) + 'px';
      dot.style.top = (targetRect.top + targetRect.height / 2) + 'px';
      dot.style.transform = 'translate(-50%, -50%) scale(0.6)';
      dot.style.opacity = '0.5';
    });
  });

  setTimeout(() => {
    dot.remove();
    const badge = cartBtn.querySelector('.badge--cart');
    if (badge) {
      badge.classList.remove('bump');
      void badge.offsetWidth;
      badge.classList.add('bump');
    }
  }, 680);
};

// ── 10. Book Card 3D Tilt with Glare ─────────────────────────
(function initTilt() {
  if (window.innerWidth < 768) return;

  let activeCard = null;

  document.addEventListener('mousemove', e => {
    const card = e.target.closest?.('.book-card');
    if (activeCard && activeCard !== card) {
      activeCard.style.transform = '';
      activeCard.style.transition = 'transform .4s cubic-bezier(.34,1.2,.64,1)';
      const glare = activeCard.querySelector('.book-glare');
      if (glare) glare.style.opacity = '0';
      activeCard = null;
    }
    if (!card) return;
    activeCard = card;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = (x - cx) / cx;
    const dy = (y - cy) / cy;

    card.style.transform = `perspective(900px) rotateY(${dx * 7}deg) rotateX(${-dy * 5}deg) translateY(-8px) scale(1.02)`;
    card.style.transition = 'transform .08s ease-out';

    let glare = card.querySelector('.book-glare');
    if (!glare) {
      glare = document.createElement('div');
      glare.className = 'book-glare';
      card.querySelector('.book-card__img-wrap')?.appendChild(glare);
    }
    if (glare) {
      glare.style.opacity = '1';
      glare.style.background = `radial-gradient(circle at ${(x / rect.width)*100}% ${(y / rect.height)*100}%, rgba(255,255,255,.3) 0%, rgba(255,255,255,0) 65%)`;
    }
  });

  document.addEventListener('mouseleave', () => {
    if (activeCard) {
      activeCard.style.transform = '';
      activeCard.style.transition = 'transform .4s cubic-bezier(.34,1.2,.64,1)';
      const glare = activeCard.querySelector('.book-glare');
      if (glare) glare.style.opacity = '0';
      activeCard = null;
    }
  });
})();

// ── 11. Page entrance animation ───────────────────────────────
(function initPageEntrance() {
  document.querySelector('main')?.classList.add('page-transition');
})();

// ── 12. Animated Counter for stats ────────────────────────────
(function initHeroCounter() {
  function animateCount(el, end, suffix = '') {
    let start = 0;
    const duration = 1500;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { start = end; clearInterval(timer); }
      el.textContent = Math.floor(start).toLocaleString() + suffix;
    }, 16);
  }

  const statsObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const item = entry.target;
      const numEl = item.querySelector('.stats-bar__num, .hero__stat-num');
      if (!numEl || numEl.dataset.counted) return;
      numEl.dataset.counted = '1';
      const raw = numEl.textContent.trim();
      const match = raw.match(/^([\d,]+)(.*)$/);
      if (match) {
        const num = parseInt(match[1].replace(/,/g, ''));
        animateCount(numEl, num, match[2]);
      }
      statsObs.unobserve(item);
    });
  }, { threshold: .3 });

  document.querySelectorAll('.stats-bar__item, .hero__stats > div').forEach(el => statsObs.observe(el));
})();

// ── 13. Smooth nav active state on scroll ─────────────────────
(function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  if (!sections.length) return;
  const navLinks = document.querySelectorAll('.nav__link');

  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        link.classList.toggle(
          'nav__link--active',
          link.getAttribute('href') === '#' + entry.target.id
        );
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => spy.observe(s));
})();

// ── 14. Wishlist Heart Burst Confetti ─────────────────────────
window.burstHearts = function(originEl) {
  if (!originEl) return;
  const rect = originEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const items = ['❤️', '✨', '💖', '⭐', '🧡', '✨'];
  for (let i = 0; i < 6; i++) {
    const el = document.createElement('span');
    el.className = 'heart-particle';
    el.textContent = items[i % items.length];
    const angle = (i / 6) * 2 * Math.PI + (Math.random() * 0.4 - 0.2);
    const dist = 32 + Math.random() * 26;
    el.style.left = cx + 'px';
    el.style.top = cy + 'px';
    el.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
    el.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
    el.style.setProperty('--rot', (Math.random() * 50 - 25) + 'deg');
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 850);
  }
};

// ── 15. Global Click Interceptors for Animations ──────────────
document.addEventListener('click', e => {
  // Add to cart fly
  const cartBtn = e.target.closest('.book-card__cart, #qv-add-cart');
  if (cartBtn) flyToCart(cartBtn);

  // Wishlist heart burst
  const wlBtn = e.target.closest('.book-card__wishlist, #qv-wishlist');
  if (wlBtn) {
    burstHearts(wlBtn);
    wlBtn.classList.remove('book-card__wishlist--active');
    void wlBtn.offsetWidth;
    wlBtn.classList.add('book-card__wishlist--active');
  }
});
