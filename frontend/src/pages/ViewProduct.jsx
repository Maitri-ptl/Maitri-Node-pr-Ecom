import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import apiInstance from '../api/apiInstance.js'
import { toast } from 'react-toastify'

const ViewProduct = () => {

  const [products, setProducts] = useState([])
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
    getProducts()
  }, [])

  const getProducts = async () => {
    try {
      const res = await apiInstance.get('/product/get-all')
      setProducts(res.data.products)
    } catch (error) {
      console.log(error);
    }
  }

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      const res = await apiInstance.delete(`/product/delete/${id}`)
      toast.success(res.data.message)
      getProducts()
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className="fk-page">
      <div className="fk-section">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fk-section-title mb-0">All Products</h4>
          <Link to="/dashboard/add-product" className="fk-form-btn text-decoration-none">+ Add Product</Link>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product._id}>
                  <td>{index + 1}</td>
                  <td>{product.name}</td>
                  <td>₹{product.price}</td>
                  <td>{product.category?.name}</td>
                  <td>{product.description}</td>
                  <td>
                    <Link to={`/product/${product._id}`} className="btn btn-sm btn-primary me-2">View</Link>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteProduct(product._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {products.length === 0 && <p className="text-center">No products found..</p>}
      </div>
    </div>
  )
}

export default ViewProduct
