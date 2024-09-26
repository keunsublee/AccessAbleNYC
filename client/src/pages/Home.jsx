import React, {useState, useEffect} from 'react';
import NavBar from '../components/NavBar.jsx';

function Home() {
    const [name, setName] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            setName(decodedToken.name);
        }
    }, []);

    return (
        <div>
            <NavBar />
            <h1>Welcome, {name}</h1>
        </div>
    );
}

export default Home;