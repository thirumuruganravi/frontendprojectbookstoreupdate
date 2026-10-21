// ============================================================
//  cart.js — Cart CRUD + LocalStorage + UI rendering
// ============================================================
const CART_KEY = 'bh_cart';

function cartGet() {
  const items = LS.get(CART_KEY, []);
  return items.map(item => {
    const book = typeof BOOKS !== 'undefined' ? BOOKS.find(b => b.id === item.id) : null;
    if (book) {
      item.price = book.price;
      item.originalPrice = book.originalPrice || null;
    }
    return item;
  });
}
function cartSave(items) { LS.set(CART_KEY, items); updateAllBadges(); }

function cartAdd(book, qty = 1) {
  const items = cartGet();
  const existing = items.find(i => i.id === book.id);
  if (existing) existing.qty += qty;
  else items.push({ id: book.id, qty, price: book.price, originalPrice: book.originalPrice || null, title: book.title, author: book.author, cover: book.cover, category: book.category });
  cartSave(items);
  updateAllBadges();
  renderCartPage();
}

function cartRemove(id) {
  const items = cartGet().filter(i => i.id !== id);
  cartSave(items);
  renderCartPage();
  showToast('Item removed from cart', 'info');
}

function cartChangeQty(id, delta) {
  const items = cartGet();
  const item  = items.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  cartSave(items);
  renderCartPage();
}

function cartClear() {
  cartSave([]);
  renderCartPage();
}

// ── Cart page renderer ───────────────────────────────────────
function renderCartPage() {
  const list      = document.getElementById('cart-items');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl    = document.getElementById('cart-total');
  const emptyEl    = document.getElementById('cart-empty');
  const summaryEl  = document.getElementById('cart-summary');
  if (!list) return;

  const items = cartGet();

  if (items.length === 0) {
    list.innerHTML = '';
    emptyEl?.classList.remove('hidden');
    summaryEl?.classList.add('hidden');
    return;
  }

  emptyEl?.classList.add('hidden');
  summaryEl?.classList.remove('hidden');

  list.innerHTML = items.map((item, idx) => `
    <li class="cart-item" data-id="${item.id}" style="animation: fadeInUp .4s cubic-bezier(.22,1,.36,1) ${idx * 0.05}s both;">
      <img src="${item.cover}" alt="${item.title}" class="cart-item__img"
           onerror="this.src='https://via.placeholder.com/80x120/E8742C/ffffff?text=Book'">
      <div class="cart-item__info">
        <h4 class="cart-item__title">${item.title}</h4>
        <p class="cart-item__author">by ${item.author}</p>
        <span class="cart-item__cat">${item.category}</span>
      </div>
      <div class="cart-item__qty qty-ctrl">
        <button class="qty-btn" data-id="${item.id}" data-action="decr" aria-label="Decrease quantity">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" data-id="${item.id}" data-action="incr" aria-label="Increase quantity">+</button>
      </div>
      <div class="cart-item__price">
        <span class="cart-item__unit">₹${item.price.toLocaleString('en-IN')}</span>
        <span class="cart-item__total">₹${(item.price * item.qty).toLocaleString('en-IN')}</span>
      </div>
      <button class="cart-item__remove" data-id="${item.id}" aria-label="Remove item">
        <i class="fa-solid fa-trash"></i>
      </button>
    </li>`).join('');

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  totalEl.textContent    = `₹${subtotal.toLocaleString('en-IN')}`;

  // Event delegation
  list.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id     = Number(btn.dataset.id);
      const action = btn.dataset.action;
      cartChangeQty(id, action === 'incr' ? 1 : -1);
    });
  });
  list.querySelectorAll('.cart-item__remove').forEach(btn => {
    btn.addEventListener('click', () => cartRemove(Number(btn.dataset.id)));
  });
}

// Run on cart page load
document.addEventListener('DOMContentLoaded', renderCartPage);
