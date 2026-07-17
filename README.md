# 🛍️ Maitri - Flipkart clone

A full-stack **Flipcart Clone** application built using the **MERN Stack**. The platform allows users to browse products, manage their cart, authenticate securely using JWT, and provides an admin panel to manage categories and products.

---

## 🚀 Features

### 👤 User Features

- User Registration & Login
- JWT Authentication
- Browse All Products
- View Product Details
- Browse Products by Category
- Add Products to Cart
- Update Cart Quantity
- Remove Products from Cart
- Protected Routes
- Responsive User Interface

### 🛠️ Admin Features

- Admin Authentication
- Create Categories
- Update Categories
- Delete Categories
- Add Products
- Update Products
- Delete Products
- Manage Product Listings

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- React Router DOM
- Axios
- Bootstrap 5
- React Toastify

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt.js
- Express Validator

---

## 📁 Project Structure

```
Maitri-Node-pr-Ecom
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── backend
│   ├── configs
│   ├── controllers
│   ├── middlewares
│   ├── models
│   ├── routers
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/Maitri-ptl/Maitri-Node-pr-Ecom.git
```

```bash
cd Maitri-Node-pr-Ecom
```

---

### 2. Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd ../frontend
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside the **backend** folder.

```env
PORT=3000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

---

## ▶️ Run the Project

### Start Backend

```bash
cd backend
npm run dev
```

### Start Frontend

```bash
cd frontend
npm run dev
```

---

## 📡 API Modules

### Authentication

- Register User
- Login User

### Categories

- Create Category
- Get Categories
- Update Category
- Delete Category

### Products

- Create Product
- Get All Products
- Get Product By ID
- Update Product
- Delete Product

### Cart

- Add to Cart
- Get User Cart
- Update Cart
- Remove Item

---

## 🔒 Authentication

The project uses **JSON Web Token (JWT)** for secure authentication.

Protected APIs require the JWT token in the request header.

```
Authorization: Bearer <token>
```

---

## 📷 Screenshots

### Home Page
![Home Page](ss/Homepage.png)

### Full Home Page
![Full Home Page](ss/FullHomepage.png)

### Register Page
![Register Page](ss/SignUpPage.png)

### Login Page
![Login Page](ss/LoginPage.png)

### Cart Page
![Cart Page](ss/CartPage.png)

### Full Cart Page
![Full Cart Page](ss/CartFull.png)

### Dashboard
![Dashboard](ss/Dashboard.png)

### Add Product Page
![Add Product Page](ss/AddProductPage.png)

### View Products Page
![View Products Page](ss/ViewProductPage.png)

### Add Category Page
![Add Category Page](ss/AddCategory.png)

### Single Product Page
![Single Product Page](ss/SingleProduct.png)

### View Category Page
![View Category Page](ss/ViewCategory.png)

## ViewCategories
![alt text](image-9.png)

```

---

## 🎥 Demo Video

```
https://your-demo-video-link.com
```

---

## 📌 Future Improvements

- Wishlist
- Order Management
- Payment Gateway Integration
- Product Search
- Product Filters
- Product Reviews & Ratings
- Image Upload using Cloudinary
- User Profile
- Order History
- Admin Dashboard Analytics

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Maitri Patel**

Full Stack Developer

GitHub: https://github.com/Maitri-ptl

LinkedIn: www.linkedin.com/in/maitri-patel-1a6406375
