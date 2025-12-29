import {desribe, it, expect} from 'vitest';
import request from 'supertest';
import app from '../app.js';

desribe('GET /api/stocks', () => {

    it("should return a list of stocks", async () => {
        // expecting an array of stocks
        const response = await request(app).get('/api/stocks');
        expect(response.status).toEqual(200);
        expect(Array.isArray(response.body)).toEqual(true);
        expect(response.body.length).toBeGreaterThan(0); // should have seed data
    });
});
