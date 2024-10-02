import React, {useState, useEffect} from 'react';
import NavBar from '../components/NavBar.jsx';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import '../style/AuthUI.css';
import { useNavigate } from 'react-router-dom';
import Toast from 'react-bootstrap/Toast';

//register page
function Register() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [message, setMessage] = useState('');

    //makes sures the user is logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/');
        }
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Username:', userName);
        console.log('Email:', userEmail);
        console.log('Email:', userPassword);

        const userInfo = {name: userName,email: userEmail, password: userPassword};
        
        fetch(import.meta.env.VITE_PORT + '/register',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(userInfo)
        }).then(response => response.json())
        .then(data => {
            if (data.success) {
                navigate('/Login');
            } else {
                setShowToast(true);
                setMessage('Registration failed: '+ data.message);
            }
        })
        .catch(error => {
            setMessage('Error: '+ error);
            setShowToast(true);
        });
    };

    return(
        <div>
            <NavBar/>
            <div className='outer-div'>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3 label" controlId="formGroupName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="name" placeholder="Enter name" onChange={(e) => setUserName(e.target.value)}/>
                        </Form.Group>
                    <Form.Group className="mb-3 label" controlId="formGroupEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" onChange={(e) => setUserEmail(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" onChange={(e) => setUserPassword(e.target.value)}/>
                    </Form.Group>
                    <div className="d-flex justify-content-center">
                        <Button variant="primary" type="submit">Sign Up</Button>
                    </div>
                </Form>
            </div>
            <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} className="toast-top-right" bg='danger' autohide>
                <Toast.Header>
                    <strong className="me-auto">Alert</strong>
                </Toast.Header>
                <Toast.Body>{message}</Toast.Body>
            </Toast>
        </div>
    )
}

export default Register;