import React, { useState, useEffect } from 'react';
import { Offcanvas, Button, Row, Col, Container, ProgressBar, Form, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTheme } from './ThemeContext';
import '../style/ReviewSideBar.css';
import { addReview } from '../lib/reviewApi';

const StarRating = ({ rating }) => {
    const starTotal = 5;
    const starPercentage = (rating / starTotal) * 100;

    return (
        <div className="star-rating">
            <div className="stars-outer">
                <div className="stars-inner" style={{ width: `${starPercentage}%` }}></div>
            </div>
        </div>
    );
};

const ReviewSideBar = ({ show, handleClose, location, rating }) => {
    const { theme } = useTheme();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [reviewLength, setReviewLength] = useState(0);
    const [fiveStarReviews, setFiveStarReviews] = useState(0);
    const [fourStarReviews, setFourStarReviews] = useState(0);
    const [threeStarReviews, setThreeStarReviews] = useState(0);
    const [twoStarReviews, setTwoStarReviews] = useState(0);
    const [oneStarReviews, setOneStarReviews] = useState(0);

    // New state for review submission
    const [isWritingReview, setIsWritingReview] = useState(false);
    const [reviewRating, setReviewRating] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        if (!location._id) return; // Ensure location._id exists before fetching

        fetch(`${import.meta.env.VITE_PORT}/review/${location._id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error fetching location accessibility rating');
                }
                return response.json();
            })
            .then((data) => {
                const reviews = data.reviews;
                setReviewLength(reviews.length);

                const fiveStar = reviews.filter((review) => review.rating === 5).length;
                const fourStar = reviews.filter((review) => review.rating === 4).length;
                const threeStar = reviews.filter((review) => review.rating === 3).length;
                const twoStar = reviews.filter((review) => review.rating === 2).length;
                const oneStar = reviews.filter((review) => review.rating === 1).length;

                setFiveStarReviews((fiveStar / reviews.length) * 100);
                setFourStarReviews((fourStar / reviews.length) * 100);
                setThreeStarReviews((threeStar / reviews.length) * 100);
                setTwoStarReviews((twoStar / reviews.length) * 100);
                setOneStarReviews((oneStar / reviews.length) * 100);
            })
            .catch((error) => {
                console.error('Error fetching location reviews:', error);
                setReviewLength(0);
                setFiveStarReviews(0);
                setFourStarReviews(0);
                setThreeStarReviews(0);
                setTwoStarReviews(0);
                setOneStarReviews(0);
            });
    }, [location]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!reviewRating || !reviewText) {
            setError('Please provide both a rating and a review.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await addReview(location._id, token, { rating: reviewRating, review: reviewText });
            setSuccess('Review added successfully!');
            setReviewRating('');
            setReviewText('');
            setIsWritingReview(false);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to add review.');
        }
    };

    return (
        <Offcanvas
            show={show}
            onHide={handleClose}
            placement="end"
            className={theme === 'dark' ? 'sidebar-dark' : ''}
        >
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>{location.Name || location.Location || location.facility_name}</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Container className="ratingContainer">
                    <Row className="ratingTitle">Accessibility Rating</Row>
                    <Row className="ratingInfo">
                        <Col xs={8}>
                            <div className="progress-container">
                                <span>5</span>
                                <ProgressBar
                                    variant="warning"
                                    now={fiveStarReviews}
                                    className="barwidth"
                                />
                            </div>
                            <div className="progress-container">
                                <span>4</span>
                                <ProgressBar
                                    variant="warning"
                                    now={fourStarReviews}
                                    className="barwidth"
                                />
                            </div>
                            <div className="progress-container">
                                <span>3</span>
                                <ProgressBar
                                    variant="warning"
                                    now={threeStarReviews}
                                    className="barwidth"
                                />
                            </div>
                            <div className="progress-container">
                                <span>2</span>
                                <ProgressBar
                                    variant="warning"
                                    now={twoStarReviews}
                                    className="barwidth"
                                />
                            </div>
                            <div className="progress-container">
                                <span>1</span>
                                <ProgressBar
                                    variant="warning"
                                    now={oneStarReviews}
                                    className="barwidth"
                                />
                            </div>
                        </Col>
                        <Col xs={4} className="ratingOverview">
                            <p className="rating">{rating}</p>
                            <div>
                                <StarRating rating={rating} />
                            </div>
                            <p className="reviewAmount">{reviewLength} reviews</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="reviewButtonContainer">
                            {isAuthenticated ? (
                                !isWritingReview ? (
                                    <Button
                                        variant="outline-primary"
                                        className="ratingButton"
                                        onClick={() => setIsWritingReview(true)}
                                    >
                                        Write a review
                                    </Button>
                                ) : (
                                    <Form onSubmit={handleReviewSubmit} className="mt-3">
                                        <Form.Group controlId="reviewRating" className="mb-3">
                                            <Form.Label>Rating</Form.Label>
                                            <Form.Select
                                                value={reviewRating}
                                                onChange={(e) => setReviewRating(e.target.value)}
                                            >
                                                <option value="">Select a rating</option>
                                                {[1, 2, 3, 4, 5].map((num) => (
                                                    <option key={num} value={num}>
                                                        {num}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>

                                        <Form.Group controlId="reviewText" className="mb-3">
                                            <Form.Label>Review</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                value={reviewText}
                                                onChange={(e) => setReviewText(e.target.value)}
                                                placeholder="Write your review here"
                                            />
                                        </Form.Group>

                                        {error && <Alert variant="danger">{error}</Alert>}
                                        {success && <Alert variant="success">{success}</Alert>}

                                        <div className="d-flex justify-content-between">
                                            <Button
                                                variant="secondary"
                                                onClick={() => setIsWritingReview(false)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button variant="primary" type="submit">
                                                Submit
                                            </Button>
                                        </div>
                                    </Form>
                                )
                            ) : (
                                <Button variant="outline-primary" className="ratingButton">
                                    Login to review
                                </Button>
                            )}
                        </Col>
                    </Row>
                </Container>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default ReviewSideBar;