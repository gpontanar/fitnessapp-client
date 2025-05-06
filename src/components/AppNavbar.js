import React, { useState } from 'react';
import { Navbar, Nav, Button, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';

export default function AppNavbar({ user, logoutUser }) {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    const handleRegisterSuccess = () => {
        setShowRegisterModal(false); // Close the register modal
        setShowLoginModal(true); // Open the login modal
    };

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
                onClick={() => setShowLoginModal(!showLoginModal)}
            />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mx-auto">
                    {!user?.id && (
                        <Nav.Link as={Link} to="/" className="text-white nav-link-custom">
                            Home
                        </Nav.Link>
                    )}
                </Nav>
                <Nav>
                    {user?.id ? (
                        <>
                            <Button
                                className="btn-custom mx-2"
                                onClick={() => navigate('/user-dashboard')}
                            >
                                Dashboard
                            </Button>
                            <Button
                                className="btn-custom"
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                className="btn-custom mx-2"
                                onClick={() => setShowLoginModal(true)}
                            >
                                Login
                            </Button>
                            <Button
                                className="btn-custom mx-2"
                                onClick={() => setShowRegisterModal(true)}
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
                        onLoginSuccess={() => setShowLoginModal(false)}
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
                    <Register onRegisterSuccess={handleRegisterSuccess} />
                </Modal.Body>
            </Modal>
        </Navbar>
    );
}