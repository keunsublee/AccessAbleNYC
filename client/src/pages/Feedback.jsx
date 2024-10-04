import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import NavBar from '../components/NavBar.jsx';
import Button from 'react-bootstrap/Button';
import '../style/Feedback.css';
import Toast from 'react-bootstrap/Toast';

//feedback page for user
function Feedback() {
    const [isAuthenticated,setIsAuthenticated] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [userFeedback, setUserFeedback] = useState('');
    const [showToastError, setShowToastError] = useState(false);
    const [showToastSuccess, setShowToastSuccess] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            setUserEmail(decodedToken.email);
        }
    }, []);

    //Submits feedback data
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Email:', userEmail);
        console.log('Feedback:', userFeedback);

        const userQuery = {email: userEmail, feedback: userFeedback};
        
        fetch(import.meta.env.VITE_PORT + '/feedback',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(userQuery)
        }).then(response => response.json())
        .then(data => {
            if (data.success) {
                setShowToastSuccess(true);
                setMessage(data.message);
                setUserFeedback('');
            } else {
                setShowToastError(true);
                setMessage('Feedback failed to send: '+ data.message);
            }
        })
        .catch(error => {
            setShowToastError(true);
            setMessage('Error: '+ error);
        });

        console.log("Data sent: " + JSON.stringify(userQuery));
    };

    return (
        <div>
            <NavBar/>
            <div className='outer-div'>
                <Form onSubmit={handleSubmit}>
                {isAuthenticated ? (
                    <Form.Group className="mb-3 label" controlId="exampleForm.ControlInput1">
                        <Form.Label>Email address</Form.Label>
                        <p className='user-email'>{userEmail}</p>
                    </Form.Group>
                    ) : (
                    <Form.Group className="mb-3 label" controlId="exampleForm.ControlInput1">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" onChange={(e) => setUserEmail(e.target.value)}/>
                    </Form.Group>
                    )}
                    <Form.Group className="mb-3 label" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Share your thoughts</Form.Label>
                        <Form.Control as="textarea" rows={3} value={userFeedback} onChange={(e) => setUserFeedback(e.target.value)}/>
                    </Form.Group>
                    <div className="d-flex justify-content-center">
                        <Button variant="primary" type="submit">Submit Feedback</Button>
                    </div>
                </Form> 
            </div>
            <Toast onClose={() => setShowToastSuccess(false)} show={showToastSuccess} delay={3000} className="toast-bottom-right" bg='success' autohide>
                <Toast.Header>
                    <strong className="me-auto">Alert</strong>
                </Toast.Header>
                <Toast.Body>{message}</Toast.Body>
            </Toast>
            <Toast onClose={() => setShowToastError(false)} show={showToastError} delay={3000} className="toast-bottom-right" bg='danger' autohide>
                <Toast.Header>
                    <strong className="me-auto">Alert</strong>
                </Toast.Header>
                <Toast.Body>{message}</Toast.Body>
            </Toast>
        </div>
    );
}

export default Feedback;