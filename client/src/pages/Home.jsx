import React, { useState, useEffect } from 'react';
import '../style/Home.css';
import NavBar from '../components/NavBar.jsx';

//homepage which is the main page the user lands on
function Home() {
    const [name, setName] = useState('');
    const [locations, setLocations] = useState([]);
    const [nearbyLocations, setNearbyLocations] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            setName(decodedToken.name);
        }

        // Fetch all locations
        fetch(`${import.meta.env.VITE_PORT}/locations`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error fetching locations');
                }
                return response.json();
            })
            .then((data) => {
                setLocations(data);
                console.log('Locations data:', data);
            })
            .catch((error) => {
                console.error('Error fetching locations:', error);
            });

        // Fetch nearby locations using geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log('User Coordinates: ', { latitude, longitude });

                    fetch(`${import.meta.env.VITE_PORT}/locations/nearby?lat=${latitude}&lon=${longitude}`)
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error('Error fetching nearby locations');
                            }
                            return response.json();
                        })
                        .then((data) => {
                            setNearbyLocations(data);
                            console.log('Nearby Locations:', data);
                        })
                        .catch((error) => {
                            console.error('Error fetching nearby locations:', error);
                        });
                },
                (error) => {
                    console.error('Geolocation error:', error);
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    }, []);

    return (
        <div>
            <NavBar/>
            <h1>Welcome, {name}</h1>

        
        </div>
    );
}

export default Home;