import config, { token } from '../../config';
import Server from '../../server';
import superTest from 'supertest';
import axios from 'axios';

describe('Create room with extended requests', () => {
  let httpServer = null;

  beforeAll(() => {
    config.server.port = 34567;
    config.origin = 'http://127.0.0.1:34567';
    const server = new Server(config);
    server.init();
    server.startSocket();
    httpServer = server.startServer();
  });

  afterAll(() => {
    httpServer.close();
  });

  it.skip('should auth, get list of rooms and join one of them', (done) => {
    axios
      .get('http://127.0.0.1:34567/health-check', {
        headers: {
          [token.self]: 'aa.bb.cc',
        },
      })
      .then((resp) => {
        console.log({ resp });
        done(0);
      })
      .catch((err) => {
        console.log({ err });
        done();
      });
    // const chrome = superTest.agent(httpServer);
    // const firefox = superTest.agent(httpServer);
    // const creatorName = 'Walter White';
    // const chromeAuthRequest = await chrome.get(`/api/v1/init`);
    // const chromeGetUserInfoRequest = await chrome.get(`/api/user-info`).set('token', chromeAuthRequest.body.token);
    // expect(chromeGetUserInfoRequest.body).toEqual(
    //   expect.objectContaining({
    //     ok: true,
    //     user: expect.objectContaining({
    //       id: expect.any(String),
    //       name: null,
    //     }),
    //   }),
    // );
    // const chromeUserId = chromeGetUserInfoRequest.body.user.id;
    // const size = 2;
    // const isPublic = +false;
    // // create and join the room
    // const chromeCreateJoinRoomRequest = await chrome
    //   .post(`/api/create-room`)
    //   .send({
    //     size,
    //     isPublic,
    //     name: creatorName,
    //   })
    //   .set('token', chromeAuthRequest.body.token);
    // expect(chromeCreateJoinRoomRequest.body).toEqual(
    //   expect.objectContaining({
    //     ok: true,
    //     roomId: expect.any(String),
    //   }),
    // );
    //
    // // let another user refresh the available tables and try to join one
    // const firefoxAuthRequest = await firefox.get(`/api/init`);
    // expect(firefoxAuthRequest.status).toBe(200);
    // const firefoxShowRoomsRequest = await firefox.get(`/api/show-rooms`).set('token', firefoxAuthRequest.body.token);
    // expect(firefoxShowRoomsRequest.body).toEqual(
    //   expect.objectContaining({
    //     ok: true,
    //     rooms: expect.arrayContaining([
    //       expect.objectContaining({
    //         id: expect.any(String),
    //         inRoomSize: expect.any(Number),
    //         size: expect.any(Number),
    //         creator: expect.objectContaining({
    //           name: expect.any(String),
    //         }),
    //       }),
    //     ]),
    //   }),
    // );
    // // get first available room object from the list
    // const [roomToJoin] = firefoxShowRoomsRequest.body.rooms;
    // const firefoxUser = 'Firefox User';
    // // join room with the id
    // const firefoxRoomJoinRequest = await firefox
    //   .post(`/api/join-room`)
    //   .send({
    //     id: roomToJoin.id,
    //     name: firefoxUser,
    //   })
    //   .set('token', firefoxAuthRequest.body.token);
    // expect(firefoxRoomJoinRequest.status).toBe(200);
    // expect(firefoxRoomJoinRequest.body).toEqual(
    //   expect.objectContaining({
    //     ok: true,
    //     room: expect.objectContaining({
    //       id: roomToJoin.id,
    //       inRoomSize: expect.any(Number),
    //       size: expect.any(Number),
    //       creator: expect.objectContaining({
    //         name: expect.any(String),
    //       }),
    //     }),
    //   }),
    // );
    // done();
  });
});
