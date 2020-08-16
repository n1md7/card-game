const {httpServer} = require('../../index');
const superTest = require('supertest');

describe('Test Api endpoints for create-room', () => {

    it('should auth and create a room and set cookies', async done => {
        // Sends GET Request to /create-room/:size/:isPublic endpoint
        const session = superTest.agent(httpServer);
        const myName = 'harry';
        const size = 3;
        const isPublic = +false;
        // this will keep set cookies for the next request
        await session.get(`/authenticate/${myName}`);
        const {status, body} = await session.get(`/create-room/${size}/${isPublic}`);
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


describe('Test Api endpoints for create-room', () => {
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
});

