import express from 'express';
import Location from '../models/location.model.js';

const router = express.Router();

//Search Route
router.get('/search', async (req, res) => {
    const { type } = req.query;
    try {
        const locations = await Location.find({
            Name: { $regex: new RegExp(type, 'i') }
        });

        if (!locations || locations.length === 0) {
            return res.status(404).json({ message: 'No locations found' });
        }
        res.status(200).json(locations);
    } catch (error) {
        console.error('Error fetching locations:', error);
        res.status(500).json({ message: 'Error fetching locations', error });
    }
});


// Route to fetch all locations
router.get('/locations', async (req, res) => {
    try {
        const locations = await Location.find({}); 

        if (!locations || locations.length === 0) {
            return res.status(404).json({ message: 'No locations found' });
        }

        res.status(200).json(locations);
    } catch (error) {
        console.error('Error fetching locations:', error);
        res.status(500).json({ message: 'Error fetching locations', error });
    }
});

// Route to fetch locations near the user's coordinates
router.get('/locations/nearby', async (req, res) => {
    const { lat, lon, distance = 2000 } = req.query; // Default set to 2000 meters

    // Validate that lat and lon are provided
    if (!lat || !lon) {
        return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    try {
        const latNumber = parseFloat(lat);
        const lonNumber = parseFloat(lon);

        // Query for documents with lat/lon fields
        // $ symbol for MongoDB query operations 
        const nearbyLocations = await Location.find({
            lat: { $exists: true },
            lon: { $exists: true },
            // Calculate the Euclidean distance (Haversine approximation in degrees)
            //sqrt( (lat1 - lat2)^2 + (lon1 - lon2)^2 ) < (distance / 111320)
            $expr: {
                $lt: [
                    {
                        $sqrt: {
                            $add: [
                                // (lat1 - lat2)^2
                                { $pow: [{ $subtract: [{ $toDouble: "$lat" }, latNumber] }, 2] },
                                 // (lon1 - lon2)^2
                                { $pow: [{ $subtract: [{ $toDouble: "$lon" }, lonNumber] }, 2] }
                            ]
                        }
                    },
                    distance / 111320  // Convert distance from meters to degrees
                ]
            }
        });

        if (!nearbyLocations || nearbyLocations.length === 0) {
            return res.status(404).json({ message: 'No nearby locations found' });
        }

        res.status(200).json(nearbyLocations);
    } catch (error) {
        console.error('Error fetching nearby locations:', error);
        res.status(500).json({ message: 'Error fetching nearby locations', error });
    }
});

export default router;
