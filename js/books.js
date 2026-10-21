// ============================================================
//  books.js — Book rendering, search, filters, pagination
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const grid         = document.getElementById('books-grid');
  const searchInput  = document.getElementById('search-input');
  const catFilter    = document.getElementById('filter-category');
  const priceDisplay = document.getElementById('price-display');
  const priceRange   = document.getElementById('filter-price');
  const sortSelect   = document.getElementById('sort-select');
  const loadMoreBtn  = document.getElementById('load-more');
  const noResults    = document.getElementById('no-results');

  if (!grid) return; // Not on a book-grid page

  const PAGE_SIZE = catFilter ? 16 : 8;
  let displayedCount = 0;
  let activeCategory = null; // for category cards on home page

  const shownCountEl = document.getElementById('books-shown-count');
  const totalCountEl = document.getElementById('books-total-count');
  const countBarEl   = document.getElementById('books-count-bar');

  // ── Populate category dropdown ─────────────────────────────
  if (catFilter) {
    const cats = [...new Set(BOOKS.map(b => b.category))].sort();
    cats.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat; opt.textContent = cat;
      catFilter.appendChild(opt);
    });
  }

  // ── Category cards on home page ───────────────────────────
  document.querySelectorAll('.cat-card').forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.dataset.category;
      activeCategory = activeCategory === cat ? null : cat;
      document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('cat-card--active'));
      if (activeCategory) card.classList.add('cat-card--active');
      reset();
    });
  });

  // ── Filter & sort logic ────────────────────────────────────
  function getFiltered() {
    const term     = searchInput?.value.toLowerCase().trim() || '';
    const cat      = catFilter?.value || 'all';
    const maxPrice = parseFloat(priceRange?.value) || 9999;

    let list = BOOKS.filter(b => {
      const matchTerm  = !term || b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term);
      const matchCat   = (cat === 'all' && !activeCategory) || b.category === cat || b.category === activeCategory;
      const matchPrice = b.price <= maxPrice;
      return matchTerm && matchCat && matchPrice;
    });

    const sort = sortSelect?.value || 'default';
    if      (sort === 'price-asc')  list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sort === 'title')      list.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === 'rating')     list.sort((a, b) => b.rating - a.rating);

    return list;
  }

  // ── Card builder ──────────────────────────────────────────
  function buildCard(book) {
    const inWL      = isInWishlist(book.id);
    const stars     = renderStars(book.rating);
    const discount  = book.originalPrice
      ? Math.round((1 - book.price / book.originalPrice) * 100) : null;

    const card = document.createElement('article');
    card.className = 'book-card';
    card.dataset.id = book.id;
    card.innerHTML = `
      <div class="book-card__img-wrap">
        <img src="${book.cover}" alt="${book.title}" class="book-card__img" loading="lazy"
             onerror="this.src='https://via.placeholder.com/400x600/E8742C/ffffff?text=No+Cover'">
        ${book.badge ? `<span class="book-card__badge">${book.badge}</span>` : ''}
        <button class="book-card__wishlist ${inWL ? 'book-card__wishlist--active' : ''}"
                data-id="${book.id}" aria-label="Toggle wishlist">
          <i class="fa-${inWL ? 'solid' : 'regular'} fa-heart"></i>
        </button>
        <div class="book-card__overlay">
          <button class="book-card__quick-view" data-id="${book.id}">
            <i class="fa-solid fa-eye"></i> Quick View
          </button>
        </div>
      </div>
      <div class="book-card__body">
        <span class="book-card__cat">${book.category}</span>
        <h3 class="book-card__title">${book.title}</h3>
        <p class="book-card__author">by ${book.author}</p>
        <div class="book-card__rating">
          ${stars}
          <span class="book-card__reviews">(${book.reviews.toLocaleString()})</span>
        </div>
        <div class="book-card__footer">
          <div class="book-card__price-wrap">
            <span class="book-card__price">₹${book.price.toLocaleString('en-IN')}</span>
            ${book.originalPrice ? `<span class="book-card__original">₹${book.originalPrice.toLocaleString('en-IN')}</span>` : ''}
            ${discount ? `<span class="book-card__discount">-${discount}%</span>` : ''}
          </div>
          <button class="btn btn--primary btn--sm book-card__cart" data-id="${book.id}" aria-label="Add to cart">
            <i class="fa-solid fa-cart-plus"></i>
          </button>
        </div>
      </div>`;

    // Events
    card.querySelector('.book-card__wishlist').addEventListener('click', e => {
      e.stopPropagation();
      const book_ = BOOKS.find(b => b.id === book.id);
      wishlistToggle(book_);
      const btn  = e.currentTarget;
      const icon = btn.querySelector('i');
      const now  = isInWishlist(book.id);
      btn.classList.toggle('book-card__wishlist--active', now);
      icon.className = `fa-${now ? 'solid' : 'regular'} fa-heart`;
    });

    card.querySelector('.book-card__quick-view').addEventListener('click', e => {
      e.stopPropagation();
      openQuickView(BOOKS.find(b => b.id === Number(e.currentTarget.dataset.id)));
    });

    card.querySelector('.book-card__cart').addEventListener('click', e => {
      e.stopPropagation();
      const book_ = BOOKS.find(b => b.id === Number(e.currentTarget.dataset.id));
      cartAdd(book_, 1);
      showToast(`"${book_.title}" added to cart`);
    });

    // Clicking anywhere on card opens quick-view
    card.addEventListener('click', e => {
      if (e.target.closest('button, a, input')) return;
      openQuickView(book);
    });

    return card;
  }

  // ── Render helpers ────────────────────────────────────────
  function renderBatch(books) {
    const frag = document.createDocumentFragment();
    books.forEach((b, idx) => {
      const card = buildCard(b);
      card.style.animation = `fadeInUp 0.45s cubic-bezier(.22,1,.36,1) ${idx * 0.045}s both`;
      frag.appendChild(card);
    });
    grid.appendChild(frag);
  }

  function reset() {
    grid.innerHTML = '';
    displayedCount = 0;
    loadMore();
  }

  function loadMore() {
    const filtered = getFiltered();

    if (filtered.length === 0) {
      noResults?.classList.remove('hidden');
      loadMoreBtn && (loadMoreBtn.style.display = 'none');
      if (countBarEl) countBarEl.style.display = 'none';
      return;
    }
    noResults?.classList.add('hidden');
    if (countBarEl) countBarEl.style.display = 'flex';

    const slice = filtered.slice(displayedCount, displayedCount + PAGE_SIZE);
    renderBatch(slice);
    displayedCount += slice.length;

    if (shownCountEl) shownCountEl.textContent = displayedCount.toLocaleString('en-IN');
    if (totalCountEl) totalCountEl.textContent = filtered.length.toLocaleString('en-IN');

    if (loadMoreBtn) {
      loadMoreBtn.style.display = displayedCount >= filtered.length ? 'none' : 'flex';
    }
  }

  // ── Price range label ──────────────────────────────────────
  priceRange?.addEventListener('input', () => {
    if (priceDisplay) priceDisplay.textContent = `₹0 – ₹${Number(priceRange.value).toLocaleString('en-IN')}`;
    reset();
  });

  // ── Wire filter controls ───────────────────────────────────
  searchInput?.addEventListener('input', reset);
  catFilter?.addEventListener('change', reset);
  sortSelect?.addEventListener('change', reset);
  loadMoreBtn?.addEventListener('click', loadMore);

  // ── URL search query support ──────────────────────────────
  const urlParams = new URLSearchParams(window.location.search);
  const qParam = urlParams.get('q');
  if (qParam && searchInput) {
    searchInput.value = decodeURIComponent(qParam);
  }

  // ── Initial render ────────────────────────────────────────
  reset();
});
