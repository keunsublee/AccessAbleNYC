import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { jest } from '@jest/globals';
import feedbackRouter from '../routes/feedback.route.js';
import Feedback from '../models/feedback.model.js';

const app = express();
app.use(express.json());
app.use(feedbackRouter);

jest.mock('../models/feedback.model.js');

describe('Feedback Route Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('POST /feedback', () => {
    test('should create new feedback successfully', async () => {
      const mockFeedback = {
        email: 'test@example.com',
        feedback: 'Great service!'
      };
      const mockMongooseDoc = {
        ...mockFeedback,
        _id: new mongoose.Types.ObjectId(),
        save: jest.fn().mockResolvedValueOnce({
          toJSON: () => mockFeedback
        })
      };

      Feedback.mockImplementation(() => mockMongooseDoc);

      const response = await request(app)
        .post('/feedback')
        .send(mockFeedback);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        success: true,
        message: 'Feedback Sent',
        data: expect.objectContaining({
          email: mockFeedback.email,
          feedback: mockFeedback.feedback
        })
      });
    });

    test('should return 400 if email is missing', async () => {
      const mockFeedback = {
        feedback: 'Great service!'
      };

      const response = await request(app)
        .post('/feedback')
        .send(mockFeedback);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        message: 'Please provide all fields'
      });
    });

    test('should return 400 if feedback is missing', async () => {
      const mockFeedback = {
        email: 'test@example.com'
      };

      const response = await request(app)
        .post('/feedback')
        .send(mockFeedback);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        message: 'Please provide all fields'
      });
    });

    test('should return 409 if feedback already exists', async () => {
      const mockFeedback = {
        email: 'test@example.com',
        feedback: 'Great service!'
      };

      const mockMongooseDoc = {
        ...mockFeedback,
        save: jest.fn().mockRejectedValueOnce({
          code: 11000,
          message: 'Duplicate key error'
        })
      };

      Feedback.mockImplementation(() => mockMongooseDoc);

      const response = await request(app)
        .post('/feedback')
        .send(mockFeedback);

      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        success: false,
        message: 'Feedback already sent'
      });
    });

    test('should return 500 for server errors', async () => {
      const mockFeedback = {
        email: 'test@example.com',
        feedback: 'Great service!'
      };

      const mockMongooseDoc = {
        ...mockFeedback,
        save: jest.fn().mockRejectedValueOnce(new Error('Server error'))
      };

      Feedback.mockImplementation(() => mockMongooseDoc);

      const response = await request(app)
        .post('/feedback')
        .send(mockFeedback);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        message: 'Server Error'
      });
    });
  });
});