const {default: setup} = require('../../../model/AuthModel');
const {store} = require('../../../store');

describe('Test setup CRUD operations', () => {
    const userId = 'U-345f';
    const roomId = 'R-402h';
    const userName = 'Giorgi';
    const size = 4;
    const isPublic = true;

    it('should fail because there is no user yet', () => {
        const signIn = setup.signIn(userId, userName);
        expect(signIn).toBeNull();
    });

    it('should signUp a new user', () => {
        const signUp = setup.signUp(userId, userName);
        expect(signUp).toEqual(
            expect.objectContaining({
                name: userName,
                id: userId,
                signUpTime: expect.any(Number),
                updateTime: expect.any(Number)
            })
        );
    });

    it('should succeed', () => {
        const signIn = setup.signIn(userId, userName);
        expect(signIn).toEqual(
            expect.objectContaining({
                id: userId,
                name: userName,
                signUpTime: expect.any(Number),
                updateTime: expect.any(Number),
            })
        );
    });

    it('should fail with the exception message', () => {
        const tmpUsrId = 'U-11111';
        expect(() =>
            setup.createRoom({
                userId: tmpUsrId,
                roomId,
                size,
                isPublic
            })
        ).toThrowError(`no such user with the id:${tmpUsrId}`);
    });

    it('should create a new room', () => {
        const room = setup.createRoom({
            userId,
            roomId,
            size,
            isPublic
        });

        expect(room).toEqual(
            expect.objectContaining({
                creator: {id: userId, name: userName},
                id: roomId,
                inRoomSize: 1,
                isPublic,
                name: userName,
                size,
                users: [userId],
                signUpTime: expect.any(Number),
                updateTime: expect.any(Number),
            })
        );
    });

    it.skip('should not fail with the exception message and should return a current user', () => {
        expect(() =>
            setup.joinRoom({
                userId,
                id: roomId
            })
        ).toThrowError(`you cannot double join the room`);
    });

    it('should fail with the exception message', () => {
        const tmpRoomId = 'R-0000';
        expect(() =>
            setup.joinRoom({
                userId,
                id: tmpRoomId
            })
        ).toThrowError(`could not find a room to join with the id:${tmpRoomId}`);
    });

    it('should fail with the exception message', () => {
        expect(() =>
            setup.createRoom({
                userId,
                roomId,
                size,
                isPublic
            })
        ).toThrowError(`you cannot re-create existing room: ${roomId}`);
    });

    it('should fail with the exception message', () => {
        setup.leaveRoom(userId);
        // leave room and users in that room will be zero
        expect(store.getRoomsList()[roomId].inRoomSize).toBe(0);
    });

    it('should fail with the exception message', () => {
        // which does not exist
        const tmpUserId = 'U-0000';
        expect(() =>
            setup.joinRoom({
                userId: tmpUserId,
                id: roomId
            })
        ).toThrowError(`could not find a user with the id:${tmpUserId}`);
    });

    it('should join the table', () => {
        const _2ndUserName = 'Harry';
        const _2ndUserId = 'U-1234';
        const _2ndRoomId = 'R-1234';
        setup.signUp(_2ndUserId, _2ndUserName);
        const joinedRoom = setup.joinRoom({
            userId: _2ndUserId,
            id: roomId
        });

        expect(joinedRoom).toEqual(
            expect.objectContaining({
                creator: {id: userId, name: userName},
                name: userName,
                users: [_2ndUserId],
                size: 4,
                isPublic: true,
                id: roomId,
                inRoomSize: 1,
                signUpTime: expect.any(Number),
                updateTime: expect.any(Number)
            })
        );

        setup.leaveRoom(_2ndUserId);

        const room = setup.createRoom({
            userId: _2ndUserId,
            roomId: _2ndRoomId,
            size,
            isPublic
        });

        setup.leaveRoom(_2ndUserId);

        setup.joinRoom({
            id: _2ndRoomId,
            userId: _2ndUserId
        });

        expect(() =>
            setup.joinRoom({
                id: roomId,
                userId: _2ndUserId
            })
        ).toThrowError(`you need to leave the table first with the id:${_2ndRoomId}`)
    });

    it('should fail with the exception message', () => {
        // which does not exist
        const tmpUserId = 'U-0000';
        expect(() =>
            setup.leaveRoom(tmpUserId)
        ).toThrowError(`could not find a user with the id:${tmpUserId}`);
    });

    it('should fail with the exception message', () => {
        // empty users BaseStore
        store.clearUsers();
        // which does not exist
        const tmpUserId = 'U-0000';
        expect(() =>
            setup.leaveRoom(tmpUserId)
        ).toThrowError(/^could not find a user with the id/);
    });
});