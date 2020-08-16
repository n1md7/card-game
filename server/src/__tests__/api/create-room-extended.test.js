const {httpServer} = require('../../index');
const superTest = require('supertest');

describe('Create room with extended requests', () => {
    it('should auth, get list of rooms and join one of them', async done => {
        const session1 = superTest.agent(httpServer);
        const session2 = superTest.agent(httpServer);
        const creatorName = 'Jora Kekluci';
        // this will keep set cookies for the next request
        const r1 = await session1.get(`/authenticate/${creatorName}`);
        const creatorId = r1.body.user.id;
        const size = 2;
        const isPublic = +false;
        // create and join the room
        await session1.get(`/create-room/${size}/${isPublic}`);
        const {body, status} = await session2.get(`/show-rooms`);
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
        const r3 = await session2.get(`/authenticate/${player}`);
        // join room with the id
        const {body: joinBody, status: joinStatus} = await session2.get(`/join-room/${roomId}`);
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
});
