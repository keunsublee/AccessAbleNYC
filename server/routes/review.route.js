import express from 'express';
import Location from '../models/location.model.js';
import Review from '../models/review.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const router = express.Router();

const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);  
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};


router.post('/review/:locationId', authenticateUser, async (req, res) => {
    const { locationId } = req.params;
    const { review } = req.body;
    const userId = req.user ? req.user.id : null;  

    if (!userId) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    if (!mongoose.Types.ObjectId.isValid(locationId)){
        return res.status(404).json({success: false, message: 'Invalid Location'});
    }

    try {
        const newReview = await Review.create({ locationId, userId, review });
        res.status(201).json({ success: true, review: newReview });
    } catch (error) {
        if (error.code == 11000){
            res.status(409).json({success: false, message: "Review already added"});
            return;
        };
        res.status(500).json({ success: false, message: error.message });
    }
});


router.get('/review/:locationId', async (req, res) => {
    const { locationId } = req.params;

    try {
        const reviews = await Review.find({ locationId });

        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ success: false, message: 'No reviews found for this location' });
        }

        res.status(200).json({ success: true, reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


router.delete('/review/:locationId/:reviewId', authenticateUser, async (req, res) => {
    const { locationId, reviewId } = req.params;
    const userId = req.user ? req.user.id : null;  

    if (!userId) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    try {
        
        const review = await Review.findByIdAndDelete(reviewId, {
            conditions: { userId, locationId }
        });

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found or not authorized to delete this review' });
        }

        res.status(200).json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


router.put('/review/:locationId/:reviewId', authenticateUser, async (req, res) => {
    const { locationId, reviewId } = req.params;
    const { review } = req.body;
    const userId = req.user ? req.user.id : null; 

    if (!userId) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    try {
        const existingReview = await Review.findOne({ 
            _id: reviewId,
            locationId: locationId, 
            userId: userId
        });

        if (!existingReview) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        existingReview.review = review || existingReview.review;

        await existingReview.save();

        res.status(200).json({ success: true, review: existingReview });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;