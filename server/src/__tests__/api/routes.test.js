const {httpServer} = require('../../index');
const superTest = require('supertest');

const request = superTest(httpServer);

describe('Test default responses fromm the endpoints', () => {
    it('should test /status-check', async done => {
        // Sends GET Request to /status-check endpoint
        const response = await request.get('/api/status-check');
        const statusUp = {
            status: 'up'
        };
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(statusUp);
        done();
    });

    it.skip('should return error message', async done => {
        // Sends GET Request to /authenticate/:name endpoint
        const response = await request.get('/api');
        expect(response.status).toBe(200);
        done();
    });

    it('should test /create-room', async done => {
        // Sends GET Request to /authenticate/:name endpoint
        const {status, body} = await request.post('/api/create-room')
            .send({
                isPublic: 1,
                name: 'Jora',
                size: 33
            });
        expect(status).toBe(200);
        expect(body).toEqual(
            expect.objectContaining({
                ok: false,
                msg: expect.any(String)
            })
        );
        done();
    });

    it('should test /show-rooms', async done => {
        // Sends GET Request to /authenticate/:name endpoint
        const {status, body} = await request.get('/api/show-rooms');
        expect(status).toBe(200);
        expect(body).toEqual(
            expect.objectContaining({
                ok: true,
                rooms: expect.any(Object)
            })
        );
        done();
    });

    it('should test /join-room', async done => {
        const {status, body} = await request.post('/api/join-room')
            .send({
                id: 'R-234',
                name: 'Nuca'
            });
        expect(status).toBe(200);
        expect(body).toEqual(
            expect.objectContaining({
                ok: false,
                msg: expect.any(String)
            })
        );
        done();
    });

    it('should test /leave-room', async done => {
        const {status, body} = await request.get('/api/leave-room');
        expect(status).toBe(200);
        // should fail cause no cookie representing userId is missing
        expect(body).toEqual(
            expect.objectContaining({
                ok: false,
                msg: expect.any(String)
            })
        );
        done();
    });
});

describe('Test Api endpoints with all routes', () => {
    let session, http;
    beforeAll(() => {
        let server = require('../../index');
        http = server.httpServer;
        session = superTest.agent(http);
    });

    afterAll(() => {
       http.close();
       session = null;
    });

    it('should create a room', async done => {
        // Sends GET Request to /create-room/:size/:isPublic endpoint
        const size = 4;
        const isPublic = +true;
        const {status, body} = await session.post(`/api/create-room`)
            .send({
                size, isPublic, name: 'Nacho Varga'
            });
        // should fail cause the cookie is not defined
        expect(status).toBe(200);
        expect(body).toEqual(
            expect.objectContaining({
                ok: true,
                roomId: expect.any(String)
            })
        );
        done();
    });
});


