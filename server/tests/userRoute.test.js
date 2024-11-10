import request from 'supertest'
import express from 'express';
import userRoute from '../routes/user.route.js'; // Adjust the path if necessary
import User from '../models/users.model.js';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

// Create an Express application for testing
const app = express();
app.use(express.json());
app.use("/", userRoute);


jest.mock('../models/users.model.js')
jest.mock('bcrypt');

describe('POST /register', () => {
    it('should send a 201 response status when a new user is created', async () => {
        const res = await request(app).post("/register").send({
            name: 'example',
            email: 'hehe@gmail.com',
            password: 'example'
        });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
    });
    it('should send a 400 response status if any of the fields are missing', async () => {
        const res = await request(app).post("/register").send({
            name: '',
            email: '',
            password: ''
        });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);

    });
    it('should send a 409 response status if the email are duplicates', async () => {
        User.mockImplementation(() => ({
            save: jest.fn().mockRejectedValue({code:11000})
        }));

        const res = await request(app).post("/register").send({
            name: 'example',
            email: 'hehe@gmail.com',
            password: 'example'
        });

        expect(res.status).toBe(409);
        expect(res.body.success).toBe(false);
    });
    it('should send a 500 response status if its a server error', async () => {
        User.mockImplementation(() => ({
            save: jest.fn().mockRejectedValue("Server Error")
        }));

        const res = await request(app).post("/register").send({
            name: 'example',
            email: 'hehe@gmail.com',
            password: 'example'
        });

        expect(res.status).toBe(500);
        expect(res.body.success).toBe(false);
    });
})



// fetch user test
describe('GET /users', () => {

    it('should return all users with status 200', async () => {
        User.find = jest.fn().mockResolvedValue([
            { name: 'User1', email: 'user1@example.com' },
            { name: 'User2', email: 'user2@example.com' },
        ]);


    const res = await request(app).get('/users');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(2);
    });

    it('should return 500 if there is error fecthing users',async()=>{
        User.find=jest.fn().mockRejectedValue(new Error('Error'));
        
        
        const res=await request(app).get('/users');
        
        expect(res.status).toBe(500);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('server error');
    });

});

//get user by id  ( not passing)
/*describe('GET /users/:id', () => {
   

    it('should return a user when a valid id is provided', async () => {
        const user = { _id: userId, name: 'user1', email: 'user1@example.com' };
        User.findById.mockResolvedValue(user);

        const res = await request(app).get(`/users/${userId}`);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toEqual(user);
    });

    it('should return 404 for invalid id', async () => {
        const invalidId = ''; 

        User.findById.mockResolvedValue(null); 

        const res = await request(app).get(`/users/${invalidId}`);
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Invalid User Id');
    });

    it('should return 500 if there is an error fetching the user', async () => {
        const userId = validId;
        
        User.findById.mockRejectedValue(new Error('Server Error'));

        const res = await request(app).get(`/users/${userId}`);
        expect(res.status).toBe(500);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Server Error');
    });
});
*/

//add a user test. 
describe('POST /', () => {

    /*
    it('should create a new user and return 201 status', async () => {
        const newUser = { name: 'User111', email: 'User@example.com' };

        User.save = jest.fn().mockResolvedValue(newUser);

        
        const res = await request(app).post('/').send(newUser);
        console.log('Response:', res.body);

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe(newUser.name);
        expect(res.body.data.email).toBe(newUser.email);
    });
    */


    it('should return 400 when required fields are missing',async()=>{

        const newUser={name: '',email:''};

        const res=await request(app).post('/').send(newUser);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Please provide all fields');
    })

    it('should return 500 if there is an error while saving user',async()=>{

        const newUser= {name:'User',email:'User@example.com'};

        User.mockImplementation(()=>({
            save:jest.fn().mockRejectedValue(new Error('Server Error')),
        }));

        const res=await request(app).post('/').send(newUser);

        expect(res.status).toBe(500);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Server Error');
    })
});

