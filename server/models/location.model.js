import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
    location_type: {
        type: String,  
    },
    name: {
        type: String,  
    },
    lat: {
        type: Number,  
    },
    lon: {
        type: Number,  
    }
    //more can be added
});

const Location = mongoose.model('all_locations', locationSchema);

export default Location;
