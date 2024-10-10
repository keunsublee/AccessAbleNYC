import request from 'supertest'
import express from 'express';
import userRoute from '../routes/user.route.js'; // Adjust the path if necessary
import User from '../models/users.model.js';
import bcrypt from 'bcrypt';

// Create an Express application for testing
const app = express();
app.use(express.json());
<<<<<<< HEAD
app.use("/", userRoute);
=======
app.use("", userRoute);
>>>>>>> 91a09425f846e9ade461c48bc76e5e61329511aa

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
<<<<<<< HEAD

    });
    it('should send a 409 response status if the email are duplicates', async () => {
        User.mockImplementation(() => ({
            save: jest.fn().mockRejectedValue({code:11000})
        }));
=======
    });
    it('should send a 409 response status if the email are duplicates', async () => {
        User.mockImplementation(() => ({
            save: jest.fn().mockRejectedValue({ code: 11000 })
        }));
            
>>>>>>> 91a09425f846e9ade461c48bc76e5e61329511aa

        const res = await request(app).post("/register").send({
            name: 'example',
            email: 'hehe@gmail.com',
            password: 'example'
        });
<<<<<<< HEAD

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
=======
        console.log('Response:', res.body); 
        console.log('Response:', res.statusCode); 
        expect(res.status).toBe(409);
        expect(res.body.success).toBe(false);

>>>>>>> 91a09425f846e9ade461c48bc76e5e61329511aa
    });
})