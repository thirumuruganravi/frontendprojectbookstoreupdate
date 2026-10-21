// ============================================================
//  wishlist.js — Wishlist CRUD + LocalStorage + UI rendering
// ============================================================
const WL_KEY = 'bh_wishlist';

function wishlistGet()        { return LS.get(WL_KEY, []); }
function wishlistSave(items)  { LS.set(WL_KEY, items); updateAllBadges(); }

function isInWishlist(id) {
  return wishlistGet().includes(id);
}

function wishlistToggle(book) {
  const items = wishlistGet();
  const idx   = items.indexOf(book.id);
  if (idx > -1) {
    items.splice(idx, 1);
    wishlistSave(items);
    showToast(`"${book.title}" removed from wishlist`, 'info');
  } else {
    items.push(book.id);
    wishlistSave(items);
    showToast(`"${book.title}" added to wishlist ♡`);
  }
  renderWishlistPage();
  return idx === -1; // true = now in wishlist
}

// ── Wishlist page renderer ───────────────────────────────────
function renderWishlistPage() {
  const list    = document.getElementById('wishlist-items');
  const emptyEl = document.getElementById('wishlist-empty');
  if (!list) return;

  const ids   = wishlistGet();
  const books = BOOKS.filter(b => ids.includes(b.id));

  if (books.length === 0) {
    list.innerHTML = '';
    emptyEl?.classList.remove('hidden');
    return;
  }
  emptyEl?.classList.add('hidden');

  list.innerHTML = books.map((book, idx) => `
    <li class="wl-item" data-id="${book.id}" style="animation: fadeInUp .4s cubic-bezier(.22,1,.36,1) ${idx * 0.05}s both;">
      <img src="${book.cover}" alt="${book.title}" class="wl-item__img"
           onerror="this.src='https://via.placeholder.com/80x120/E8742C/ffffff?text=Book'">
      <div class="wl-item__info">
        <h4 class="wl-item__title">${book.title}</h4>
        <p class="wl-item__author">by ${book.author}</p>
        <span class="wl-item__cat">${book.category}</span>
        <div class="wl-item__rating">${renderStars(book.rating)}</div>
      </div>
      <div class="wl-item__price">₹${book.price.toLocaleString('en-IN')}</div>
      <div class="wl-item__actions">
        <button class="btn btn--primary btn--sm wl-add-cart" data-id="${book.id}">
          <i class="fa-solid fa-cart-shopping"></i> Add to Cart
        </button>
        <button class="btn btn--ghost btn--sm wl-remove" data-id="${book.id}" aria-label="Remove from wishlist">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </li>`).join('');

  list.querySelectorAll('.wl-add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const book = BOOKS.find(b => b.id === Number(btn.dataset.id));
      if (book) { cartAdd(book, 1); showToast(`"${book.title}" added to cart`); }
    });
  });
  list.querySelectorAll('.wl-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const book = BOOKS.find(b => b.id === Number(btn.dataset.id));
      if (book) wishlistToggle(book);
    });
  });
}

document.addEventListener('DOMContentLoaded', renderWishlistPage);
