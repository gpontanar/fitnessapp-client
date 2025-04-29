import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import AppNavbar from './components/AppNavbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Workouts from './pages/Workouts';
import Home from './pages/Home'; 
import UserDashboard from './pages/UserDashboard';
import { UserProvider } from './UserContext';

function App() {
    const [user, setUser] = useState({ id: null });

    const unsetUser = () => {
        localStorage.clear();
        setUser({ id: null });
    };

    useEffect(() => {
        fetch('https://fitnessapp-api-ln8u.onrender.com/users/details', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data._id) {
                    setUser({ id: data._id });
                } else {
                    setUser({ id: null });
                }
            });
    }, []);

    return (
        <UserProvider value={{ user, setUser, unsetUser }}>
            <Router>
                <AppNavbar />
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