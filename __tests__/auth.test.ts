import app from '../app';
import request from "supertest";

describe('authController', () => {
    it('Signup', async () => {
        const response = await request(app.callback()).post('/api/signup').send({
            login: 'user',
            password: 'qwerty123',
        });
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual({
            success: true,
            data: null,
        });
    })
});