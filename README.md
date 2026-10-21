# 📚 BookHaven — Modern Responsive Bookstore

An aesthetic, responsive online bookstore web application crafted with **HTML5, CSS3, SCSS Variables, and Vanilla JavaScript (ES6+)**. Powered by a client-side catalog of **1,000 curated books** with real-time search, multi-filter capabilities, and HTML5 LocalStorage persistence.

---

## ✨ Features

- **🌐 1,000 Curated Books Catalog:** Evenly distributed with 125 books across 8 categories (*Fiction, Technology, Self-Development, Business, Science, Biography, Romance, Mystery*) with real Indian Rupee (**₹**) pricing and discounts.
- **✨ 2026 Floating Glass Island Navbar:** Modern frosted-glass island design with blur saturation, animated squircle logo, segmented pill navigation, keyboard shortcut search (`⌘K` / `Ctrl+K`), live cart & wishlist notification counters, and a responsive mobile drawer.
- **🔍 Advanced Multi-Criteria Search & Filter:**
  - Real-time instant search across titles and authors.
  - Category selector for all 8 genres.
  - Price range slider (₹0 – ₹1,500).
  - Sort by Title (A–Z), Price (Low to High / High to Low), or Top Rated.
  - Dynamic result counter (`Showing X of 1,000 books`).
- **⚡ Smart Pagination:** Efficient batch rendering (16 books per page) with a "Load More Books" button for ultra-smooth performance.
- **📖 Quick-View Modal:** Detailed synopsis, author credentials, star ratings, and review counts without reloading.
- **🛒 Shopping Cart & Checkout (LocalStorage):** Full cart management (quantity increment/decrement, remove items, coupon discounts, tax/shipping calculation) saved to browser LocalStorage.
- **❤️ Wishlist System:** Heart toggle on any card with persistent storage and one-click "Move to Cart".
- **📱 100% Responsive Design:** Optimized for mobile phones, tablets, laptops, and ultra-wide desktop monitors.
- **🚀 Zero Framework Overhead:** 100% pure native web technologies — no React, Bootstrap, or Tailwind required.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Structure** | HTML5 (Semantic elements) |
| **Styling** | Vanilla CSS3, SCSS Design Tokens (`_variables.scss`), Glassmorphism, CSS Grid & Flexbox |
| **Animations** | Keyframe Animations, Micro-interactions, Floating Book Artwork |
| **Logic** | Vanilla JavaScript (ES6+) |
| **State / Storage** | HTML5 LocalStorage API |
| **Icons & Fonts** | FontAwesome 6, Google Fonts (*Playfair Display*, *Inter*) |

---

## 📂 Project Structure

```
├── index.html              # Homepage with hero, category grid, featured books
├── books.html              # Full 1,000-book catalog with search & multi-filters
├── cart.html               # Shopping cart & checkout flow
├── wishlist.html           # Saved favorite books
├── about.html              # About BookHaven, story & team
├── contact.html            # Contact inquiry form & bookstore details
├── css/
│   ├── style.css           # Core styling, layouts & floating island navbar
│   └── animations.css      # Rich micro-animations & transitions
├── js/
│   ├── data.js             # 1,000 books dataset & category metadata
│   ├── app.js              # Navbar, modals, toast notifications & search shortcut
│   ├── books.js            # Filtering, sorting, and pagination logic
│   ├── cart.js             # Cart state management & calculations
│   ├── wishlist.js         # Wishlist state management
│   └── animate.js          # IntersectionObserver scroll reveals
├── scss/
│   └── _variables.scss     # SCSS design variables (colors, fonts, shadows)
└── generate_1000_books.js  # Automated dataset generation script
```

---

## 🚀 Getting Started

### Option 1: Live Server (VS Code)
1. Open the project folder in VS Code.
2. Right-click `index.html` and click **"Open with Live Server"**.

### Option 2: Node.js HTTP Server
Run the following command in your terminal:
```bash
npx http-server . -c-1 -p 8080
```
Then visit [http://localhost:8080](http://localhost:8080) in your web browser.

---

## 👤 Author
- **GitHub:** [@thirumuruganravi](https://github.com/thirumuruganravi)
