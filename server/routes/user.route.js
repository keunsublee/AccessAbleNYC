import mongoose from 'mongoose';
import express from 'express';
import User from '../models/users.model.js';

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
        return res.status(404).json({sucess: false, message: 'Invalid User Id'});
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
        return res.status(404).json({sucess: false, message: 'Invalid User Id'});
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
        return res.status(400).json({sucess:false, message: 'Please provide all fields'});
    };

    const newUser = new User(user);

    try {
        await newUser.save();
        res.status(201).json({success: true, data: newUser});
    } catch(error) {
        console.log("Error in creating user: ", error.message);
        res.status(500).json({sucess: false, message: "Server Error"});
    }
});

//updates user
router.put('/:id', async (req,res) => {
    const {id} = req.params;

    const user = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({sucess: false, message: 'Invalid Id'});
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(id, user, {new:true});
        res.status(200).json({ success:true, data: updatedUser});
    } catch (error) {
        res.status(500).json({success:false, message: 'Server Error'});
    }
});

export default router;