import { useState, useEffect, useContext } from 'react';
import { Button, Card, Modal, Form } from 'react-bootstrap';
import UserContext from '../UserContext';

export default function Workouts() {
    const { user } = useContext(UserContext);
    const [workouts, setWorkouts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newWorkout, setNewWorkout] = useState({ name: '', duration: '', status: 'Pending' });

    
    useEffect(() => {
        fetch('https://fitnessapp-api-ln8u.onrender.com/workouts/getMyWorkouts', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('Fetched workouts:', data.workouts); 
                setWorkouts(data.workouts || []);
            })
            .catch((error) => console.error('Error fetching workouts:', error));
    }, []);

    
    const handleAddWorkout = (e) => {
        e.preventDefault();
        fetch('https://fitnessapp-api-ln8u.onrender.com/workouts/addWorkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ ...newWorkout, status: 'Pending' }), 
        })
            .then((res) => res.json())
            .then((data) => {
                setWorkouts([...workouts, data]);
                setShowModal(false); 
                setNewWorkout({ name: '', duration: '', status: 'Pending' }); 
            })
            .catch((error) => console.error('Error adding workout:', error));
    };

    
    const handleCompleteWorkout = (id) => {
        fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/completeWorkoutStatus/${id}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
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
            <h1 className="my-5">My Workouts</h1>

            {/* Add Workout Button */}
            <div className="d-flex justify-content-center mb-4">
                <Button id="addWorkout" onClick={() => setShowModal(true)}>
                    Add Workout
                </Button>
            </div>

            {/* Workout Cards */}
            <div className="d-flex flex-wrap justify-content-center">
            {workouts.map((workout) => (
                <Card key={workout._id} className="m-2" style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title>{workout.name}</Card.Title>
                        <Card.Text>Duration: {workout.duration}</Card.Text>
                        <Card.Text>Status: {workout.status}</Card.Text>
                        <Card.Text>Date Added: {new Date(workout.dateAdded).toLocaleDateString()}</Card.Text>
                        {workout.status === 'Pending' && (
                            <Button
                                variant="success"
                                className="mt-2"
                                onClick={() => handleCompleteWorkout(workout._id)}
                            >
                                Mark as Complete
                            </Button>
                        )}
                    </Card.Body>
                </Card>
            ))}
        </div>

            {/* Add Workout Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Workout</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddWorkout}>
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
                            Add Workout
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}