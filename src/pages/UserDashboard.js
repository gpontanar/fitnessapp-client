import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2'; // Import SweetAlert2

export default function UserDashboard() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [workouts, setWorkouts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editWorkout, setEditWorkout] = useState(null);
    const [newWorkout, setNewWorkout] = useState({ name: '', duration: '', status: 'Pending' });

    // Fetch workouts for the logged-in user
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            navigate('/login'); // Redirect to login page
            return;
        }

        fetch(`${process.env.REACT_APP_API_URL}/workouts/getMyWorkouts`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch workouts');
                }
                return res.json();
            })
            .then((data) => setWorkouts(data.workouts || []))
            .catch((error) => console.error('Error fetching workouts:', error));
    }, [navigate]);

    // Handle adding or updating a workout
    const handleSaveWorkout = (e) => {
        e.preventDefault();
        const url = editWorkout
            ? `${process.env.REACT_APP_API_URL}/workouts/updateWorkout/${editWorkout._id}`
            : `${process.env.REACT_APP_API_URL}/workouts/addWorkout`;
        const method = editWorkout ? 'PATCH' : 'POST';

        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(newWorkout),
        })
            .then((res) => res.json())
            .then((data) => {
                if (editWorkout) {
                    // Update the workout in the state
                    setWorkouts(
                        workouts.map((workout) =>
                            workout._id === data._id ? data : workout
                        )
                    );
                } else {
                    // Add the new workout to the state
                    setWorkouts([...workouts, data]);
                }
                setShowModal(false);
                setNewWorkout({ name: '', duration: '', status: 'Pending' });
                setEditWorkout(null);

                // Show success Swal and refresh the page
                Swal.fire({
                    icon: 'success',
                    title: 'Workout Saved Successfully!',
                    text: 'Your workout has been updated.',
                    confirmButtonText: 'OK',
                }).then(() => {
                    window.location.reload(); // Refresh the page
                });
            })
            .catch((error) => console.error('Error saving workout:', error));
    };

    // Handle deleting a workout
    const handleDeleteWorkout = (id) => {
        fetch(`${process.env.REACT_APP_API_URL}/workouts/deleteWorkout/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
            .then(() => {
                // Remove the workout from the state
                setWorkouts(workouts.filter((workout) => workout._id !== id));

                // Show success Swal and refresh the page
                Swal.fire({
                    icon: 'success',
                    title: 'Workout Deleted Successfully!',
                    text: 'The workout has been removed.',
                    confirmButtonText: 'OK',
                }).then(() => {
                    window.location.reload(); // Refresh the page
                });
            })
            .catch((error) => console.error('Error deleting workout:', error));
    };

    // Handle marking a workout as complete
    const handleCompleteWorkout = (id) => {
        fetch(`${process.env.REACT_APP_API_URL}/workouts/completeWorkoutStatus/${id}`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
            .then((res) => res.json())
            .then((updatedWorkout) => {
                // Update the workout status in the state
                setWorkouts(
                    workouts.map((workout) =>
                        workout._id === updatedWorkout._id ? updatedWorkout : workout
                    )
                );

                // Show success Swal and refresh the page
                Swal.fire({
                    icon: 'success',
                    title: 'Workout Marked as Complete!',
                    text: 'The workout status has been updated.',
                    confirmButtonText: 'OK',
                }).then(() => {
                    window.location.reload(); // Refresh the page
                });
            })
            .catch((error) => console.error('Error updating workout status:', error));
    };

    return (
        <div className="text-center mt-5">
            <div className="text-center mb-4">
                <h1>Welcome {user.email || 'User'}! to Your Dashboard</h1>
                <p>Here you can manage your workouts and track your progress.</p>
                <p>Your email: {user.email || 'Not available'}</p>
            </div>

            {/* Workouts Table */}
            <div>
                <h3 className="text-center">Your Workouts</h3>
                <Button
                    id="addWorkout"
                    onClick={() => {
                        setShowModal(true);
                        setEditWorkout(null);
                        setNewWorkout({ name: '', duration: '', status: 'Pending' });
                    }}
                    className="mb-3"
                >
                    Add Workout
                </Button>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Duration</th>
                            <th>Status</th>
                            <th>Date Added</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workouts.map((workout, index) => (
                            <tr key={workout._id}>
                                <td>{index + 1}</td>
                                <td>{workout.name}</td>
                                <td>{workout.duration}</td>
                                <td>{workout.status}</td>
                                <td>{new Date(workout.dateAdded).toLocaleDateString()}</td>
                                <td>
                                    <Button
                                        className="btn-update"
                                        onClick={() => {
                                            setShowModal(true);
                                            setEditWorkout(workout);
                                            setNewWorkout({
                                                name: workout.name,
                                                duration: workout.duration,
                                                status: workout.status,
                                            });
                                        }}
                                    >
                                        Update
                                    </Button>
                                    <Button
                                        className="btn-delete"
                                        onClick={() => handleDeleteWorkout(workout._id)}
                                    >
                                        Delete
                                    </Button>
                                    {workout.status === 'Pending' && (
                                        <Button
                                            className="btn-complete"
                                            onClick={() => handleCompleteWorkout(workout._id)}
                                        >
                                            Mark as Complete
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Add/Edit Workout Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editWorkout ? 'Edit Workout' : 'Add Workout'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSaveWorkout}>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Workout Name"
                                value={newWorkout.name}
                                onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Duration</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Duration (e.g., 30 mins)"
                                value={newWorkout.duration}
                                onChange={(e) => setNewWorkout({ ...newWorkout, duration: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3">
                            Save
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}