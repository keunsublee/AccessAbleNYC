import React, {useState, useEffect} from 'react';
import NavBar from '../components/NavBar.jsx';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import '../style/AuthUI.css';

function Login() {
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');

    //Access the data
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Email:', userEmail);
        console.log('Password:', userPassword);

        const userInfo = {email: userEmail, password: userPassword};
        
        fetch('http://localhost:5000/login',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(userInfo)
        }).then(response => response.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('token', data.token);
                console.log('Token saved:', data.token);
            } else {
                console.log('Login failed:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
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
                        <Form.Control type="email label" placeholder="Enter email" onChange={(e) => setUserEmail(e.target.value)}/>
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
        </div>
    )
}

export default Login;