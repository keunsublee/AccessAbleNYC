import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import reviewroute from '../routes/review.route.js'; 

process.env.SECRET_ACCESS_TOKEN = 'test_secret';

const app = express();
app.use(express.json());
app.use(reviewroute);

jest.mock('mongoose', () => {
  const originalMongoose = jest.requireActual('mongoose');
  return {
    ...originalMongoose,
    Types: {
      ObjectId: {
        isValid: jest.fn()
      }
    }
  };
});

describe('Test Review Routes', () => {
  const validToken = jwt.sign({ id: 'testuser' }, process.env.SECRET_ACCESS_TOKEN);
  const invalidToken = 'invalid_token';
  const locationId = '000000';
  const invalidLocationId = 'invalidLocationId';

  beforeEach(() => {
    mongoose.Types.ObjectId.isValid.mockReset();
  });

  test('POST /review/:locationId - User not authenticated', async () => {
    const res = await request(app)
      .post(`/review/${locationId}`)
      .send({
        rating: 4,
        review: 'mock review'
      });
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ success: false, message: 'User not authenticated' });
});

test('POST /review/:locationId - Invalid or expired token', async () => {
    const res = await request(app)
      .post(`/review/${locationId}`)
      .set('Authorization', `Bearer ${invalidToken}`)
      .send({
        rating: 4,
        review: 'mock review'
      });
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ success: false, message: 'Invalid or expired token' });
});

  test('POST /review/:locationId - Invalid Location ID', async () => {
    mongoose.Types.ObjectId.isValid.mockReturnValue(false);

    const res = await request(app)
      .post(`/review/${invalidLocationId}`)
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        rating: 4,
        review: 'mock review'
      });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ success: false, message: 'Invalid Location' });
  });

  test('GET /review/:locationId - Invalid Location ID', async () => {
    mongoose.Types.ObjectId.isValid.mockReturnValue(false);

    const res = await request(app)
      .get(`/review/${invalidLocationId}`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ success: false, message: 'Invalid Location' });
  });

});
