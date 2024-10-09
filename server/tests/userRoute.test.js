import Router from '../routes/user.route.js';
import User from '../models/users.model.js';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


jest.mock('../models/users.model.js');
jest.mock('bcrypt');
describe('POST /register', () => {
    let req, res; 
    beforeEach(() => {
        req = {
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        console.error = jest.fn(); 
    });
    afterEach(() => {
        jest.clearAllMocks();
        console.error.mockRestore();
    });
    it('should send a 400 response status if any of the fields are missing', async () => {
        const userInfo = { 
            name: '',
            email: '',
            password: ''
        };

        req.body = userInfo;
        
        await Router.handle({ method: 'POST', url: '/register', ...req }, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Please provide all fields' });
    });
    it('should send a 201 response status if the user is created', async () => {
        const userInfo = { 
            name: 'lmfao',
            email: 'lmfao@gmail.com',
            password: 'lmfao'
        };

        req.body = userInfo;
        
        expect(userInfo.save).toHaveBeenCalled();

        await Router.handle({ method: 'POST', url: '/register', ...req }, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({success: true, data: expect.any(Object)});
    });
})