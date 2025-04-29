import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Notyf } from 'notyf';

import UserContext from '../UserContext';

export default function Login() {
    const notyf = new Notyf();
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(true);

    const authenticate = (e) => {
        e.preventDefault();
        fetch('https://fitnessapp-api-ln8u.onrender.com/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.access !== undefined) {
                    localStorage.setItem('token', data.access);
                    retrieveUserDetails(data.access);

                    setEmail('');
                    setPassword('');

                    console.log('Login successful, showing Swal prompt...');
                    Swal.fire({
                        title: 'Login Successful!',
                        text: 'Welcome! You can now access your dashboard.',
                        icon: 'success',
                        confirmButtonText: 'Go to your Dashboard',
                        backdrop: true,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate('/userDashboard'); // Redirect to userDashboard
                        }
                    });
                } else if (data.message === 'Incorrect email or password') {
                    notyf.error('Incorrect Credentials. Try Again');
                } else {
                    notyf.error('User Not Found. Try Again.');
                }
            });
    };

    const retrieveUserDetails = (token) => {
        fetch('https://fitnessapp-api-ln8u.onrender.com/users/details', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setUser({
                    id: data._id,
                    isAdmin: data.isAdmin,
                });
            });
    };

    useEffect(() => {
        if (email !== '' && password !== '') {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [email, password]);

    return (
        <Form onSubmit={(e) => authenticate(e)}>
            <h1 className="my-5 text-center">Login</h1>
            <Form.Group>
                <Form.Label>Email address</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Form.Group>

            {isActive ? (
                <Button variant="primary" type="submit" id="loginBtn">
                    Login
                </Button>
            ) : (
                <Button variant="danger" type="submit" id="loginBtn" disabled>
                    Login
                </Button>
            )}
        </Form>
    );
}