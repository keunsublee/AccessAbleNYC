import mongoose from "mongoose";

const reviewSchema= new mongoose.Schema({

    locationId:{
        type: mongoose.Schema.Types.ObjectId,
     required:true

    },

    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
       
        required: true 
    },


    review:{

        type: String,
        required:true
    }
},
    {
        timestamps:true
    }
);


const Review= mongoose.model('Review', reviewSchema);

export default Review;