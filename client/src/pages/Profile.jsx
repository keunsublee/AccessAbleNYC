import React, {useState, useEffect} from 'react';
import NavBar from '../components/NavBar.jsx';

//user profile
function Profile() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            setName(decodedToken.name);
            setEmail(decodedToken.email);
        }
    }, []);

    return (
        <div>
            <NavBar />
            <h1 className='title-text'>{name} {email}</h1>
        </div>
    );
}

export default Profile;