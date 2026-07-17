import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import apiInstance from '../api/apiInstance.js'
import { toast } from 'react-toastify'

const AddCategory = () => {

  const [name, setName] = useState('')
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
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    createCategory()
  }

  const createCategory = async () => {
    try {
      const res = await apiInstance.post('/category/create', { name })
      toast.success(res.data.message)
      setName('')
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className="fk-page">
      <div className="fk-form-card">
        <h4 className="fk-section-title">Add Category</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Category Name</label>
            <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <button type="submit" className="fk-form-btn">Add Category</button>
          <Link to="/dashboard" className="btn btn-light ms-2">Back</Link>
        </form>
      </div>
    </div>
  )
}

export default AddCategory
