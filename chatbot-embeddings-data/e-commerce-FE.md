# Atelier Store — App Summary

## What Is Atelier Store?

Atelier Store is a **premium frontend-only e-commerce storefront** built for a fictional luxury goods brand. It simulates a complete shopping experience — browsing a curated catalog, viewing product details, managing a wishlist and cart, and completing a checkout — entirely in the browser with no backend or real payment processing.

---

## Tech Stack

| Layer       | Technology                             |
| ----------- | -------------------------------------- |
| Framework   | React 18 (SPA)                         |
| Language    | JavaScript (JSX)                       |
| Bundler     | Vite 5                                 |
| Routing     | React Router DOM v6                    |
| Styling     | CSS Modules + global CSS variables     |
| State       | React `useState` / `useCallback` hooks |
| Persistence | `localStorage` (cart + wishlist)       |
| Runtime     | Node 18+ (dev only)                    |

---

## Product Catalogue

6 products across 6 categories, each with a thumbnail, 3-image gallery, color swatches, rating, review count, badge, and details list.

| #   | Product             | Category      | Price   | Status                       |
| --- | ------------------- | ------------- | ------- | ---------------------------- |
| 1   | Oud Noir Parfum     | Fragrance     | $320    | In stock · Bestseller        |
| 2   | Silk Cashmere Wrap  | Accessories   | $485    | In stock · New               |
| 3   | Tourbillon Watch    | Watches       | $12,400 | In stock · Limited           |
| 4   | Leather Folio Case  | Leather Goods | $195    | In stock                     |
| 5   | Marble & Brass Tray | Home          | $275    | Out of stock · Editor's Pick |
| 6   | Bergamot Body Oil   | Wellness      | $88     | In stock · Cult Classic      |

Categories: `All` · `Fragrance` · `Accessories` · `Watches` · `Leather Goods` · `Home` · `Wellness`

---

## Pages & Routes

| Route          | Page                | Description                                                                         |
| -------------- | ------------------- | ----------------------------------------------------------------------------------- |
| `/`            | `HomePage`          | Hero carousel, marquee bar, category showcase, featured products, editorial banner  |
| `/catalog`     | `CatalogPage`       | Full product grid with category + search filtering via URL params                   |
| `/product/:id` | `ProductDetailPage` | Image gallery, color swatches, qty selector, add-to-cart, related products          |
| `/wishlist`    | `WishlistPage`      | Saved products, move-to-cart, clear wishlist                                        |
| `/checkout`    | `CheckoutPage`      | Multi-step form (details → payment → confirmation), shipping options, order summary |
| `*`            | `NotFoundPage`      | 404 fallback                                                                        |

---

## Core Features

### Shopping Cart

- Add, remove, update quantity
- Persisted to `localStorage` via `useCart` hook
- Slide-in `CartOverlay` accessible from any page
- Cart icon badge with bounce animation on add
- Free shipping auto-applied on orders over $200

### Wishlist

- Toggle products in/out of wishlist
- Persisted to `localStorage` via `useWishlist` hook
- Live count badge in navbar
- Move individual items to cart from wishlist page

### Checkout Flow

- **Step 1** — Shipping details (name, address, country)
- **Step 2** — Payment details (card number, expiry, CVV) + shipping speed selector (Standard free / Express $18 / Overnight $42)
- **Step 3** — Order confirmation screen with random order reference, auto-clears cart

### Product Detail

- 3-image gallery with zoom-on-click
- Color swatch selector
- Quantity stepper with Add to Cart / added feedback state
- Stock badge (out-of-stock disables add button)
- Related products (same category, up to 3)
- Breadcrumb navigation

### Navigation & UI

- **AnnouncementBar** — rotating promotional messages (4 items, 3.8 s interval, fade transition)
- **Navbar** — scrolled shadow, category strip with URL-param driven active state, search overlay, cart + wishlist icons, mobile menu
- **Footer** — newsletter signup, collection/company/support link columns, social icons
- **Toast notifications** — success/wishlist toasts on cart add and wishlist toggle
- **Marquee bar** — infinitely scrolling promotional strip on the homepage

### Filtering & Search

- Category filter via URL query param (`?category=Watches`)
- Keyword search via URL query param (`?search=oud`)
- Filter state lives in the URL — shareable and back-button safe

---

## Custom Hooks

| Hook          | Purpose                                                                      |
| ------------- | ---------------------------------------------------------------------------- |
| `useCart`     | Cart state, add/remove/update/clear, `localStorage` sync, badge bounce       |
| `useWishlist` | Wishlist toggle, `isWishlisted` lookup, `localStorage` sync                  |
| `useScrolled` | Returns `true` once page scroll exceeds a threshold (used for navbar shadow) |
| `useInView`   | Intersection Observer wrapper for scroll-triggered animations                |

---

## Utility Helpers (`src/utils/helpers.js`)

| Function                             | Description                                            |
| ------------------------------------ | ------------------------------------------------------ |
| `formatPrice(amount)`                | Formats a number as a USD string — `12400 → "$12,400"` |
| `discountPercent(original, current)` | Calculates percentage discount between two prices      |
| `clamp(value, min, max)`             | Clamps a number within a min/max range                 |

---

## Static Assets

All product and hero images are stored locally in `public/images/` (28 files). The `download-images.js` script in the project root was used to download them from Unsplash and rewrite all source file URLs to local paths — the app makes no external image requests at runtime.

---

## Project Structure

```
atelier-store/
├── public/images/          # 28 locally downloaded product + hero images
├── src/
│   ├── App.jsx             # Router, shared state, layout wrapper
│   ├── main.jsx            # React entry point (BrowserRouter)
│   ├── components/         # AnnouncementBar, Navbar, CartOverlay, Footer,
│   │                       # ProductCard, ProductGrid, Stars, Toast, WishlistButton
│   ├── data/products.js    # Product array, CATEGORIES, ANNOUNCEMENTS
│   ├── hooks/              # useCart, useWishlist, useScrolled, useInView
│   ├── pages/              # HomePage, CatalogPage, ProductDetailPage,
│   │                       # WishlistPage, CheckoutPage, NotFoundPage
│   ├── styles/global.css   # CSS custom properties, reset, global keyframes
│   └── utils/helpers.js    # formatPrice, discountPercent, clamp
├── download-images.js      # One-time script: downloads Unsplash images locally
├── vite.config.js          # Vite config (React plugin, port 3000)
└── package.json
```

---

## Quickstart

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
```

---

## Summary

Atelier Store is a fully self-contained luxury e-commerce frontend. There is no backend, no authentication, and no real payment system — all state lives in the browser via React hooks and `localStorage`. It demonstrates a complete shopping UX: catalog browsing with URL-driven filtering, a multi-image product detail view, persistent cart and wishlist, a multi-step checkout flow, and polished UI transitions throughout.
