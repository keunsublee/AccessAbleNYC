import express from 'express';
import Location from '../models/location.model.js';  

const router = express.Router();

router.get('/locations', async (req, res) => {
    try {
        const locations = await Location.find();  
        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching locations', error });
    }
});

export default router;
