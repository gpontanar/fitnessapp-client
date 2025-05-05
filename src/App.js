import React, { useState, useEffect } from 'react'; // Import React and hooks
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Router components
import AppNavbar from './components/AppNavbar'; // Import AppNavbar
import Home from './pages/Home'; // Import Home page
import Register from './pages/Register'; // Import Register page
import Login from './pages/Login'; // Import Login page
import Workouts from './pages/Workouts'; // Import Workouts page
import UserDashboard from './pages/UserDashboard'; // Import UserDashboard page
import { UserProvider } from './UserContext'; // Import UserProvider
import './App.css'; // Import CSS

function App() {
    const [user, setUser] = useState({ id: null });

    const unsetUser = () => {
        localStorage.clear();
        setUser({ id: null }); // Reset user state to { id: null }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setUser({ id: null });
            return;
        }
    
        fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data._id) {
                    console.log('User logged in:', data); // Debug log
                    setUser({ id: data._id }); // Update user state with the logged-in user's ID
                } else {
                    setUser({ id: null });
                }
            })
            .catch(() => setUser({ id: null }));
    }, []);

    return (
        <UserProvider>
            <Router>
                <AppNavbar user={user} logoutUser={unsetUser} />{/* Pass user and logoutUser */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/workouts" element={<Workouts />} />
                    <Route path="/user-dashboard" element={<UserDashboard />} />
                </Routes>
            </Router>
        </UserProvider>
    );
}

export default App;