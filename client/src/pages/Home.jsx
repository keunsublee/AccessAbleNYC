import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar.jsx';
import '../style/Home.css';

//homepage which is the main page the user lands on
function Home() {
    const [name, setName] = useState('');
    const [locations, setLocations] = useState([]);  

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            setName(decodedToken.name);
        }

        
        fetch(import.meta.env.VITE_PORT + '/locations')  
            .then((response) => response.json())
            .then((data) => {
                setLocations(data);
                console.log('Locations data:', data);
            })
            .catch((error) => {
                console.error('Error fetching locations:', error);
            });
    }, []);  

    return (
        <div>
            <NavBar />
            <h1>Welcome, {name}</h1>
        </div>
    );
}

export default Home;
