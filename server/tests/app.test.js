import {describe, it, expect} from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe("GET /api/health", () => {
    it("should return 200 OK and a status message", async () => {
        const response = await request(app).get("/api/health");
        
        // assertions
        expect(response.status).toEqual(200);
        expect(response.body).toEqual({status: "ok"});
    });

    it("should return 404 JSON error for unknown routes", async () => {
        const response = await request(app).get("/api/unknown-route");
        expect(response.status).toBe(404);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body).toEqual({error: 'Not Found'});
    });
});



