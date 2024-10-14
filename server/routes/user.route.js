import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import User from '../models/users.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config()

const router = express.Router();

//gets all users
router.get('/', async (req,res) => {
    try {
        const users = await User.find({});
        res.status(200).json({success:true, data: users});
    } catch (error) {
        console.log('erorr in fetching users: ', error.message);
        res.status(500).json({success: false, message: 'server error'})
    }
});

//finds user based on id
router.get('/:id', async (req,res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success: false, message: 'Invalid User Id'});
    }

    try {
        const user = await User.findById(id);
        res.status(200).json({ success:true, data: user});
    } catch (error) {
        console.log('erorr in fetching user: ', error.message);
        res.status(500).json({success:false, message: 'Server Error'});
    }
});

//deletes user based on id
router.delete('/:id', async (req,res) =>{
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success: false, message: 'Invalid User Id'});
    }

    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'User deleted'});
    } catch (error) {
        console.log("Error in deleting user: ", error.message);
        res.status(500).json({ success: false, message: 'Server Error'});
    }
});

//adds a user
router.post('/',async (req,res) => {
    const user = req.body;

    if (!user.name || !user.email){
        return res.status(400).json({success:false, message: 'Please provide all fields'});
    };

    const newUser = new User(user);

    try {
        await newUser.save();
        res.status(201).json({success: true, data: newUser});
    } catch(error) {
        console.log("Error in creating user: ", error.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
});

//updates user password
router.put('/:id/password', async (req,res) => {
    const {id} = req.params;

    const {currentPassword, newPassword} = req.body;
    if (!currentPassword || !newPassword){
        return res.status(400).json({success:false, message: 'Please provide all fields'});
    }

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success: false, message: 'Invalid Id'});
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await User.findById(id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch){
        return res.status(400).json({success:false, message: 'Invalid Credentials'});
    }
    const newUser =  {name: user.name, email: user.email, password: hashedPassword};
    
    try {
        const updatedUser = await User.findByIdAndUpdate(id, newUser, {new:true});
        res.status(200).json({ success:true, data: updatedUser, message: 'Password updated'});
    } catch (error) {
        res.status(500).json({success:false, message: 'Server Error'});
    }
});



//register api
router.post('/register',async (req,res) => {
    const {name,email,password}= req.body;

    if (!name || !email || !password){
        return res.status(400).json({success:false, message: 'Please provide all fields'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({name,email,password:hashedPassword});

    try {
        await newUser.save();
        res.status(201).json({success: true, data: newUser});
    } catch(error) {
        console.log("Error in creating user: ", error.message);
        if (error.code == 11000){
            res.status(409).json({success: false, message: "Duplicate email"});
            return;
        };
        res.status(500).json({success: false, message: "Server Error"});
    }
});


//login api
router.post('/login',async (req,res) =>{
    const {email,password}=req.body;
    
    const user = await User.findOne({email});

    if (!user){
        return res.status(400).json({success:false, message: 'Invalid Credentials'});
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch){
        return res.status(400).json({success:false, message: 'Invalid Credentials'});
    }

    const payload = {name: user.name,email: email, id: user._id};
    const token = jwt.sign(payload,process.env.SECRET_ACCESS_TOKEN);
    res.json({token: token});
});
export default router;

router.put('/:id/addFavoriteLocation',async (req,res) => {
    const {id} = req.params;
    const { locationId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success: false, message: 'Invalid Id'});
    }

    if (!mongoose.Types.ObjectId.isValid(locationId)){
        return res.status(404).json({success: false, message: 'Invalid Location'});
    }

    try {
        const user = await User.findById(id);
        user.favoriteLocations.push(locationId);
        await user.save();
        res.status(200).json({ success:true, message: 'New favorite location added'});
    } catch (error) {
        res.status(500).json({success:false, message: 'Server Error'});
    }
});

router.put('/:id/deleteFavoriteLocation',async (req,res) => {
    const {id} = req.params;
    const { locationId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success: false, message: 'Invalid Id'});
    }

    try {
        const user = await User.findById(id);
        if (!user.favoriteLocations.includes(locationId)) {
            return res.status(404).json({ success: false, message: 'Location not found in favorites' });
        }
        user.favoriteLocations.pull(locationId);
        await user.save();
        res.status(200).json({ success:true, message: 'Location removed from favorite locations'});
    } catch (error) {
        res.status(500).json({success:false, message: 'Server Error'});
    }
});

router.get('/:id/favoriteLocations',async (req,res) => {
    const {id} = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success: false, message: 'Invalid Id'});
    }

    try {
        const user = await User.findById(id);
        const favoriteLocations = user.favoriteLocations;
        res.status(200).json({ success:true, locations: favoriteLocations});
    } catch (error) {
        res.status(500).json({success:false, message: 'Server Error'});
    }
});