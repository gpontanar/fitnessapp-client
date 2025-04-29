import React, { useContext, useState } from 'react';
import { Navbar, Nav, Button, Modal, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';
import { Notyf } from 'notyf';
import Swal from 'sweetalert2';

export default function AppNavbar() {
    const { user, loginUser, logoutUser } = useContext(UserContext);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ email: '', password: '' });
    const notyf = new Notyf();
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        fetch('https://fitnessapp-api-ln8u.onrender.com/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.access) {
                    const userData = { id: data.id, email: loginData.email, token: data.access };
                    loginUser(userData); // Use loginUser from UserContext
                    setShowLoginModal(false);
                    setLoginData({ email: '', password: '' });
    
                    Swal.fire({
                        title: 'Login Successful!',
                        text: 'Welcome! You can now access your dashboard.',
                        icon: 'success',
                        confirmButtonText: 'Go to your Dashboard',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate('/user-dashboard'); // Redirect to UserDashboard
                        }
                    });
                } else {
                    Swal.fire({
                        title: 'Login Failed!',
                        text: 'Incorrect email or password. Please try again.',
                        icon: 'error',
                        confirmButtonText: 'OK',
                    }).then(() => {
                        setShowLoginModal(true); // Reopen the login modal
                    });
                }
            })
            .catch((error) => {
                console.error('Error during login:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'An error occurred. Please try again later.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            });
    };

    const handleLogout = () => {
        logoutUser(); // Clear user state in UserContext
        navigate('/');
        notyf.success('Logged Out Successfully');
    };

    const handleRegister = (e) => {
        e.preventDefault();
        fetch('https://fitnessapp-api-ln8u.onrender.com/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registerData),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message === 'Registered Successfully') {
                    setShowRegisterModal(false);
                    setRegisterData({ email: '', password: '' });

                    // Show SweetAlert notification
                    Swal.fire({
                        title: 'Registration Successful!',
                        text: 'Welcome! You can now access your dashboard.',
                        icon: 'success',
                        confirmButtonText: 'Go to your Dashboard',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate('/user-dashboard'); // Redirect to UserDashboard
                        }
                    });
                } else {
                    notyf.error(data.error || 'Registration Failed');
                }
            });
    };

    // const handleLogout = () => {
    //     unsetUser();
    //     localStorage.removeItem('token'); // Clear token from localStorage
    //     navigate('/');
    //     notyf.success('Logged Out Successfully');
    // };

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
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mx-auto">
                    <Nav.Link as={Link} to="/" className="text-white nav-link-custom">
                        Home
                    </Nav.Link>
                </Nav>
                <Nav>
                    {user.id ? (
                        <>
                            <Button as={Link} to="/user-dashboard" className="btn-custom mx-2">
                                User Dashboard
                            </Button>
                            <Button as={Link} to="/workouts" className="btn-custom mx-2">
                                Workouts
                            </Button>
                            <Button className="btn-custom" onClick={handleLogout}>
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
            <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleLogin}>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={loginData.email}
                                onChange={(e) =>
                                    setLoginData({ ...loginData, email: e.target.value })
                                }
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={loginData.password}
                                onChange={(e) =>
                                    setLoginData({ ...loginData, password: e.target.value })
                                }
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3">
                            Login
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Register Modal */}
            <Modal show={showRegisterModal} onHide={() => setShowRegisterModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Register</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleRegister}>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={registerData.email}
                                onChange={(e) =>
                                    setRegisterData({ ...registerData, email: e.target.value })
                                }
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={registerData.password}
                                onChange={(e) =>
                                    setRegisterData({ ...registerData, password: e.target.value })
                                }
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3">
                            Register
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Navbar>
    );
}