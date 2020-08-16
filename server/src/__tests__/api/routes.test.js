const {httpServer} = require('../../index');
const superTest = require('supertest');

const request = superTest(httpServer);

describe('Test default responses fromm the endpoints', () => {
    it('should test /status-check', async done => {
        // Sends GET Request to /status-check endpoint
        const response = await request.get('/status-check');
        const statusUp = {
            status: 'up'
        };
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(statusUp);
        done();
    });

    it('should return error message', async done => {
        // Sends GET Request to /authenticate/:name endpoint
        const response = await request.get('/authenticate');
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            ok: false
        });
        expect(response.body).toMatchObject({
            msg: 'name is empty'
        });
        done();
    });

    it('should test /create-room/:size/:isPublic', async done => {
        // Sends GET Request to /authenticate/:name endpoint
        const {status, body} = await request.get('/create-room/2/1');
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
        const {status, body} = await request.get('/show-rooms');
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
        // Sends GET Request to /authenticate/:name endpoint
        const r1 = await request.get('/join-room');
        expect(r1.status).toBe(404);

        const {status, body} = await request.get('/join-room/R-123');
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
        // Sends GET Request to /authenticate/:name endpoint
        const {status, body} = await request.get('/leave-room');
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

    it('should return auth user', async done => {
        // Sends GET Request to /authenticate/:name endpoint
        const myName = 'james';
        const {status, body} = await request.get(`/authenticate/${myName}`);
        expect(status).toBe(200);
        expect(body).toMatchObject({
            ok: true
        });
        expect(body).toHaveProperty('user');
        expect(body).toEqual(
            expect.objectContaining({
                user: {
                    name: myName,
                    id: expect.any(String),
                    signUpTime: expect.any(Number),
                    updateTime: expect.any(Number)
                },
                ok: true
            })
        );
        done();
    });

    it('should not create a room', async done => {
        // Sends GET Request to /create-room/:size/:isPublic endpoint
        const size = 4;
        const isPublic = +true;
        const {status, body} = await request.get(`/create-room/${size}/${isPublic}`);
        // should fail cause the cookie is not defined
        expect(status).toBe(200);
        expect(body).toEqual(
            expect.objectContaining({
                ok: false,
                msg: expect.any(String)
            })
        );
        done();
    });

});

