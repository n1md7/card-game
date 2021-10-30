require('dotenv').config({ path: '.env.test' });
import config from '../../config';
import Server from '../../server';
import axios from 'axios';
import { copy } from '../../helpers/extras';
import { Token } from '../../types';
import io from 'socket.io-client';
import { gameStore, playerStore, userStore } from '../../store';

describe('Sockets', () => {
  const ref = {
    httpServer: null,
    myConfig: null,
    request: null,
    ioServer: null,
    socket: null,
    token: null,
    userId: null,
  };

  /**
   * @description Helper function to connect the client
   * @param {string} name
   * @returns {Promise<{token: string, userId: string, socket: Object, name: string}>}
   */
  const clientConnect = (name) =>
    new Promise(async (resolve) => {
      const {
        data: { token = null, userId = null },
      } = await ref.request.get('/auth/init');
      ref.socket = io.connect(`http://${ref.myConfig.server.hostname}:${ref.myConfig.server.port}`, {
        query: `token=${token}`,
        autoConnect: true,
        secure: true,
      });
      ref.socket.on('connect', () => {
        resolve({
          token,
          userId,
          socket: ref.socket,
          name,
        });
      });
    });

  beforeAll(async function () {
    ref.myConfig = copy(config);
    ref.myConfig.server.port = 3467;
    ref.myConfig.server.hostname = 'localhost';
    ref.myConfig.origins = [`http://${ref.myConfig.server.hostname}`];
    const koa = new Server(ref.myConfig);
    const server = koa.init();
    ref.ioServer = server.io;
    ref.httpServer = await koa.startServer();
    koa.attachSocket();
    ref.request = axios.create({
      baseURL: `http://${ref.myConfig.server.hostname}:${ref.myConfig.server.port}/api/v1`,
      responseType: 'json',
      timeout: 5000,
      validateStatus: (status) => status >= 200 && status < 500,
    });
  });

  afterEach(() => {
    if (ref.socket.io.connected) {
      ref.socket.io.disconnect();
    }
  });

  afterAll(function () {
    ref.httpServer.close();
    ref.ioServer.close();
  });

  it('Create user and check status', async function () {
    // ref.socket.io.emit('echo', 'Hello dude');
    const Jason = await clientConnect('Jason');
    const Jenny = await clientConnect('Jenny');

    const { data: createRoomId = null } = await ref.request.post(
      '/game/create',
      {
        isPublic: true,
        name: Jason.name,
        size: 2,
      },
      {
        headers: { [Token.self]: Jason.token },
      },
    );
    await ref.request.post(
      '/game/enter',
      {
        id: createRoomId,
        name: Jason.name,
      },
      {
        headers: { [Token.self]: Jason.token },
      },
    );
    // Jenny joins
    await ref.request.post(
      '/game/enter',
      {
        id: createRoomId,
        name: Jenny.name,
      },
      {
        headers: { [Token.self]: Jenny.token },
      },
    );

    console.log({
      GameStore: gameStore.getStorage(),
      PlayerStore: playerStore.getStorage(),
      UserStore: userStore.getStorage(),
    });
    expect(playerStore.getStorage()[Jason.userId]).not.toBeNull();
    expect(playerStore.getStorage()[Jenny.userId]).not.toBeNull();
  });
});
