
import mongoose from 'mongoose';
import review from '../models/review.model.js'


describe('Test Review Model', () => {
    it('error - invalid rating', async () => {
        const newreview = new review({
            locationId: new mongoose.Types.ObjectId(),
            userId: new mongoose.Types.ObjectId(),
            rating: 6, 
            review: 'mock review.'
        });
  
        try {
            await newreview.validate();
        } catch (err) {
            expect(err.errors.rating.message).toBe('Rating must be at most 5');
        }
    });
    it('error - invalid rating', async () => { 
        const newReview = new review({ 
            locationId: new mongoose.Types.ObjectId(), 
            userId: new mongoose.Types.ObjectId(), 
            rating: 1.5, 
            review: 'mock review.' }); 
            const error = newReview.validateSync(); 
            expect(error.errors.rating.message).toBe('1.5 is not a valid rating!'); });
  });
  