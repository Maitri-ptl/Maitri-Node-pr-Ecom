import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import apiInstance from '../api/apiInstance.js'

const dashboardActions = [
  { icon: 'bi-plus-circle', title: 'Add category', description: 'Create a new product group', path: '/dashboard/add-category', color: 'primary' },
  { icon: 'bi-tags', title: 'Manage categories', description: 'Review and organise categories', path: '/dashboard/view-category', color: 'info' },
  { icon: 'bi-bag-plus', title: 'Add product', description: 'Add a product to your catalogue', path: '/dashboard/add-product', color: 'success' },
  { icon: 'bi-box-seam', title: 'Manage products', description: 'Edit or remove listed products', path: '/dashboard/view-product', color: 'warning' }
]

const Dashboard = () => {
  const [storeStats, setStoreStats] = useState({ products: 0, categories: 0, customers: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const token = localStorage.getItem('token')
        const userData = token && JSON.parse(atob(token.split('.')[1]))

        if (userData?.role !== 'admin') {
          throw new Error('Admin access is required')
        }

        const [productResponse, categoryResponse, userResponse] = await Promise.all([
          apiInstance.get('/product/get-all'),
          apiInstance.get('/category/get-all'),
          apiInstance.get('/user/get-all/')
        ])

        setStoreStats({
          products: productResponse.data.products?.length || 0,
          categories: categoryResponse.data.categories?.length || 0,
          customers: userResponse.data.users?.length || 0
        })
      } catch (error) {
        if (error.message === 'Admin access is required') {
          toast.error('Only administrators can access the dashboard')
          navigate('/login')
          return
        }
        toast.error('Could not load dashboard statistics')
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboard()
  }, [navigate])

  const statCards = [
    { label: 'Products', value: storeStats.products, icon: 'bi-box-seam', color: 'primary' },
    { label: 'Categories', value: storeStats.categories, icon: 'bi-tags', color: 'info' },
    { label: 'Customers', value: storeStats.customers, icon: 'bi-people', color: 'success' }
  ]

  return (
    <main className="container py-4 py-lg-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <p className="text-primary fw-semibold text-uppercase small mb-1">Store management</p>
          <h1 className="h2 mb-1">Dashboard</h1>
          <p className="text-secondary mb-0">A quick view of your catalogue and customers.</p>
        </div>
        <Link to="/dashboard/add-product" className="btn btn-primary"><i className="bi bi-plus-lg me-2"></i>Add product</Link>
      </div>

      <div className="row g-3 mb-4">
        {statCards.map((stat) => (
          <div className="col-md-4" key={stat.label}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <span className={`bg-${stat.color}-subtle text-${stat.color} rounded-3 p-3`}><i className={`bi ${stat.icon} fs-4`}></i></span>
                <div><div className="text-secondary small">{stat.label}</div><div className="fs-3 fw-bold">{isLoading ? 'Loading...' : stat.value}</div></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-0 shadow-sm"><div className="card-body p-4">
        <h2 className="h5 mb-1">Quick actions</h2><p className="text-secondary small mb-4">Keep your store current.</p>
        <div className="row g-3">
          {dashboardActions.map((action) => (
            <div className="col-sm-6" key={action.title}><Link to={action.path} className="card h-100 text-decoration-none text-body border rounded-3"><div className="card-body d-flex gap-3"><i className={`bi ${action.icon} text-${action.color} fs-3`}></i><div><h3 className="h6 mb-1">{action.title}</h3><p className="small text-secondary mb-0">{action.description}</p></div></div></Link></div>
          ))}
        </div>
      </div></div>
    </main>
  )
}

export default Dashboard
