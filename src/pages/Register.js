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
        fetch('https://fitnessapp-api-ln8u.onrender.com/users/register', {
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
            });
    };

    return isRegistered ? (
        <Navigate to="/login" />
    ) : (
        <Form onSubmit={handleRegister}>
            <h1 className="my-5 text-center">Register</h1>
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
            <Button variant="primary" type="submit">
                Register
            </Button>
        </Form>
    );
}