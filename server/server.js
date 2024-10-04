import dotenv from 'dotenv';
import express from 'express';
import userRoute from './routes/user.route.js';
<<<<<<< Updated upstream
import mongoose from 'mongoose';
=======
import locationRoute from './routes/location.route.js';  
import feedbackRoute from './routes/feedback.route.js';  
>>>>>>> Stashed changes
import cors from 'cors';

dotenv.config()

//creates the server
const app = express(); 

//allows us to accept JSON data in req.body
app.use(express.json());

//allows to server to interact with the front end
app.use(cors());

<<<<<<< Updated upstream
//application functions
app.use('',userRoute);
=======
// application routes
app.use('', locationRoute);
app.use('', feedbackRoute);  
app.use('', userRoute);  

>>>>>>> Stashed changes

//creates server on port 8080 and connects to mongodb database
app.listen(process.env.PORT || 8080, '0.0.0.0', () => {
    mongoose.connect(process.env.mongodb_URI)
    .then((result) => {
        console.log('connected to Mongodb');
    }).catch((err) => {
        console.error(err);
    });
    console.log('Server started at http://localhost:' + process.env.PORT);
});