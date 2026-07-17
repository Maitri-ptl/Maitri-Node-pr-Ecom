import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import apiInstance from '../api/apiInstance.js'
import { toast } from 'react-toastify'

const AddProduct = () => {

  const [form, setForm] = useState({})
  const [categories, setCategories] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    // only admin can access
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (payload.role !== 'admin') {
      toast.error('Only admin can access this page')
      navigate('/')
      return
    }
    getCategories()
  }, [])

  const getCategories = async () => {
    try {
      const res = await apiInstance.get('/category/get-all')
      setCategories(res.data.categories)
    } catch (error) {
      console.log(error);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    createProduct()
  }

  const createProduct = async () => {
    try {
      const res = await apiInstance.post('/product/create', form)
      toast.success(res.data.message || 'Product created successfully')
      setForm({})
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className="fk-page">
      <div className="fk-form-card">
        <h4 className="fk-section-title">Add Product</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Product Name</label>
            <input type="text" className="form-control" id="name" name="name" value={form.name || ''} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="price" className="form-label">Price (₹)</label>
            <input type="number" className="form-control" id="price" name="price" value={form.price || ''} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea className="form-control" id="description" name="description" rows="3" value={form.description || ''} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="image" className="form-label">Image URL</label>
            <input type="url" className="form-control" id="image" name="image" placeholder="https://example.com/product.jpg" value={form.image || ''} onChange={handleChange} />
            <small className="text-muted">Paste a product image link (right click any image online and copy image address)</small>
          </div>
          <div className="mb-3">
            <label htmlFor="category" className="form-label">Category</label>
            <select className="form-select" id="category" name="category" value={form.category || ''} onChange={handleChange} required>
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option value={cat._id} key={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="fk-form-btn">Add Product</button>
          <Link to="/dashboard" className="btn btn-light ms-2">Back</Link>
        </form>
      </div>
    </div>
  )
}

export default AddProduct
