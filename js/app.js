// ============================================================
//  app.js — Core UI: nav toggle, toast, modal, LocalStorage
// ============================================================

// ── LocalStorage helpers ─────────────────────────────────────
const LS = {
  get(key, fallback = []) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }
};

// ── Toast ─────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-xmark' : 'fa-circle-info'}"></i>
    <span>${msg}</span>`;
  container.appendChild(toast);
  // Trigger animation
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('toast--show'));
  });
  setTimeout(() => {
    toast.classList.remove('toast--show');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// ── Modal ─────────────────────────────────────────────────────
function openModal(contentHTML) {
  // Remove existing modal
  const existing = document.getElementById('global-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'global-modal';
  modal.className = 'modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = `
    <div class="modal__overlay"></div>
    <div class="modal__content">
      <button class="modal__close" aria-label="Close modal">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <div class="modal__body">${contentHTML}</div>
    </div>`;
  document.body.appendChild(modal);

  // Show with animation
  requestAnimationFrame(() => {
    requestAnimationFrame(() => modal.classList.add('modal--show'));
  });
  document.body.style.overflow = 'hidden';

  const close = () => {
    modal.classList.remove('modal--show');
    setTimeout(() => { modal.remove(); document.body.style.overflow = ''; }, 300);
  };

  modal.querySelector('.modal__close').addEventListener('click', close);
  modal.querySelector('.modal__overlay').addEventListener('click', close);
  document.addEventListener('keydown', function onEsc(e) {
    if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onEsc); }
  });
}

// ── Navigation ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navMenu   = document.querySelector('.nav__menu');
  const overlay   = document.querySelector('.nav__overlay');
  const navLinks  = document.querySelectorAll('.nav__link');

  function closeMenu() {
    hamburger?.classList.remove('active');
    navMenu?.classList.remove('nav__menu--open');
    overlay?.classList.remove('nav__overlay--show');
    document.body.style.overflow = '';
  }
  function openMenu() {
    hamburger?.classList.add('active');
    navMenu?.classList.add('nav__menu--open');
    overlay?.classList.add('nav__overlay--show');
    document.body.style.overflow = 'hidden';
  }

  hamburger?.addEventListener('click', () => {
    navMenu?.classList.contains('nav__menu--open') ? closeMenu() : openMenu();
  });
  overlay?.addEventListener('click', closeMenu);
  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Sticky nav shadow
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('navbar--scrolled', window.scrollY > 10);
  });

  // Active nav link highlight
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('nav__link--active');
    }
  });

  // Update all cart/wishlist badges on every page
  updateAllBadges();
});

// ── Badge updater (shared across pages) ─────────────────────
function updateAllBadges() {
  const cart     = LS.get('bh_cart', []);
  const wishlist = LS.get('bh_wishlist', []);
  const cartTotal = cart.reduce((sum, i) => sum + i.qty, 0);

  document.querySelectorAll('.badge--cart').forEach(el => el.textContent = cartTotal || '');
  document.querySelectorAll('.badge--wishlist').forEach(el => el.textContent = wishlist.length || '');
}

// ── Quick-view modal helper ──────────────────────────────────
function openQuickView(book) {
  const stars = renderStars(book.rating);
  const discount = book.originalPrice
    ? Math.round((1 - book.price / book.originalPrice) * 100)
    : null;

  openModal(`
    <div class="qv">
      <div class="qv__img-wrap">
        <img src="${book.cover}" alt="${book.title}" class="qv__img" onerror="this.src='https://via.placeholder.com/400x600/E8742C/ffffff?text=No+Cover'">
        ${book.badge ? `<span class="qv__badge">${book.badge}</span>` : ''}
      </div>
      <div class="qv__info">
        <span class="qv__category">${book.category}</span>
        <h2 class="qv__title">${book.title}</h2>
        <p class="qv__author">by <strong>${book.author}</strong></p>
        <div class="qv__rating">
          ${stars}
          <span class="qv__reviews">(${book.reviews.toLocaleString()} reviews)</span>
        </div>
        <div class="qv__price-row">
          <span class="qv__price">₹${book.price.toLocaleString('en-IN')}</span>
          ${book.originalPrice ? `<span class="qv__original">₹${book.originalPrice.toLocaleString('en-IN')}</span>` : ''}
          ${discount ? `<span class="qv__discount">${discount}% OFF</span>` : ''}
        </div>
        <p class="qv__desc">${book.description}</p>
        <div class="qv__qty-row">
          <label>Qty:</label>
          <div class="qty-ctrl">
            <button class="qty-btn" id="qv-decr" aria-label="Decrease">-</button>
            <span id="qv-qty">1</span>
            <button class="qty-btn" id="qv-incr" aria-label="Increase">+</button>
          </div>
        </div>
        <div class="qv__actions">
          <button class="btn btn--primary btn--full" id="qv-add-cart" data-id="${book.id}">
            <i class="fa-solid fa-cart-shopping"></i> Add to Cart
          </button>
          <button class="btn btn--outline" id="qv-wishlist" data-id="${book.id}">
            <i class="fa-${isInWishlist(book.id) ? 'solid' : 'regular'} fa-heart"></i>
          </button>
        </div>
      </div>
    </div>`);

  // Qty controls inside modal
  let qty = 1;
  document.getElementById('qv-incr')?.addEventListener('click', () => {
    qty++; document.getElementById('qv-qty').textContent = qty;
  });
  document.getElementById('qv-decr')?.addEventListener('click', () => {
    if (qty > 1) { qty--; document.getElementById('qv-qty').textContent = qty; }
  });
  document.getElementById('qv-add-cart')?.addEventListener('click', () => {
    cartAdd(book, qty);
    showToast(`"${book.title}" added to cart`);
    document.getElementById('global-modal')?.querySelector('.modal__close').click();
  });
  document.getElementById('qv-wishlist')?.addEventListener('click', (e) => {
    wishlistToggle(book);
    const icon = e.currentTarget.querySelector('i');
    const inWL = isInWishlist(book.id);
    icon.className = `fa-${inWL ? 'solid' : 'regular'} fa-heart`;
  });
}

// ── Stars renderer ───────────────────────────────────────────
function renderStars(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (rating >= i)       html += '<i class="fa-solid fa-star"></i>';
    else if (rating >= i - 0.5) html += '<i class="fa-solid fa-star-half-stroke"></i>';
    else                   html += '<i class="fa-regular fa-star"></i>';
  }
  return `<span class="stars">${html}</span><span class="rating-num">${rating}</span>`;
}

// ── Search keyboard shortcut (⌘K / Ctrl+K) ───────────────────
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    const input = document.getElementById('nav-search') || document.querySelector('.navbar__search input');
    if (input) {
      input.focus();
      input.select();
    }
  }
});

// ── Search enter navigation ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.navbar__search input').forEach(input => {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const q = encodeURIComponent(input.value.trim());
        if (q) window.location.href = `books.html?q=${q}`;
      }
    });
  });
});
