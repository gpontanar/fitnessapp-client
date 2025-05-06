import React, { useState } from 'react';
import { Navbar, Nav, Button, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register'; // Import the Register component

export default function AppNavbar({ user, logoutUser }) {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser(); // Clear user data
        navigate('/'); // Redirect to home page
    };

    console.log('User in AppNavbar:', user); // Debug log

    return (
        <Navbar expand="lg" className="navbar-custom px-4">
            <Navbar.Brand as={Link} to="/" className="text-white">
                <img
                    src="https://www.shutterstock.com/image-vector/fitness-logo-vector-symbol-icon-600nw-1926906863.jpg"
                    alt="Logo"
                    style={{ width: '70px', marginRight: '10px' }}
                />
                Fitness Tracker
            </Navbar.Brand>
            <Navbar.Toggle
                aria-controls="basic-navbar-nav"
                onClick={() => setMenuOpen(!menuOpen)}
            />
            <Navbar.Collapse id="basic-navbar-nav" className={menuOpen ? 'show' : ''}>
                <Nav className="mx-auto">
                    {!user?.id && ( // Show Home button only if the user is not logged in
                        <Nav.Link as={Link} to="/" className="text-white nav-link-custom">
                            Home
                        </Nav.Link>
                    )}
                </Nav>
                <Nav>
                    {user?.id ? ( // Check if the user is logged in
                        <>
                            <Button
                                className="btn-custom mx-2"
                                onClick={() => {
                                    navigate('/user-dashboard'); // Redirect to UserDashboard
                                    setMenuOpen(false);
                                }}
                            >
                                Dashboard
                            </Button>
                            <Button
                                className="btn-custom"
                                onClick={() => {
                                    handleLogout();
                                    setMenuOpen(false);
                                }}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                className="btn-custom mx-2"
                                onClick={() => {
                                    setShowLoginModal(true);
                                    setMenuOpen(false);
                                }}
                            >
                                Login
                            </Button>
                            <Button
                                className="btn-custom mx-2"
                                onClick={() => {
                                    setShowRegisterModal(true);
                                    setMenuOpen(false);
                                }}
                            >
                                Register
                            </Button>
                        </>
                    )}
                </Nav>
            </Navbar.Collapse>

            {/* Login Modal */}
            <Modal
                show={showLoginModal}
                onHide={() => setShowLoginModal(false)}
                aria-labelledby="login-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="login-modal">Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Login
                        onLoginSuccess={() => {
                            setShowLoginModal(false); // Close the modal on successful login
                        }}
                    />
                </Modal.Body>
            </Modal>

            {/* Register Modal */}
            <Modal
                show={showRegisterModal}
                onHide={() => setShowRegisterModal(false)}
                aria-labelledby="register-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="register-modal">Register</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Register />
                </Modal.Body>
            </Modal>
        </Navbar>
    );
}