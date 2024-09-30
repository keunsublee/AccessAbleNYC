import React, {useState, useEffect} from 'react';
import NavBar from '../components/NavBar.jsx';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import '../style/AuthUI.css';
import '../style/FacebookButton.css';
import { useNavigate } from 'react-router-dom';
import Toast from 'react-bootstrap/Toast';


import { LoginSocialFacebook } from 'reactjs-social-login';
import { FacebookLoginButton } from 'react-social-login-buttons';




function Login() {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [message, setMessage] = useState('');

    //Access the data
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Email:', userEmail);
        console.log('Password:', userPassword);

        const userInfo = {email: userEmail, password: userPassword};
        
        fetch('http://localhost:8080/login',{ //https://accessablenyc-client.onrender.com/ 
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


                    {/* Login with Facebook Functionality */}
                    <div className="facebook-button">
                        <FacebookLogin />
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


function FacebookLogin() {
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate(); //redirect the user to the home page after a successful Facebook login

    return(
        <div>
        {!profile ? <LoginSocialFacebook
            appId = "1509011246642552" // unique ID provided from developer facebook account
            onResolve = {(response) => {
            console.log(response);
            setProfile(response.data);
            //navigate('/'); //redirect the user to the home page (for now) after a successful Facebook login
            }}

            onReject = {(error) => {
                console.log('Facebook login error:', error);
            }}
        >
            <FacebookLoginButton />
        </LoginSocialFacebook>: ''}

        
        {profile ?
            <div>
            <h1>{profile.name}</h1>
            <img src={profile.picture.data.url} />
            </div>: ''}
            </div>
    );
}


// If user logs in successfully, home page should be edited such that the header login and sign up buttons are replaced with their profile picture and name

export default Login;


