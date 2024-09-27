import dotenv from 'dotenv';
import express from 'express';
import userRoute from './routes/user.route.js';
import mongoose from 'mongoose';
import cors from 'cors';

dotenv.config()

//creates the server
const app = express(); 

//allows us to accept JSON data in req.body
app.use(express.json());

//allows to server to interact with the front end
app.use(cors());

//application functions
app.use('',userRoute);

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