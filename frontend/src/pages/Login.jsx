import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import apiInstance from "../api/apiInstance.js"
import { toast } from 'react-toastify';
import UserContext from '../context/user/UserContext.js';

const Login = () => {

    const [form, setform] = useState({});
    const navigate = useNavigate();
    const { setIsLogin, setUser } = useContext(UserContext)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setform({ ...form, [name]: value })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        loginUser(form);
    }

    const loginUser = async (user) => {
        try {
            const res = await apiInstance.post('/user/login', user)
            toast.success(res.data.message)
            localStorage.setItem('token', res.data.token)
            /**  We use this line to decode the JWT token and extract the payload, which contains user information such as the user ID, name, email, or role. This allows the frontend to identify the logged-in user or perform role-based navigation without making another API request.*/
            const payload = JSON.parse(atob(res.data.token.split('.')[1]))
            /** If we don't use it:
            The application can still authenticate by sending the token to the backend, but it won't be able to directly read user details stored inside the token unless it calls another API or decodes the token later. */
            
            setUser({ userId: payload.id, name: payload.name, role: payload.role })
            setIsLogin(true);
            navigate('/');

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Login failed')
        }
    }

    return (
        <div className="fk-auth-wrapper">
            <div className="fk-auth-card">
                <div className="fk-auth-left">
                    <h3>Login</h3>
                    <p>Get access to your Orders, Wishlist and Recommendations</p>
                </div>
                <div className="fk-auth-right">
                    <form onSubmit={handleSubmit}>
                        <input type="email" placeholder="Enter Email" onChange={handleChange} value={form.email || ''} name='email' required />
                        <input type="password" placeholder="Enter Password" onChange={handleChange} value={form.password || ''} name='password' required />
                        <button type="submit" className="fk-auth-btn">Login</button>
                    </form>
                    <Link to="/register" className="fk-auth-link">New to Flipkart? Create an account</Link>
                </div>
            </div>
        </div>
    )
}

export default Login
