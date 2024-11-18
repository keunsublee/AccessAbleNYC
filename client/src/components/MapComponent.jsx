import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from './ThemeContext';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import Toast from 'react-bootstrap/Toast';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import '../style/MapComponent.css';

// Def custom icons for each location type
const beachIconUrl = '/assets/beach-100.png';
const playgroundIconUrl = '/assets/playground-100.png';
const signalIconUrl = '/assets/traffic-light-100.png';
const subwayIconUrl = '/assets/subway-100.png';
const restroomIconUrl = '/assets/restroom-100.png';

// Bounds for the map to stay within NYC
const nycBounds = [
    [39, -75],  // Even more southwest
    [42, -70]  // Even more northeast
];

// Function to select the correct icon based on the location type
const getIconByLocationType = (type, iconSize) => {
    // Create Leaflet icons for specific location types
    const beachIcon = L.icon({
        iconUrl: beachIconUrl,
        iconSize: iconSize,
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
    });

    const playgroundIcon = L.icon({
        iconUrl: playgroundIconUrl,
        iconSize: iconSize,
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
    });

    const signalIcon = L.icon({
        iconUrl: signalIconUrl,
        iconSize: iconSize,
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
    });

    const subwayIcon = L.icon({
        iconUrl: subwayIconUrl,
        iconSize: iconSize,
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
    });

    const restroomIcon = L.icon({
        iconUrl: restroomIconUrl,
        iconSize: iconSize,
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
    });

    switch (type) {
        case 'beach':
            return beachIcon;
        case 'playground':
            return playgroundIcon;
        case 'pedestrian_signal':
            return signalIcon;
        case 'subway_stop':
            return subwayIcon;
        case 'restroom':
            return restroomIcon;
        default:
            return L.icon({
                iconUrl: '',  // No image URL, broken image icon
                iconSize: iconSize,  
                iconAnchor: [15, 30],  
                popupAnchor: [0, -30],  
            });
    }
};

// Function to calculate the center of nearby locations
const calculateCenter = (nearbyLocations) => {
    if (nearbyLocations.length === 0) {
        // Default to NYC center if no nearby locations are available
        return [40.7128, -74.0060];
    }

    let totalLat = 0;
    let totalLon = 0;

    nearbyLocations.forEach(location => {
        totalLat += location.lat || location.latitude;
        totalLon += location.lon || location.longitude;
    });

    return [
        totalLat / nearbyLocations.length,
        totalLon / nearbyLocations.length
    ];
};

const RoutingMachine = ({ start, routeTo, trafficSignals }) => {
    const map = useMap();
    const routingControlRef = useRef(null);
    const closeControlRef = useRef(null);
    const navigate = useNavigate();
    const { theme } = useTheme;

    const getClosestTrafficSignal = (currentLocation, trafficSignals, finalLocation) => {
        let closestSignal = null;
        let minDistance = Infinity;

        trafficSignals.forEach(signal => {
            const distance = map.distance(
                L.latLng(currentLocation.latitude || currentLocation.lat, currentLocation.longitude || currentLocation.lon),
                L.latLng(signal.latitude, signal.longitude)
            );
            const currentToFinalDistance = map.distance(
                L.latLng(currentLocation.latitude || currentLocation.lat, currentLocation.longitude || currentLocation.lon),
                L.latLng(finalLocation.lat, finalLocation.lon)
            );
            const signalToFinalDistance = map.distance(
                L.latLng(signal.latitude, signal.longitude),
                L.latLng(finalLocation.lat, finalLocation.lon)
            );
            if (distance < minDistance && signalToFinalDistance < currentToFinalDistance) {
                minDistance = distance;
                closestSignal = signal;
            }
        });

        return { closestSignal, minDistance };
    };

    useEffect(() => {
        if (start.lat != null && start.lon != null && routeTo.lat != null && routeTo.lon != null) {
            const distance = map.distance(
                L.latLng(start.lat, start.lon),
                L.latLng(routeTo.lat, routeTo.lon)
            );
            let current = start;
            let visitedSignals = new Set();
            const waypoints = [L.latLng(start.lat, start.lon)];

            while (true) {
                const { closestSignal, minDistance } = getClosestTrafficSignal(current, trafficSignals, routeTo);

                if (!closestSignal || visitedSignals.has(closestSignal) || minDistance >= distance) {
                    waypoints.push(L.latLng(routeTo.lat, routeTo.lon));
                    break;
                }

                waypoints.push(L.latLng(closestSignal.latitude, closestSignal.longitude));
                visitedSignals.add(closestSignal);
                current = closestSignal;
            }

            if (!routingControlRef.current) {
                routingControlRef.current = L.Routing.control({
                    waypoints: waypoints,
                    routeWhileDragging: false,
                    lineOptions: {
                        styles: [{ color: 'blue', weight: 4 }]
                    }
                }).addTo(map);
                
                const routeContainer = routingControlRef.current.getContainer();
                if (routeContainer) {
                    routeContainer.classList.add(theme === 'dark' ? 'routing-dark-mode' : 'routing-light-mode');
                }

                closeControlRef.current = L.control({ position: 'topright' });
                closeControlRef.current.onAdd = function () {
                    const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
                    div.innerHTML = 'Close Route';
                    div.style.backgroundColor = '#ff4040';
                    div.style.padding = '5px';
                    div.style.cursor = 'pointer';
                    div.onclick = function () {
                        if (routingControlRef.current) {
                            map.removeControl(routingControlRef.current);
                            routingControlRef.current = null;
                        }
                        if (closeControlRef.current) {
                            map.removeControl(closeControlRef.current);
                            closeControlRef.current = null;
                        }
                        navigate('');
                    };
                    return div;
                };
                closeControlRef.current.addTo(map);
            } else {
                routingControlRef.current.setWaypoints(waypoints);
            }
        }
    }, [map, start, routeTo, JSON.stringify(trafficSignals)]);

    return null;
};


//zooms out only when a new filler is applied. Otherwise, keeps zoom level, even when a icon is clicked.
const MapCenterUpdater = ({ nearbyLocations, selectedLocation, filterCriteria }) => {
    const map = useMap();
    const prevFilter = useRef(filterCriteria);

    useEffect(() => {
        let newCenter;
        let zoomLevel = map.getZoom();

        //checks if a new filter is applied.
        const newfilter = Object.keys(filterCriteria).some(key => filterCriteria[key] && filterCriteria[key] !== prevFilter.current[key]);

        if (newfilter) {
            zoomLevel = 12;
            prevFilter.current = {...filterCriteria};//updates prevfilter.
        } else if (selectedLocation && (selectedLocation.lat || selectedLocation.latitude) && (selectedLocation.lon || selectedLocation.longitude)) {
            newCenter = [selectedLocation.lat || selectedLocation.latitude, selectedLocation.lon || selectedLocation.longitude] ;
        } else {
            newCenter = calculateCenter(nearbyLocations);
        }

        if (newCenter || newfilter) {
            map.setView(newCenter || map.getCenter(), zoomLevel);
        }
    }, [nearbyLocations, selectedLocation, filterCriteria, map]);

    return null;
};


const MapComponent = ({ locations, nearbyLocations = [], selectedLocation , userCoord, destination, filterCriteria}) => {
    const [showNearby, setShowNearby] = useState(true);  // Default to showing nearby location
    const [showToastError, setShowToastError] = useState(false);
    const [showToastSuccess, setShowToastSuccess] = useState(false);
    const [message, setMessage] = useState('');
    const[directionModalOpen,setDirectionModalOpen]=useState(false);
    const [recentlyOpened, setRecentlyOpened] = useState('');
    const [showPopdesc, setShowPopDesc] = useState({}); const toggleDescription = (id) => { setShowPopDesc((prev) => ({ ...prev, [id]: !prev[id] })); };

    const [userId, setUserId] = useState('');
    const [iconSize, setIconSize] = useState([35, 35]);
    const { theme } = useTheme();

    //Dark Mode for Map Component
    useEffect(() => {
        const mapContainer = document.getElementById('map');
        if(theme === 'dark') {
            mapContainer.classList.add('map-dark-mode');
        }
        else {
            mapContainer.classList.remove('map-dark-mode')
        }
    }, [theme]);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            setUserId(decodedToken.id);
        }
    }, []);

    const handleAddLocation1 = (locationId) => {
        if (!userId) {
            setMessage('User ID is not set. Please Log in first.');
            setShowToastError(true);
            return;
        }
        const userQuery = { locationId: locationId };
   
        fetch(`${import.meta.env.VITE_PORT}/${userId}/addFavoriteLocation`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userQuery)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                setMessage(data.message);
                setShowToastSuccess(true);
            } else {
                setMessage('Unable to add location: ' + data.message);
                setShowToastError(true);
            }
        })
        .catch(error => {
            setMessage('Error: ' + error);
            setShowToastError(true);
        });
    };

    // DynamicMarker component to rescale the marker accordingly to the zoom of the map
    const DynamicMarker = ({ position, locationType, children }) => {
        const map = useMap();

        useEffect(() => {
            const handleZoom = () => {
                const newSize = Math.max(30, map.getZoom() * 3);
                setIconSize([newSize, newSize]);
            };

            map.on('zoom', handleZoom);
            return () => map.off('zoom', handleZoom);
        }, [map]);

        return (
            <Marker position={position} icon={getIconByLocationType(locationType, iconSize)} >
                {children}
            </Marker>
        );
    };
    // Filter locations based on the criteria
    const filteredNearbyLocations = nearbyLocations.filter(location =>
        Object.keys(filterCriteria).every(key => !filterCriteria[key] || location[key] === filterCriteria[key])
    );

    const filteredLocations = locations.filter(location =>
        Object.keys(filterCriteria).every(key => !filterCriteria[key] || location[key] === filterCriteria[key])
    );

    // Determine locations to show based on the selected filter and nearby toggle
    const locationsToShow = showNearby
        ? (selectedLocation ? filteredNearbyLocations.filter(loc => loc.Name === selectedLocation) : filteredNearbyLocations)
        : (selectedLocation ? filteredLocations.filter(loc => loc.Name === selectedLocation) : filteredLocations);
 
    return (
        <div>
            {/* Checkbox to toggle between showing all or nearby locations */}
            <label htmlFor="showNearby" style={{ marginLeft: '42%', marginTop: '5px' }} >
                    <input
                        id="showNearby"
                        type="checkbox"
                        // className={`${theme}`}
                        checked={showNearby}
                        onChange={() => setShowNearby(!showNearby)}
                    />
                    Show Nearby Locations Only
            </label>
            <MapContainer 
            id = 'map'
            center={[40.7128, -74.0060]} 
            zoom={13} 
            maxBounds={nycBounds} 
            maxBoundsViscosity={1.0}
            style={{ height: '71vh', width: '100vw' }}>
                {/* Add OpenStreetMap tile layer */}
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {/* This component will update the map center when nearbyLocations changes */}
                <MapCenterUpdater nearbyLocations={nearbyLocations} selectedLocation={selectedLocation ? [selectedLocation] : filteredLocations} filterCriteria={filterCriteria} />
                <RoutingMachine start={userCoord} routeTo={destination} trafficSignals={locations.filter(loc => loc.location_type === "pedestrian_signal")}/>
                {/* Render Markers for filtered locations */}
                {locationsToShow.map((location, index) => {
                    const lat = location.lat || location.latitude;
                    const lon = location.lon || location.longitude;

                    if (lat && lon) {
                        return (
                            // <DynamicMarker 
                            //     key={index} 
                            //     position={[lat, lon]} 
                            //     locationType={location.location_type}
                            // >
                             <Marker 
                                key={index} 
                                position={[lat, lon]} 
                                icon={getIconByLocationType(location.location_type, iconSize)}
                                eventHandlers={{
                                    click: () => setRecentlyOpened(location)
                                }}
                               >
                               <Popup>
                                    {/* Display different information based on the location_type */}
                                    {location.location_type === 'beach' && (
                                        <div>
                                            <strong>{location.Name || 'Unnamed Beach'}</strong><br />
                                            <strong>Location:</strong> {location.Location}<br />
                                            <strong>Accessible:</strong> {location.Accessible}<br />
                                            <strong>Barbecue Allowed:</strong> {location.Barbecue_Allowed}<br />
                                            <strong>Concession Stand:</strong> {location.Concession_Stand}<br />
                                            {showPopdesc[location._id] && (
                                                <><strong>Description:</strong>
                                                <div dangerouslySetInnerHTML={{ __html: location.Description }}></div></>
                                            )}
                                              <a href="#" onClick={() => toggleDescription(location._id)}>
                                                {showPopdesc[location._id] ? 'Hide Description' : 'Show Description'}
                                            </a><br /> <br />
                                            <div dangerouslySetInnerHTML={{ __html: location.Directions }}></div> 

                                            <div className="button-container">
                                                <button className="add-favorite-button" onClick={() => handleAddLocation1(location._id)}>
                                                    Add to Favorite
                                                </button>
                                                <button className="add-favorite-button" onClick={() => setDirectionModalOpen(true)}>
                                                    Directions
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {location.location_type === 'subway_stop' && (
                                        <div>
                                            <strong>{location.Name || 'Unnamed Subway Station'}</strong><br />
                                            <strong>Location:</strong> {location.Location}<br />
                                            <strong>ADA Status:</strong> {location.ADA_Status}<br />
                                            <strong>Lines:</strong> {location.line}<br />
                                            <strong>Accessible:</strong> {location.Accessible}<br />
                                            <div className="button-container">
                                                <button className="add-favorite-button" onClick={() => handleAddLocation1(location._id)}>
                                                    Add to Favorite
                                                </button>
                                                <button className="add-favorite-button" onClick={() => setDirectionModalOpen(true)}>
                                                    Directions
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {location.location_type === 'restroom' && (
                                        <div>
                                            <strong>{location.facility_name || 'Unnamed Restroom'}</strong><br />
                                            <strong>Location:</strong> {location.Location}<br />
                                            <strong>Operator:</strong> {location.operator}<br />
                                            <strong>Hours of Operation:</strong> {location.hours_of_operation}<br />
                                            <strong>Status:</strong> {location.status}<br />
                                            <strong>Accessible:</strong> {location.Accessible ? 'Yes' : 'No'}<br />
                                            <div className="button-container">
                                                <button className="add-favorite-button" onClick={() => handleAddLocation1(location._id)}>
                                                    Add to Favorite
                                                </button>
                                                <button className="add-favorite-button" onClick={() => setDirectionModalOpen(true)}>
                                                    Directions
                                                </button>
                                            </div>

                                        </div>
                                    )}
                                    {location.location_type === 'playground' && (
                                        <div>
                                            <strong>{location.Name || 'Unnamed Playground'}</strong><br />
                                            <strong>Location:</strong> {location.Location}<br />
                                            <strong>Accessible:</strong> {location.Accessible}<br />
                                            <strong>Sensory-Friendly:</strong> {location['Sensory-Friendly'] === 'Y' ? 'Yes' : 'No'}<br />
                                            <strong>ADA Accessible Comfort Station:</strong> {location.ADA_Accessible_Comfort_Station}<br />
                                            <div className="button-container">
                                                <button className="add-favorite-button" onClick={() => handleAddLocation1(location._id)}>
                                                    Add to Favorite
                                                </button>
                                                <button className="add-favorite-button" onClick={() => setDirectionModalOpen(true)}>
                                                    Directions
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {location.location_type === 'pedestrian_signal' && (
                                        <div>
                                            <strong>{location.Location || 'Unnamed Pedestrian Signal'}</strong><br />
                                            <strong>Borough:</strong> {location.borough}<br />
                                            <strong>Installation Date:</strong> {new Date(location.date_insta).toLocaleDateString()}<br />
                                            <strong>FEMA Flood Zone:</strong> {location.femafldt}<br />
                                            <strong>Accessible:</strong> {location.Accessible}<br />
                                            <div className="button-container">
                                                <button className="add-favorite-button" onClick={() => handleAddLocation1(location._id)}>
                                                    Add to Favorite
                                                </button>
                                                <button className="add-favorite-button" onClick={() => setDirectionModalOpen(true)}>
                                                    Directions
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {/* For unknown location types */}
                                    {location.location_type !== 'beach' &&
                                    location.location_type !== 'subway_stop' &&
                                    location.location_type !== 'restroom' &&
                                    location.location_type !== 'playground' &&
                                    location.location_type !== 'pedestrian_signal' && (
                                        <div>
                                            <strong>{location.Name || 'Unnamed Location'}</strong><br />
                                            <strong>Location:</strong> {location.Location}<br />
                                            <strong>Type:</strong> {location.location_type}<br />
                                            <strong>Accessible:</strong> {location.Accessible}<br />
                                            <div className="button-container">
                                                <button className="add-favorite-button" onClick={() => handleAddLocation1(location._id)}>
                                                    Add to Favorite
                                                </button>
                                                <button className="add-favorite-button" onClick={() => setDirectionModalOpen(true)}>
                                                    Directions
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </Popup>
                            {/* </DynamicMarker>  */}
                            </Marker>

                        );
                    }
                    return null;  // Skip the marker if location coordinates are not available
                })}
            </MapContainer>
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
            <DirectionModal
            show={directionModalOpen}
            onHide={() => setDirectionModalOpen(false)}
            final = {recentlyOpened}
            />
        </div>
    );
};

function DirectionModal(props) {
    const [showToastError, setShowToastError] = useState(false);
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();

    const handlePathTo = (start, destination) => {
        if (start){
            navigate(`/?lat=${destination.lat || destination.latitude}&lon=${destination.lon || destination.longitude}&preflat=${start.lat || start.latitude}&preflon=${start.lon || start.longitude}`);
        }
        else{
            navigate(`/?lat=${destination.lat || destination.latitude}&lon=${destination.lon || destination.longitude}`);
        }
        props.onHide();
        setSearchTerm('');
        setSearch('');
    };

    const handleSearch = async (event) => {
        setSearchTerm(event.target.value);
        if (event.target.value) {
            try {
                const response = await fetch(`${import.meta.env.VITE_PORT}/search?type=${event.target.value}`);
                if (!response.ok) {
                    throw new Error('Error fetching locations');
                }
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleLocationSelection = (location) => {
        setSearch(location);
        setSearchTerm(location.Name); 
        setSearchResults([]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if(!searchTerm){
            setMessage("Error: Please provide an input location");
            setShowToastError(true);
            return;
        }
        handlePathTo(search, props.final);
    };

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Directions
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="d-flex" onSubmit={handleSubmit}>
                    <Form.Control
                        type="search"
                        placeholder="Search a starting point"
                        className='me-2 search-input'
                        aria-label="Search"
                        value={searchTerm}
                        style={{ borderRadius: '20px'}}
                        onChange={handleSearch}
                    />
                    {searchResults.length > 0 && (
                        <div className="add-dropdown-menu show position-absolute">
                            {searchResults.map((result, index) => (
                                <button key={index} className="dropdown-item" onClick={() => handleLocationSelection(result)}>
                                    {result.Name}
                                </button>
                            ))}
                        </div>
                    )}
                    <Button variant="outline-primary" className='addButton' style={{ borderRadius: '20px' }} onClick={() => setSearchTerm('Your Location')}>Your Location</Button>
                    <Button variant="outline-success" className='addButton' style={{ borderRadius: '20px' }} type="submit">Find Route</Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
            <Toast onClose={() => setShowToastError(false)} show={showToastError} delay={3000} className="toast-bottom-right" bg='danger' autohide>
                <Toast.Header>
                    <strong className="me-auto">Alert</strong>
                </Toast.Header>
                <Toast.Body>{message}</Toast.Body>
            </Toast>
        </Modal>
    );
}

export default MapComponent;
