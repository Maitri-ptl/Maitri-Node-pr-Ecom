import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Cart from './pages/Cart'
import SingleProduct from './pages/SingleProduct'
import Dashboard from './pages/Dashboard'
import AddCategory from './pages/AddCategory'
import AddProduct from './pages/AddProduct'
import ViewCategory from './pages/ViewCategory'
import ViewProduct from './pages/ViewProduct'
import { ToastContainer } from 'react-toastify'
import './App.css'

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/product/:id' element={<SingleProduct />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/dashboard/add-category' element={<AddCategory />} />
        <Route path='/dashboard/add-product' element={<AddProduct />} />
        <Route path='/dashboard/view-category' element={<ViewCategory />} />
        <Route path='/dashboard/view-product' element={<ViewProduct />} />
      </Routes>

      <footer className="fk-footer">
        <p className="mb-0">© 2026 Flipkart Clone</p>
      </footer>

      <ToastContainer position="bottom-right" autoClose={2000} />
    </>
  )
}

export default App
