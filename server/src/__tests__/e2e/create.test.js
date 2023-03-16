require('dotenv').config({ path: '.env.test' });
import config from '../../config';
import Server from '../../server';
import axios from 'axios';
import { copy } from '../../helpers';
import { Token } from 'shared-types';
import { HttpCode } from '../../types';

describe('Create user/verify', () => {
  const ref = { httpServer: null, myConfig: null, request: null };

  beforeAll(async function () {
    ref.myConfig = copy(config);
    ref.myConfig.server.port = 3457;
    ref.myConfig.server.hostname = 'localhost';
    ref.myConfig.origins = [`http://${ref.myConfig.server.hostname}`];
    const koa = new Server(ref.myConfig);
    const server = koa.init();
    ref.httpServer = await koa.startServer();
    koa.attachSocket();
    ref.request = axios.create({
      baseURL: `http://${ref.myConfig.server.hostname}:${ref.myConfig.server.port}/api/v1`,
      responseType: 'json',
      timeout: 5000,
      validateStatus: (status) => status >= 200 && status < 500,
    });
  });

  afterAll(function () {
    ref.httpServer.close();
  });

  it('GET /api/v1/auth/init', async function () {
    const { data = null } = await ref.request.get('/auth/init');
    expect(data).toEqual({
      [Token.auth]: expect.any(String),
      userId: expect.any(String),
    });
  });

  it('Create user', async function () {
    const { data = null } = await ref.request.get('/auth/init');
    expect(data).toEqual({
      [Token.auth]: expect.any(String),
      userId: expect.any(String),
    });
  });

  it('Create user and check status', async function () {
    const { data } = await ref.request.get('/auth/init');
    const { data: user = null } = await ref.request.get('/user', { headers: { [Token.auth]: data[Token.auth] } });
    const { status = null, data: response = null } = await ref.request.get('/auth/status', {
      headers: { [Token.auth]: data[Token.auth] },
    });
    expect(user).toEqual({
      id: data.userId,
      name: null,
      signUpTime: expect.any(String),
      updateTime: expect.any(String),
    });
    expect(status).toBe(HttpCode.ok);
    expect(response).toBe('OK');
  });

  it('Create user/create table', async function () {
    const { data } = await ref.request.get('/auth/init');
    const { status = null, data: roomId = null } = await ref.request.post(
      '/game/create',
      {
        isPublic: true,
        name: 'RedBull',
        size: 2,
        points: 5,
        maxRounds: 4,
      },
      {
        headers: { [Token.auth]: data[Token.auth] },
      },
    );
    expect(status).toBe(HttpCode.ok);
    expect(roomId).toEqual(expect.any(String));
  });

  it('Create user/create table/enter room/list tables', async function () {
    const payload = {
      isPublic: true,
      name: 'Nacho',
      size: 3,
      maxRounds: 1,
      points: 1,
    };
    const { status: initStatus, data } = await ref.request.get('/auth/init');
    const { status: createStatus, data: createRoomId = null } = await ref.request.post('/game/create', payload, {
      headers: { [Token.auth]: data[Token.auth] },
    });
    const { status: enterStatus, data: gameInfo = null } = await ref.request.post(
      '/game/enter',
      {
        id: createRoomId,
        name: payload.name,
      },
      {
        headers: { [Token.auth]: data[Token.auth] },
      },
    );
    const { status: gameListStatus, data: games = null } = await ref.request.get('/games');
    expect(initStatus).toBe(HttpCode.ok);
    expect(createStatus).toBe(HttpCode.ok);
    expect(enterStatus).toBe(HttpCode.ok);
    expect(gameListStatus).toBe(HttpCode.ok);
    expect(gameInfo).toEqual({
      id: createRoomId,
      inRoomSize: 1, // Number of players in the game => only one joined the creator itself
      size: payload.size,
      creator: {
        name: payload.name,
      },
      isStarted: false,
      isPublic: payload.isPublic,
      createdAt: expect.any(String),
    });
    expect(games).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: createRoomId,
          inRoomSize: 1,
          size: payload.size,
          creator: {
            name: payload.name,
          },
          isPublic: payload.isPublic,
        }),
      ]),
    );
  });
});

describe.each([
  [0, 'fail'],
  [1, 'fail'],
  [5, 'fail'],
  [6, 'fail'],
  [17, 'fail'],
])('Create room with size %i. It should %s with error message', (sz, ms) => {
  const ref = { httpServer: null, myConfig: null, request: null };

  beforeAll(async function () {
    ref.myConfig = copy(config);
    ref.myConfig.server.port = 3457;
    ref.myConfig.server.hostname = 'localhost';
    ref.myConfig.origins = [`http://${ref.myConfig.server.hostname}`];
    const koa = new Server(ref.myConfig);
    const server = koa.init();
    ref.httpServer = await koa.startServer();
    koa.attachSocket();
    ref.request = axios.create({
      baseURL: `http://${ref.myConfig.server.hostname}:${ref.myConfig.server.port}/api/v1`,
      responseType: 'json',
      timeout: 5000,
      validateStatus: (status) => status >= 200 && status < 500,
    });
  });

  afterAll(function () {
    ref.httpServer.close();
  });

  it(`it ${ms}s for [${sz}]`, async () => {
    const { data } = await ref.request.get('/auth/init');
    const { status: createStatus, data: errorResponse = null } = await ref.request.post(
      '/game/create',
      {
        isPublic: true,
        name: 'Nacho',
        size: sz,
      },
      {
        headers: { [Token.auth]: data[Token.auth] },
      },
    );
    expect(createStatus).toBe(HttpCode.badRequest);
    expect(errorResponse).toEqual(expect.any(String));
  });
});
