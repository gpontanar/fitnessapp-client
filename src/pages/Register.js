import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Notyf } from 'notyf';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Register() {
    const notyf = new Notyf();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);

    const handleRegister = (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message === 'Registered Successfully') {
                    notyf.success('Registration Successful!');
                    setIsRegistered(true);
                } else {
                    notyf.error(data.error || 'Registration Failed');
                }
            })
            .catch((error) => {
                console.error('Error during registration:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'An error occurred. Please try again later.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            });
    };

    return isRegistered ? (
        <Navigate to="/login" />
    ) : (
        <Form onSubmit={handleRegister}>
            <h5 className="my-2 text-center"></h5>
            <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </Form.Group>
            <Button className="my-3" variant="primary" type="submit">
                Register
            </Button>
        </Form>
    );
}