import React, { useState, useEffect } from 'react';
import { Offcanvas, Form, Button, Row, Col, Container,ProgressBar} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTheme } from './ThemeContext';
import '../style/ReviewSideBar.css';

const StarRating = ({ rating }) => {
    const starTotal = 5;
    const starPercentage = (rating / starTotal) * 100;

    return (
        <div className="star-rating">
            <div className="stars-outer">
                <div className="stars-inner" style={{ width: starPercentage }}></div>
            </div>
        </div>
    );
};

const ReviewSideBar = ({ show, handleClose, location, rating}) => {
    const [isAuthenticated,setIsAuthenticated] = useState(false);
    const { theme } = useTheme();
    const [reviewLength, setReviewLength] = useState(0);
    const [fiveStarReviews, setFiveStarReviews] = useState(0);
    const [fourStarReviews, setFourStarReviews] = useState(0);
    const [threeStarReviews, setThreeStarReviews] = useState(0);
    const [twoStarReviews, setTwoStarReviews] = useState(0);
    const [oneStarReviews, setOneStarReviews] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_PORT}/review/${location._id}`)
        .then((response) => {
            if (!response.ok) {
                setReviewLength(0);
                setFiveStarReviews(0);
                setFourStarReviews(0);
                setThreeStarReviews(0);
                setTwoStarReviews(0);
                setOneStarReviews(0);
                throw new Error('Error fetching location accesiblity rating');
            }
            return response.json();
        })
        .then((data) => {
            const reviews = data.reviews;
            setReviewLength(reviews.length);
    
            const fiveStar = reviews.filter(review => review.rating === 5).length;
            const fourStar = reviews.filter(review => review.rating === 4).length;
            const threeStar = reviews.filter(review => review.rating === 3).length;
            const twoStar = reviews.filter(review => review.rating === 2).length;
            const oneStar = reviews.filter(review => review.rating === 1).length;
    
            setFiveStarReviews((fiveStar / reviews.length) * 100);
            setFourStarReviews((fourStar / reviews.length) * 100);
            setThreeStarReviews((threeStar / reviews.length) * 100);
            setTwoStarReviews((twoStar / reviews.length) * 100);
            setOneStarReviews((oneStar / reviews.length) * 100);
            console.log('Location reviews:', data.reviews);
        })
        .catch((error) => {
            setReviewLength(0);
            setReviewLength(0);
            setFiveStarReviews(0);
            setFourStarReviews(0);
            setThreeStarReviews(0);
            setTwoStarReviews(0);
            setOneStarReviews(0);
            console.error('Error fetching location reviews:', error);
        });
    }, [location,rating]);

    return (
        <Offcanvas show={show} onHide={handleClose} placement="end" className={theme === 'dark' ? 'sidebar-dark' : ''}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>{location.Name || location.Location || location.facility_name}</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
            <Container className='ratingContainer'>
                <Row className='ratingTitle'>Accessibility Rating</Row>
                <Row className='ratingInfo'>
                    <Col xs={8}>
                        <div className="progress-container">
                            <span>5</span> <ProgressBar variant="warning" now={fiveStarReviews} className='barwidth'/>
                        </div>
                        <div className="progress-container">
                            <span>4</span> <ProgressBar variant="warning" now={fourStarReviews} className='barwidth'/>
                        </div>
                        <div className="progress-container">
                            <span>3</span> <ProgressBar variant="warning" now={threeStarReviews} className='barwidth'/>
                        </div>
                        <div className="progress-container">
                            <span>2</span> <ProgressBar variant="warning" now={twoStarReviews} className='barwidth'/>
                        </div>
                        <div className="progress-container">
                            <span>1</span> <ProgressBar variant="warning" now={oneStarReviews} className='barwidth'/>
                        </div>
                    </Col>
                    <Col xs={4} className='ratingOverview'>
                        <p className='rating'>{rating}</p>
                        <div>
                            <StarRating rating={rating} />
                        </div>
                        <p className='reviewAmount'>{reviewLength} reviews</p>
                    </Col>
                </Row>
                <Row>
                    <Col className='reviewButtonContainer'>
                    {isAuthenticated ? (
                        <Button variant="outline-primary" className='ratingButton'>Write a review</Button>
                        ) : (
                        <Button variant="outline-primary" className='ratingButton'>Login to review</Button>
                    )}
                    </Col>
                </Row>
            </Container>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default ReviewSideBar;