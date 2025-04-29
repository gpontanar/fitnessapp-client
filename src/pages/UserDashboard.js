import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../UserContext';
import { Table, Button, Modal, Form } from 'react-bootstrap';

export default function UserDashboard() {
    const { user } = useContext(UserContext);
    const [workouts, setWorkouts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editWorkout, setEditWorkout] = useState(null);
    const [newWorkout, setNewWorkout] = useState({ name: '', duration: '', status: 'Pending' });

    // Fetch workouts for the logged-in user
    useEffect(() => {
        fetch('https://fitnessapp-api-ln8u.onrender.com/workouts/getMyWorkouts', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
            .then((res) => res.json())
            .then((data) => setWorkouts(data.workouts || []))
            .catch((error) => console.error('Error fetching workouts:', error));
    }, []);

    // Handle adding or updating a workout
    const handleSaveWorkout = (e) => {
        e.preventDefault();
        const url = editWorkout
            ? `https://fitnessapp-api-ln8u.onrender.com/workouts/updateWorkout/${editWorkout._id}`
            : 'https://fitnessapp-api-ln8u.onrender.com/workouts/addWorkout';
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
                    setWorkouts(
                        workouts.map((workout) =>
                            workout._id === data._id ? data : workout
                        )
                    );
                } else {
                    setWorkouts([...workouts, data]);
                }
                setShowModal(false);
                setNewWorkout({ name: '', duration: '', status: 'Pending' });
                setEditWorkout(null);
            })
            .catch((error) => console.error('Error saving workout:', error));
    };

    // Handle deleting a workout
    const handleDeleteWorkout = (id) => {
        fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/deleteWorkout/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
            .then(() => {
                setWorkouts(workouts.filter((workout) => workout._id !== id));
            })
            .catch((error) => console.error('Error deleting workout:', error));
    };

    // Handle marking a workout as complete
    const handleCompleteWorkout = (id) => {
        fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/completeWorkoutStatus/${id}`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
            .then((res) => res.json())
            .then((updatedWorkout) => {
                setWorkouts(
                    workouts.map((workout) =>
                        workout._id === updatedWorkout._id ? updatedWorkout : workout
                    )
                );
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