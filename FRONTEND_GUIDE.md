# Flipkart Clone — Frontend Guide

This file explains **what was built**, **how it works**, and **why it was done that way**, so you can review, test, and learn from it.

---

## 1. Big Picture

- **Backend** (already built by you): Node + Express + MongoDB, running on `http://localhost:3000/api`
- **Frontend**: React (Vite) + Bootstrap + one custom CSS file
- **Only 1 new file was created**: `frontend/src/App.css` — every other change was made inside your existing files.

### File map (what changed)

```
frontend/src/
├── App.css                  ← NEW (all Flipkart styles live here)
├── App.jsx                  ← all routes added + footer
├── components/
│   └── Header.jsx           ← Flipkart blue navbar
├── context/user/
│   └── UserContextProvider.jsx  ← reads token on page load
└── pages/
    ├── Home.jsx             ← category strip + banner + product grid
    ├── Login.jsx            ← Flipkart style login card
    ├── Register.jsx         ← Flipkart style register card
    ├── Profile.jsx          ← fetches real profile from API
    ├── SingleProduct.jsx    ← product detail + Add to Cart / Buy Now
    ├── Cart.jsx             ← cart page (localStorage based)
    ├── Dashboard.jsx        ← admin only, counts + manage links
    ├── AddCategory.jsx      ← admin form
    ├── AddProduct.jsx       ← admin form with category dropdown
    ├── ViewCategory.jsx     ← admin table (edit / delete)
    └── ViewProduct.jsx      ← admin table (view / delete)

backend/controllers/product.controller.js  ← 1 line bug fix (see section 10)
```

---

## 2. Routes (App.jsx)

All pages are connected with `react-router-dom`:

| URL | Page | Who can open |
|---|---|---|
| `/` | Home | everyone |
| `/login` | Login | everyone |
| `/register` | Register | everyone |
| `/profile` | Profile | logged in user |
| `/cart` | Cart | everyone |
| `/product/:id` | SingleProduct | everyone |
| `/dashboard` | Dashboard | **admin only** |
| `/dashboard/add-category` | AddCategory | **admin only** |
| `/dashboard/add-product` | AddProduct | **admin only** |
| `/dashboard/view-category` | ViewCategory | **admin only** |
| `/dashboard/view-product` | ViewProduct | **admin only** |

`App.jsx` also imports `./App.css` once — that's how the styles apply to the whole app.

---

## 3. The Header (Header.jsx)

Copy of the **new** Flipkart navbar (white design):

- White bar with the yellow pill **Flipkart** logo (blue italic text)
- Rounded grey **search bar** with a search icon
- **Login** link when logged out → becomes an **account dropdown** (with the user's name) when logged in
- **Cart** link with a red count badge
- **Dashboard** link appears in the dropdown *only for admins*

All icons come from **Bootstrap Icons** — a free icon font loaded with one `<link>` tag in `index.html`. You use an icon by writing `<i className="bi bi-cart3"></i>` (find names at https://icons.getbootstrap.com).

### How search works (simple trick)

The header doesn't filter anything itself. On submit it just changes the URL:

```js
navigate(`/?q=${search}`)
```

Then **Home.jsx** reads that `q` value from the URL and filters the products. This is a very common beginner-friendly pattern: *pass data between pages through the URL*.

### Why `useLocation()` is called in Header

```js
useLocation() // re-render on route change so cart count stays fresh
```

The cart count is read from localStorage. localStorage is **not reactive** — React doesn't know when it changes. Calling `useLocation()` makes the Header re-render every time you navigate to another page, so the count refreshes. Simple, not perfect, but good enough for this project.

---

## 4. Login State & Roles (the JWT trick)

**Problem:** your login API only returns `userId` and `token` — no name, no role. But the Header needs the name, and the Dashboard needs to know if the user is admin.

**Solution:** the JWT token *already contains* that data. Your backend puts this payload inside it:

```js
const payload = { id: user.id, name: user.name, role: user.role }
```

A JWT looks like `xxxxx.yyyyy.zzzzz` — the middle part (`yyyyy`) is just **base64-encoded JSON**. So the frontend can decode it with one line:

```js
const payload = JSON.parse(atob(token.split('.')[1]))
// payload = { id: "...", name: "...", role: "admin" }
```

- `token.split('.')[1]` → takes the middle part
- `atob(...)` → decodes base64 to a string
- `JSON.parse(...)` → turns the string into an object

This is used in **3 places**:

1. **Login.jsx** — right after login, to put name/role into context
2. **UserContextProvider.jsx** — on page load/refresh, so login state **survives a refresh** (before this, refreshing the page logged you out visually)
3. **Every admin page** — to check the role (see next section)

> Note: decoding a token on the frontend is only for *showing/hiding UI*. Real security is still on the backend — your `verifyToken` + `adminAuth` middlewares reject non-admin API calls even if someone bypasses the frontend check.

---

## 5. Admin Protection (Dashboard + 4 admin pages)

Every admin page starts with the same small guard inside `useEffect`:

```js
useEffect(() => {
  const token = localStorage.getItem('token')
  if (!token) {              // not logged in → go to login
    navigate('/login')
    return
  }
  const payload = JSON.parse(atob(token.split('.')[1]))
  if (payload.role !== 'admin') {   // logged in but not admin → kick out
    toast.error('Only admin can access this page')
    navigate('/')
    return
  }
  // ...only then load the page data
}, [])
```

Yes, this code is repeated in 5 files. A senior dev would make a `<ProtectedRoute>` component — but that would need a new file, and repeating a small guard is perfectly fine (and easier to understand) at this level.

---

## 6. Home Page (Home.jsx)

Flipkart-style sections, top to bottom:

1. **Category menu** — icon + label row with a blue underline on the active one. Category names are *derived from products*:
   ```js
   const categories = [...new Set(products.map((p) => p.category?.name))]
   ```
   Why not call `/category/get-all`? Because in your backend that route is mounted with `verifyToken + adminAuth` — **normal users can't call it**. But `/product/get-all` is public and each product is populated with its category, so we collect unique category names from there. `new Set()` removes duplicates.

2. **Coupon ticket** — the blue "Exclusive coupon" card, pure CSS (the dashed line in the middle is just `border-right: 2px dashed`).

3. **Promo banner row** — three gradient cards, pure CSS, no images needed.

4. **Product shelves** — one colored section per category ("Best of Electronics" etc.), each a **horizontally scrollable** row (`display: flex; overflow-x: auto`) of product cards. The background colors rotate from a small array.

5. **Product grid** — responsive CSS grid with all/filtered products. Each card links to `/product/:id`.

Filtering (search + category) is done in the frontend with one filter:

```js
const filteredProducts = products.filter((p) => {
  const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
  const matchCategory = category === '' || p.category?.name === category
  return matchSearch && matchCategory
})
```

**Product images:** the Product model now has an `image` field (a plain URL string). When adding a product in the admin panel you paste an image link, and every page shows it. If a product has no image saved, a placeholder is shown instead:

```js
const getImage = (product) => {
  return product.image || `https://placehold.co/300x300/f5f7fa/2874f0?text=${product.name}`
}
```

This needed 3 small edits: `image: { type: String }` in `product.model.js`, accepting `image` in `createProducts` in the controller, and an "Image URL" input in `AddProduct.jsx`. Old products without images keep working because of the `||` fallback.

---

## 7. Single Product + Cart (localStorage cart)

**Why localStorage?** Your backend `cart.route.js` is empty (no APIs yet). Instead of blocking on that, the cart lives in the browser's localStorage as a JSON array:

```js
// read
const cart = JSON.parse(localStorage.getItem('cart')) || []
// write
localStorage.setItem('cart', JSON.stringify(cart))
```

### Add to cart (SingleProduct.jsx)

```js
const existing = cart.find((item) => item._id === product._id)
if (existing) {
  existing.qty += 1        // already in cart → just increase qty
} else {
  cart.push({ ...product, qty: 1 })   // new item → add with qty 1
}
```

**Buy Now** = Add to Cart + navigate to `/cart`. Same as Flipkart.

### Cart page (Cart.jsx)

- `+` / `−` buttons change qty (`−` never goes below 1)
- REMOVE filters the item out of the array
- Totals are computed with `reduce`:
  ```js
  const totalPrice = cart.reduce((total, item) => total + item.price * item.qty, 0)
  ```
- **Price Details** box copies Flipkart (Price / Discount / Delivery Free / Total)
- **PLACE ORDER** just clears the cart and shows a toast (no order API exists)

Every change updates **both** React state (so UI refreshes) **and** localStorage (so it survives refresh) through one helper:

```js
const updateCart = (newCart) => {
  setCart(newCart)
  localStorage.setItem('cart', JSON.stringify(newCart))
}
```

Later, when you build the cart backend, you only need to swap these localStorage calls with `apiInstance` calls — the UI stays the same.

---

## 8. Admin Pages

- **Dashboard.jsx** — two count cards (total products / categories, fetched from the APIs) + four link cards to the manage pages.
- **AddCategory.jsx** — one input → `POST /category/create`.
- **AddProduct.jsx** — name, price, description + a **category dropdown**. The dropdown is filled from `GET /category/get-all` (works here because admin is logged in). The `<option value={cat._id}>` sends the category **ObjectId**, which is what your Product model expects.
- **ViewCategory.jsx** — table with **Edit** (uses `window.prompt` → `PUT /category/update/:id`) and **Delete** (`window.confirm` → `DELETE /category/delete/:id`).
- **ViewProduct.jsx** — table with View link and Delete button.

`window.prompt` / `window.confirm` are built-in browser popups — the simplest possible way to do edit/confirm without building modals.

---

## 9. The CSS (App.css)

One file, all classes prefixed with `fk-` (flipkart) so they never clash with Bootstrap.

### Flipkart's actual colors (worth memorizing)

| Color | Where |
|---|---|
| `#2874f0` | flipkart blue — links, active category, dashboard |
| `#ffe11b` | yellow logo pill in the header |
| `#fb641e` | orange — Buy Now / Login / Place Order buttons |
| `#ff9f00` | yellow-orange — Add to Cart button |
| `#388e3c` | green — rating badge |
| `#f1f3f6` | grey page background |
| `#172337` | dark navy footer |

### Responsive techniques used

1. **CSS Grid with `auto-fill`** — the product grid needs **zero media queries**:
   ```css
   grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
   ```
   "Fit as many 180px+ columns as possible" — 6 on desktop, 2 on phone, automatically.

2. **Flexbox + `flex-wrap`** — header, cart layout, single product all wrap onto new lines when the screen is narrow.

3. **One media query** (`max-width: 768px`) for the special cases:
   - search bar: `order: 3; flex-basis: 100%` → drops to a full-width second row (exactly like Flipkart mobile)
   - login/register card: `flex-direction: column` → blue panel stacks on top of the form

4. `position: sticky; top: 0` keeps the header visible while scrolling.

---

## 10. Backend Bug That Was Fixed

In `backend/controllers/product.controller.js`, `createProducts` created the product but **never sent a response**:

```js
const product = await Product.create({...})
// nothing here! ← request hangs forever
```

The frontend `await` would wait forever and the Add Product form would look frozen. Fix (one line):

```js
return res.status(201).json({ message: "Product created successfully", product })
```

**Lesson:** every Express route handler must end with exactly one `res.something(...)`, otherwise the browser waits until timeout.

---

## 11. How To Run & Test

```bash
# terminal 1
cd backend
npm run dev        # or: node index.js  → http://localhost:3000

# terminal 2
cd frontend
npm run dev        # → http://localhost:5173
```

### Test checklist

1. **Register** a user → **Login** → your name appears in the header dropdown.
2. Refresh the page → still logged in (context reads the token on load).
3. **Make an admin**: in MongoDB (Compass/shell), edit your user document and set `role: "admin"`, then log out and log in again (the role lives inside the token, so you need a fresh token).
4. As admin: open **Dashboard** → Add Category → Add Product (pick the category in the dropdown).
5. Go to **Home** → products appear in the grid, category strip shows your categories.
6. Search something in the header → grid filters.
7. Click a product → **ADD TO CART** → cart badge count goes up → open Cart → change qty, remove, **PLACE ORDER**.
8. Log in as a normal user and try opening `/dashboard` directly → you get kicked to home with a toast.

---

## 12. Ideas To Improve Later (good practice tasks)

- Build the real cart APIs in `cart.route.js` and swap localStorage for API calls in Cart.jsx.
- Make a `<ProtectedRoute>` wrapper component instead of repeating the admin guard 5 times.
- Add an Edit Product form (the backend `PUT /product/update/:id` already exists).
- Handle expired tokens: the token expires in 1 hour — decode it and check `payload.exp` before trusting it.
