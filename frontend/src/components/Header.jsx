import { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import UserContext from '../context/user/UserContext'
import { toast } from 'react-toastify'
import apiInstance from '../api/apiInstance.js'

const Header = () => {
    const { isLogin, setIsLogin, user, setUser } = useContext(UserContext)
    const [search, setSearch] = useState('')
    const [cartCount, setCartCount] = useState(0)
    const navigate = useNavigate()
    const location = useLocation() // re-render on route change taki cart count fresh lage

    useEffect(() => {
        if (!isLogin) return
        const fetchCartCount = async () => {
            try {
                const res = await apiInstance.get('/cart/get')
                setCartCount((res.data.cart || []).reduce((total, item) => total + item.quantity, 0))
            } catch (error) { console.log(error) }
        }
        fetchCartCount()
    }, [isLogin, location])

    const handleLogout = () => {
        localStorage.removeItem('token')
        setIsLogin(false)
        setUser({})
        setCartCount(0)
        toast.success('Logged out')
        navigate('/login')
    }

    const handleSearch = (e) => {
        e.preventDefault()
        navigate(`/?q=${search}`)
    }

    return (
        <header className="fk-header">
            <div className="fk-header-inner">
                <Link to="/" className="fk-logo">Flipkart</Link>

                <form className="fk-search" onSubmit={handleSearch}>
                    <button type="submit"><i className="bi bi-search"></i></button>
                    <input
                        type="text"
                        placeholder="Search for Products, Brands and More"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </form>

                <nav className="fk-nav">
                    {!isLogin && (
                        <Link to="/login" className="fk-nav-link">
                            <i className="bi bi-person"></i> Login
                        </Link>
                    )}

                    {isLogin && (
                        <div className="dropdown">
                            <button className="fk-nav-link dropdown-toggle" data-bs-toggle="dropdown">
                                <i className="bi bi-person"></i> {user.name || 'Account'}
                            </button>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/profile"><i className="bi bi-person me-2"></i>My Profile</Link></li>
                                {user.role == 'admin' && (
                                    <li><Link className="dropdown-item" to="/dashboard"><i className="bi bi-speedometer2 me-2"></i>Dashboard</Link></li>
                                )}
                                <li><hr className="dropdown-divider" /></li>
                                <li><button className="dropdown-item" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i>Logout</button></li>
                            </ul>
                        </div>
                    )}

                    <Link to="/cart" className="fk-nav-link">
                        <i className="bi bi-cart3"></i> Cart
                        {cartCount > 0 && <span className="fk-cart-count">{cartCount}</span>}
                    </Link>
                </nav>
            </div>
        </header>
    )
}

export default Header
