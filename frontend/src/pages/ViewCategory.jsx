import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import apiInstance from '../api/apiInstance.js'
import { toast } from 'react-toastify'

const ViewCategory = () => {

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

  const editCategory = async (category) => {
    const newName = window.prompt('Enter new category name', category.name)
    if (!newName) return
    try {
      const res = await apiInstance.put(`/category/update/${category._id}`, { name: newName })
      toast.success(res.data.message)
      getCategories()
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Something went wrong')
    }
  }

  const deleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return
    try {
      const res = await apiInstance.delete(`/category/delete/${id}`)
      toast.success(res.data.message)
      getCategories()
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className="fk-page">
      <div className="fk-section">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fk-section-title mb-0">All Categories</h4>
          <Link to="/dashboard/add-category" className="fk-form-btn text-decoration-none">+ Add Category</Link>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Category Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr key={category._id}>
                  <td>{index + 1}</td>
                  <td>{category.name}</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => editCategory(category)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteCategory(category._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {categories.length === 0 && <p className="text-center">No categories found..</p>}
      </div>
    </div>
  )
}

export default ViewCategory
