import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

const Login = ({ onLoginSuccess }) => {
    const { loginUser } = useContext(UserContext);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // const handleLogin = async (e) => {
    //     e.preventDefault();
    
    //     const response = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ email: formData.email, password: formData.password }), // Use formData
    //     });
    
    //     const data = await response.json();
    
    //     if (response.ok) {
    //         localStorage.setItem('token', data.token); // Save token to localStorage
    //         loginUser({ id: data.user._id }); // Update user state with the logged-in user's ID
    //         onLoginSuccess(); // Close the login modal
    //     } else {
    //         console.error('Login failed:', data.message);
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                loginUser({ id: data.id, email: formData.email, token: data.access }); // Update user state
                localStorage.setItem('token', data.access); // Save token to localStorage
    
                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful',
                    text: 'Welcome back!',
                    confirmButtonText: 'Go to Dashboard',
                }).then(() => {
                    onLoginSuccess(); // Close the login modal
                    navigate('/user-dashboard'); // Redirect to UserDashboard
                });
            } else {
                // Show error message
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: data.message || 'Invalid email or password',
                });
            }
        } catch (error) {
            console.error('Error during login:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Something went wrong. Please try again later.',
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary mt-3">
                Login
            </button>
        </form>
    );
};

export default Login;