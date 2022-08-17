const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../index')
const User = require('../database/models/users')
const mongoose = require('../database/dbConection')

describe('test the recipes API', () => {
    beforeAll(async () => {
        // create a test user
        await User.create({
            username: 'prajwal',
            password: bcrypt.hashSync('cool', 10)
        });
    });
    afterAll(async () => {
        await User.deleteMany({ username: 'prajwal' });
        mongoose.disconnect();
    })
    // test login
    describe('POST/login', () => {
        it('authenticate user and sign him in', async () => {
            // Data you want to save to DB
            const user = {
                username: 'prajwal',
                password: 'cool'
            };
            const res = await request(app).post('/login').send(user);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(
                expect.objectContaining({
                    accessToken: res.body.accessToken,
                    success: true,
                    data: expect.objectContaining({
                        id: res.body.data.id,
                        username: res.body.data.username
                    }),
                }),
            );
        });
        it('do not sign him in, password field can not be empty',
            async () => {
                const user = {
                    password: 'cool'
                };
                const res = await request(app).post('/login').send(user);
                expect(res.statusCode).toEqual(400);
                expect(res.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: 'username or password can not be empty'
                    }),
                );
            });
        it('do not sign him in, username field can not be empty',
            async () => {
                const user = {
                    username: 'prajwal'
                };
                const res = await request(app).post('/login').send(user);
                expect(res.statusCode).toEqual(400);
                expect(res.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: 'username or password can not be empty'
                    }),
                );
            });
        it('do not sign him in, username does not exist',
            async () => {
                const user = {
                    username: 'jenna',
                    password: 'cool'
                };
                const res = await request(app).post('/login').send(user);
                expect(res.statusCode).toEqual(400);
                expect(res.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: 'Incorrect username or password'
                    }),
                );
            });
        it('do not sign him in, incorrect password',
            async () => {
                const user = {
                    username: 'prajwal',
                    password: 'trouble'
                };
                const res = await request(app).post('/login').send(user);
                expect(res.statusCode).toEqual(400);
                expect(res.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: 'Incorrect username or password'
                    }),
                );
            });
    });
});
