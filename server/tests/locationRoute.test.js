import request from 'supertest';
import express from 'express';
import locationRoutes from '../routes/location.route.js';
import Location from '../models/location.model.js';
 
jest.mock('../models/location.model.js');
 
const app = express();
app.use(express.json());  
app.use(locationRoutes);  

describe('Location Routes', () => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});

    describe('GET /search', () => {
        it('returns 500 when there is a server error during search', async () => {
            Location.find.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/search?type=test');
            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe('Error fetching locations');
        });
    });

    describe('GET /locations', () => {
        it('returns status code 200 and a list of locations', async () => {
            Location.find.mockResolvedValue([{ name: 'Location 1' }, { name: 'Location 2' }]);

            const response = await request(app).get('/locations');
            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(2);
            expect(response.body).toEqual([{ name: 'Location 1' }, { name: 'Location 2' }]);
        });

        it('returns status code 404 if no locations are found', async () => {
            Location.find.mockResolvedValue([]);

            const response = await request(app).get('/locations');
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe('No locations found');
        });

        it('returns status code 500 if there is a server error', async () => {
            Location.find.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/locations');
            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe('Error fetching locations');
        });
    });

    describe('GET /search', () => {
        it('returns matching locations when search type is provided', async () => {
            Location.find.mockResolvedValue([
                { Name: 'Central Park' },
                { Name: 'Central Station' }
            ]);

            const response = await request(app).get('/search?type=Central');
            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(2);
        });

        it('returns 404 when no matching locations are found', async () => {
            Location.find.mockResolvedValue([]);

            const response = await request(app).get('/search?type=NonExistent');
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe('No locations found');
        });
    });

    describe('GET /locations/nearby', () => {
        it('returns nearby locations when valid coordinates are provided', async () => {
            Location.find.mockResolvedValue([
                { name: 'Nearby Location 1', lat: 40.7, lon: -74.0 },
                { name: 'Nearby Location 2', lat: 40.71, lon: -74.01 }
            ]);

            const response = await request(app)
                .get('/locations/nearby?lat=40.7&lon=-74.0&distance=1000');
            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(2);
        });

        it('returns 400 when coordinates are missing', async () => {
            const response = await request(app).get('/locations/nearby');
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe('Latitude and longitude are required');
        });

        it('returns 404 when no nearby locations are found', async () => {
            Location.find.mockResolvedValue([]);

            const response = await request(app)
                .get('/locations/nearby?lat=40.7&lon=-74.0');
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe('No nearby locations found');
        });

        it('handles invalid coordinate formats', async () => {
            Location.find.mockResolvedValue([]);

            const response = await request(app)
                .get('/locations/nearby?lat=invalid&lon=invalid');
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe('No nearby locations found');
        });

        it('uses default distance when not provided', async () => {
            Location.find.mockResolvedValue([
                { name: 'Default Distance Location', lat: 40.7, lon: -74.0 }
            ]);

            const response = await request(app)
                .get('/locations/nearby?lat=40.7&lon=-74.0');
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveLength(1);
        });

        it('handles locations with latitude/longitude fields instead of lat/lon', async () => {
            Location.find.mockResolvedValue([
                { name: 'Location', latitude: 40.7, longitude: -74.0 }
            ]);

            const response = await request(app)
                .get('/locations/nearby?lat=40.7&lon=-74.0');
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveLength(1);
        });
    });

    describe('GET /filter', () => {
        it('returns filtered playground locations', async () => {
            Location.find.mockResolvedValue([
                { 
                    location_type: 'playground',
                    Accessible: 'Yes',
                    'Sensory-Friendly': 'Yes'
                }
            ]);

            const response = await request(app)
                .get('/filter?location_type=playground&accessible=Yes&sensory_friendly=Yes');
            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(1);
        });

        it('returns filtered beach locations', async () => {
            Location.find.mockResolvedValue([
                { 
                    location_type: 'beach',
                    Accessible: 'Yes',
                    Bathrooms: 'Yes',
                    Boardwalk: 'Yes'
                }
            ]);

            const response = await request(app)
                .get('/filter?location_type=beach&accessible=Yes&bathrooms=Yes&boardwalk=Yes');
            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(1);
        });

        it('returns 400 for invalid location type', async () => {
            const response = await request(app)
                .get('/filter?location_type=invalid');
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe('Invalid location type');
        });

        it('returns 404 when no matching filtered locations are found', async () => {
            Location.find.mockResolvedValue([]);

            const response = await request(app)
                .get('/filter?location_type=playground&accessible=Yes');
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe('No locations found');
        });

        it('handles server errors during filtering', async () => {
            Location.find.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get('/filter?location_type=playground');
            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe('Error fetching locations');
        });

        it('filters pedestrian signal locations', async () => {
            Location.find.mockResolvedValue([{
                location_type: 'pedestrian_signal',
                Accessible: 'Yes',
                borough: 'Manhattan'
            }]);

            const response = await request(app)
                .get('/filter?location_type=pedestrian_signal&accessible=Yes&borough=Manhattan');
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveLength(1);
        });

        it('filters restroom locations', async () => {
            Location.find.mockResolvedValue([{
                location_type: 'restroom',
                Accessible: 'Yes',
                restroom_type: 'Public',
                operator: 'Parks',
                changing_stations: 'Yes'
            }]);

            const response = await request(app)
                .get('/filter?location_type=restroom&accessible=Yes&restroom_type=Public&operator=Parks&changing_station=Yes');
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveLength(1);
        });

        it('filters subway station locations', async () => {
            Location.find.mockResolvedValue([{
                location_type: 'restroom',
                Accessible: 'Yes',
                station_line: 'A',
                ADA_Status: 'Accessible'
            }]);

            const response = await request(app)
                .get('/filter?location_type=restroom&accessible=Yes&station_line=A&ada_status=Accessible');
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveLength(1);
        });

        it('handles missing optional filter parameters', async () => {
            Location.find.mockResolvedValue([{
                location_type: 'playground',
                Accessible: 'Yes'
            }]);

            const response = await request(app)
                .get('/filter?location_type=playground&accessible=Yes');
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveLength(1);
        });

        it('handles multiple filter parameters for same location type', async () => {
            Location.find.mockResolvedValue([{
                location_type: 'playground',
                Accessible: 'Yes',
                'Sensory-Friendly': 'Yes',
                'ADA_Accessible_Comfort_Station': 'Yes'
            }]);

            const response = await request(app)
                .get('/filter?location_type=playground&accessible=Yes&sensory_friendly=Yes&ada_accessible_comfort_station=Yes');
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveLength(1);
        });

        it('handles empty filter parameters', async () => {
            const response = await request(app)
                .get('/filter');
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe('Invalid location type');
        });
    });
});