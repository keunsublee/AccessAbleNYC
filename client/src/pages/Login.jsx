import React, {useState, useEffect} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import '../style/AuthUI.css';
import { useNavigate } from 'react-router-dom';
import Toast from 'react-bootstrap/Toast';
import NavBar from '../components/NavBar.jsx';

//user login page
function Login() {
    const navigate = useNavigate();
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

    //Access the data
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Email:', userEmail);
        console.log('Password:', userPassword);

        const userInfo = {email: userEmail, password: userPassword};
        
        fetch(import.meta.env.VITE_PORT + '/login',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(userInfo)
        }).then(response => response.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('token', data.token);
                console.log('Token saved:', data.token);
                navigate('/');
            } else {
                setMessage('Login failed: '+ data.message);
                setShowToast(true);
            }
        })
        .catch(error => {
            setMessage('Error: '+ error);
            setShowToast(true);
        });

        console.log("Data sent: " + JSON.stringify(userInfo));
    };

    return(
        <div>
            <NavBar/>
            <div className='outer-div'>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3 label" controlId="formGroupEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" onChange={(e) => setUserEmail(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" onChange={(e) => setUserPassword(e.target.value)}/>
                    </Form.Group>
                    <div className="d-flex justify-content-center">
                        <Button variant="primary" type="submit">Log In</Button>
                    </div>
                </Form>
            </div>
            <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} className="toast-bottom-right" bg='danger' autohide>
                <Toast.Header>
                    <strong className="me-auto">Alert</strong>
                </Toast.Header>
                <Toast.Body>{message}</Toast.Body>
            </Toast>
        </div>
    )
}

export default Login;