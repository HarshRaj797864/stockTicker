import {describe, it, expect} from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('GET /api/stocks', () => {

    it("should return a list of stocks", async () => {
        // expecting an array of stocks
        const response = await request(app).get('/api/stocks');
        expect(response.status).toEqual(200);
        expect(Array.isArray(response.body.data)).toEqual(true);
        expect(response.body.data.length).toBeGreaterThan(0); // should have seed data
    });
    it("should return data wrapped in an object with metadata", async () => {
        const response = await request(app).get('/api/stocks?page=1&limit=2');
        expect(response.status).toEqual(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('meta');
        expect(response.body.meta).toMatchObject({
            page: 1,
            limit: 2,
            totalCount: expect.any(Number),
        });
    });
    it("should return AAPL stock object", async () => {
        const response = await request(app).get('/api/stocks/AAPL');
        expect(response.status).toEqual(200);
        expect(response.body).toMatchObject({
            symbol: "AAPL"
        });
    });
    it("should gracefully return 400 error if page or limit values are wrong", async () => {
        const response = await request(app).get('/api/stocks?page=hello&limit=2');
        expect(response.status).toEqual(400);
        expect(response.body).toEqual({error: "Invalid pagination values"});
    });
    it("should gracefully return 404 error for a ticker that doesn't exist", async () => {
        const response = await request(app).get('/api/stocks/FAKE');
        expect(response.status).toEqual(404);
        expect(response.body).toEqual({error: "Stock Not Found"});
    });
});
