import mongoose from "mongoose";

//feedback schema
const feedbackSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    feedback: {
        type:String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});

const Feedback = mongoose.model('Feedback', feedbackSchema);


export default Feedback;