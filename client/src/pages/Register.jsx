import React, {useState, useEffect} from 'react';
import NavBar from '../components/NavBar.jsx';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import '../style/AuthUI.css';

function Register() {
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Username:', userName);
        console.log('Email:', userEmail);
        console.log('Email:', userPassword);

        const userInfo = {name: userName,email: userEmail, password: userPassword};
        
        fetch('http://localhost:5000/register',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(userInfo)
        })

        console.log("Data sent: " + JSON.stringify(userInfo));
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
                        <Form.Control type="email label" placeholder="Enter email" onChange={(e) => setUserEmail(e.target.value)}/>
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
        </div>
    )
}

export default Register;