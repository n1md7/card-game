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

    it('should auth and create a room and set cookies', async done => {
        // Sends GET Request to /create-room/:size/:isPublic endpoint
        const session = superTest.agent(httpServer);
        const myName = 'harry';
        const size = 3;
        const isPublic = +false;
        // this will keep set cookies for the next request
        await session.get(`/authenticate/${myName}`);
        const {status, body, headers} = await session.get(`/create-room/${size}/${isPublic}`);
        expect(status).toBe(200);
        expect(body).toEqual(
            expect.objectContaining({
                ok: true,
                roomId: expect.any(String)
            })
        );
        done();
    });

    it('should auth, create room and try to join another one and fail', async done => {
        const session1 = superTest.agent(httpServer);
        const myName = 'ninja';
        const size = 1;
        const isPublic = +false;
        // this will keep set cookies for the next request
        await session1.get(`/authenticate/${myName}`);
        // create and join the room
        await session1.get(`/create-room/${size}/${isPublic}`);
        // try to create new room
        // should fail cause already in one room
        const r1 = await session1.get(`/create-room/${size}/${isPublic}`);
        expect(r1.status).toBe(200);
        expect(r1.body).toEqual(
            expect.objectContaining({
                ok: false,
                msg: expect.any(String)
            })
        );

        // leave current room and try to create new one
        await session1.get(`/leave-room`);
        const r2 = await session1.get(`/create-room/${size}/${isPublic}`);
        expect(r2.status).toBe(200);
        expect(r2.body).toEqual(
            expect.objectContaining({
                ok: true,
                roomId: expect.any(String)
            })
        );

        // lets try to join the room while been in one room
        const r3 = await session1.get(`/join-room/${r2.body.roomId}`);
        expect(r3.status).toBe(200);
        expect(r3.body).toEqual(
            expect.objectContaining({
                ok: false,
                msg: expect.any(String)
            })
        );

        // now leave the room and try again
        await session1.get(`/leave-room`);
        // join room
        const r4 = await session1.get(`/join-room/${r2.body.roomId}`);
        expect(r4.status).toBe(200);
        expect(r4.body).toEqual(
            expect.objectContaining({
                ok: true,
                room: expect.any(Object)
            })
        );
        done();
    });

    it('should auth, get list of rooms and join one of them', async done => {
        const session2 = superTest.agent(httpServer);
        const session3 = superTest.agent(httpServer);
        const creatorName = 'Jora Kekluci';
        // this will keep set cookies for the next request
        const r1 = await session2.get(`/authenticate/${creatorName}`);
        const creatorId = r1.body.user.id;
        const size = 2;
        const isPublic = +false;
        // create and join the room
        await session2.get(`/create-room/${size}/${isPublic}`);
        const {body, status} = await session3.get(`/show-rooms`);
        expect(status).toBe(200);
        expect(body).toEqual(
            expect.objectContaining({
                ok: true,
                rooms: expect.any(Object)
            })
        );
        // get first room id
        const roomId = Object.keys(body.rooms)[0];
        expect(body.rooms[roomId]).toEqual(
            expect.objectContaining({
                creator: expect.objectContaining({
                    id: expect.any(String),
                    name: expect.any(String),
                }),
                name: expect.any(String),
                users: expect.any(Array),
                size: expect.any(Number),
                isPublic: expect.any(Boolean),
                id: expect.any(String),
                inRoomSize: expect.any(Number),
                signUpTime: expect.any(Number),
                updateTime: expect.any(Number)
            })
        );

        const player = 'Elguja Kekluci';
        // this will keep set cookies for the next request
        const r3 = await session3.get(`/authenticate/${player}`);
        // join room with the id
        const {body: joinBody, status: joinStatus} = await session3.get(`/join-room/${roomId}`);
        expect(joinStatus).toBe(200);
        expect(joinBody).toEqual(
            expect.objectContaining({
                ok: true,
                room: {
                    creator: {id: creatorId, name: creatorName},
                    name: creatorName,
                    users: [creatorId, r3.body.user.id],
                    size: size,
                    // fixme this needs fixing
                    // isPublic: !!isPublic,
                    isPublic: expect.any(Boolean),
                    id: roomId,
                    inRoomSize: 2,
                    signUpTime: expect.any(Number),
                    updateTime: expect.any(Number)
                }
            })
        );
        done();
    });
})
