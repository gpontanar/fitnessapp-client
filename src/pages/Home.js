import React from 'react';
import { Carousel } from 'react-bootstrap';

export default function Home() {
    return (
        <div className="text-center mt-5">
            <h1>Welcome to the Fitness Tracker App</h1>
            <p>Track your workouts and progress over time!</p>
            <div className="carousel-container mt-4">
                <Carousel>
                    <Carousel.Item>
                        <img
                            className="d-block w-100 carousel-image"
                            src="https://media.hackerearth.com/blog/wp-content/uploads/2016/08/Image-1.1.png"
                            alt="First slide"
                        />
                        <Carousel.Caption>
                            <h3>Track Your Workouts</h3>
                            <p>Stay consistent and achieve your fitness goals.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100 carousel-image"
                            src="https://img.freepik.com/free-vector/flat-design-apps-fitness-tracker-man-running_23-2148527078.jpg"
                            alt="Second slide"
                        />
                        <Carousel.Caption>
                            <h3>Monitor Your Progress</h3>
                            <p>See how far you've come over time.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100 carousel-image"
                            src="https://static01.nyt.com/images/2024/02/27/well/23Well-fitness-data/23Well-fitness-data-articleLarge.jpg?quality=75&auto=webp&disable=upscale"
                            alt="Third slide"
                        />
                        <Carousel.Caption>
                            <h3>Stay Motivated</h3>
                            <p>Keep pushing yourself to new limits.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </div>
        </div>
    );
}