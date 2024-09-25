require('dotenv').config();
const express = require('express');
const sequelize = require('sequelize')

const app = express();

app.get('/', (req,res) => {
    res.send("server is ready");
});

mongoose.connect(process.env.mongodb_URI)
.then((result) => {
    console.log('connected to Mongodb');
}).catch((err) => {
    console.error(err);
});