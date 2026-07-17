import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import apiInstance from "../api/apiInstance.js"
import { toast } from 'react-toastify';

const Register = () => {

    const [form, setform] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setform({ ...form, [name]: value })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        registerUser(form);
    }

    const registerUser = async (user) => {
        try {
            const res = await apiInstance.post('/user/register', user)
            toast.success(res.data.message)
            navigate('/login')

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Register failed')
        }
    }

    return (
        <div className="fk-auth-wrapper">
            <div className="fk-auth-card">
                <div className="fk-auth-left">
                    <h3>Looks like you're new here!</h3>
                    <p>Sign up to get started with the best shopping experience</p>
                </div>
                <div className="fk-auth-right">
                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder="Enter Name" onChange={handleChange} value={form.name || ''} name='name' required />
                        <input type="email" placeholder="Enter Email" onChange={handleChange} value={form.email || ''} name='email' required />
                        <input type="password" placeholder="Enter Password" onChange={handleChange} value={form.password || ''} name='password' required />
                        <button type="submit" className="fk-auth-btn">Register</button>
                    </form>
                    <Link to="/login" className="fk-auth-link">Existing User? Log in</Link>
                </div>
            </div>
        </div>
    )
}

export default Register
