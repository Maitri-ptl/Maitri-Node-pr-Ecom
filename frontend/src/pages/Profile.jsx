import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import UserContext from '../context/user/UserContext'
import apiInstance from '../api/apiInstance.js'

const Profile = () => {
  const { setIsLogin, user, setUser } = useContext(UserContext)
  const [profile, setProfile] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem('token')
        const userData = token && JSON.parse(atob(token.split('.')[1]))

        if (!userData?.id) {
          navigate('/login')
          return
        }

        const response = await apiInstance.get(`/user/profile/${userData.id}`)
        setProfile(response.data.user)
      } catch (error) {
        toast.error(error.response?.data?.message || 'Could not load your profile')
      }
    }

    loadProfile()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLogin(false)
    setUser({})
    toast.success('Logged out')
    navigate('/login')
  }

  const account = profile || user
  const displayName = account.name || 'User'
  const accountDetails = [
    { label: 'Email address', value: account.email || 'Not available', icon: 'bi-envelope' },
    { label: 'Account role', value: account.role || 'customer', icon: 'bi-shield-check' },
    { label: 'Member since', value: account.createdAt ? new Date(account.createdAt).toLocaleDateString() : 'Not available', icon: 'bi-calendar3' }
  ]

  return (
    <main className="container py-4 py-lg-5"><div className="row justify-content-center"><div className="col-lg-8"><div className="card border-0 shadow-sm overflow-hidden">
      <div className="card-body bg-primary text-white p-4 p-md-5"><div className="d-flex align-items-center gap-3"><div className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold fs-2" style={{ width: 72, height: 72 }}>{displayName.charAt(0).toUpperCase()}</div><div><p className="mb-1 opacity-75">Account profile</p><h1 className="h3 mb-1">{displayName}</h1><span className="badge text-bg-light text-capitalize">{account.role || 'customer'}</span></div></div></div>
      <div className="card-body p-4 p-md-5"><h2 className="h5 mb-3">Personal information</h2><div className="list-group list-group-flush mb-4">{accountDetails.map((detail) => (<div className="list-group-item px-0 py-3 d-flex align-items-center gap-3" key={detail.label}><i className={`bi ${detail.icon} text-primary fs-5`}></i><div><div className="small text-secondary">{detail.label}</div><div className="fw-semibold text-capitalize">{detail.value}</div></div></div>))}</div><button className="btn btn-outline-danger" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i>Log out</button></div>
    </div></div></div></main>
  )
}

export default Profile
