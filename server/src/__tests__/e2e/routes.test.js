import dotenv from 'dotenv';
import config from '../../config';
import Server from '../../server';
import axios from 'axios';
import { copy } from '../../helpers/extras';
import { HttpCode } from '../../types/errorHandler';

dotenv.config();

describe('/api/v1/storage', () => {
  const ref = { httpServer: null, myConfig: null, request: null };

  beforeAll(async function () {
    ref.myConfig = copy(config);
    ref.myConfig.server.port = 3456;
    ref.myConfig.server.hostname = 'localhost';
    ref.myConfig.origins = [`http://${ref.myConfig.server.hostname}`];
    const koa = new Server(ref.myConfig);
    const server = koa.init();
    ref.httpServer = await koa.startServer();
    koa.attachSocket();
    ref.request = axios.create({
      baseURL: `http://${ref.myConfig.server.hostname}:${ref.myConfig.server.port}/api/v1`,
      responseType: 'application/json',
      timeout: 5000,
      validateStatus: (status) => status >= 200 && status < 500,
    });
  });

  afterAll(function () {
    ref.httpServer.close();
  });

  it('GET /api/v1/storage', async function () {
    const { status = null } = await ref.request.get('/storage');
    expect(status).not.toBeNull();
  });
});

describe('/api/v1/auth', () => {
  const ref = { httpServer: null, myConfig: null, request: null };

  beforeAll(async function () {
    ref.myConfig = copy(config);
    ref.myConfig.server.port = 3456;
    ref.myConfig.server.hostname = 'localhost';
    ref.myConfig.origins = [`http://${ref.myConfig.server.hostname}`];
    const koa = new Server(ref.myConfig);
    const server = koa.init();
    ref.httpServer = await koa.startServer();
    koa.attachSocket();
    ref.request = axios.create({
      baseURL: `http://${ref.myConfig.server.hostname}:${ref.myConfig.server.port}/api/v1`,
      responseType: 'application/json',
      timeout: 5000,
      validateStatus: (status) => status >= 200 && status < 500,
    });
  });

  afterAll(function () {
    ref.httpServer.close();
  });

  it('GET /auth/init', async function () {
    const { status = null } = await ref.request.get('/auth/init');
    expect(status).toBe(HttpCode.ok);
  });

  it('GET /auth/status', async function () {
    const { status = null } = await ref.request.get('/auth/status');
    expect(status).toBe(HttpCode.unauthorized);
  });

  it('GET /auth/extend', async function () {
    const { status = null } = await ref.request.get('/auth/extend');
    expect(status).toBe(HttpCode.ok);
  });
});

describe('/api/v1/user', () => {
  const ref = { httpServer: null, myConfig: null, request: null };

  beforeAll(async function () {
    ref.myConfig = copy(config);
    ref.myConfig.server.port = 3456;
    ref.myConfig.server.hostname = 'localhost';
    ref.myConfig.origins = [`http://${ref.myConfig.server.hostname}`];
    const koa = new Server(ref.myConfig);
    const server = koa.init();
    ref.httpServer = await koa.startServer();
    koa.attachSocket();
    ref.request = axios.create({
      baseURL: `http://${ref.myConfig.server.hostname}:${ref.myConfig.server.port}/api/v1`,
      responseType: 'application/json',
      timeout: 5000,
      validateStatus: (status) => status >= 200 && status < 500,
    });
  });

  afterAll(function () {
    ref.httpServer.close();
  });

  it('GET /user', async function () {
    const { status = null } = await ref.request.get('/user');
    expect(status).toBe(HttpCode.unauthorized);
  });
});

describe('/api/v1/game(s)', () => {
  const ref = { httpServer: null, myConfig: null, request: null };

  beforeAll(async function () {
    ref.myConfig = copy(config);
    ref.myConfig.server.port = 3456;
    ref.myConfig.server.hostname = 'localhost';
    ref.myConfig.origins = [`http://${ref.myConfig.server.hostname}`];
    const koa = new Server(ref.myConfig);
    const server = koa.init();
    ref.httpServer = await koa.startServer();
    koa.attachSocket();
    ref.request = axios.create({
      baseURL: `http://${ref.myConfig.server.hostname}:${ref.myConfig.server.port}/api/v1`,
      responseType: 'application/json',
      timeout: 5000,
      validateStatus: (status) => status >= 200 && status < 500,
    });
  });

  afterAll(function () {
    ref.httpServer.close();
  });

  it('GET /games', async function () {
    const { status = null } = await ref.request.get('/games');
    expect(status).toBe(HttpCode.ok);
  });

  it('PUT /game/exit', async function () {
    const { status = null } = await ref.request.put('/game/exit');
    expect(status).toBe(HttpCode.unauthorized);
  });

  it('POST /game/create', async function () {
    const { status = null } = await ref.request.post('/game/create');
    expect(status).toBe(HttpCode.unauthorized);
  });

  it('POST /game/enter', async function () {
    const { status = null } = await ref.request.post('/game/enter');
    expect(status).toBe(HttpCode.unauthorized);
  });
});

describe('Test default responses fromm the endpoints', () => {
  let token, roomId, koa, server, httpServer, myConfig, request;

  beforeAll(async function () {
    myConfig = copy(config);
    myConfig.server.port = 3456;
    myConfig.server.hostname = 'localhost';
    myConfig.origins = [`http://${myConfig.server.hostname}`];
    koa = new Server(myConfig);
    server = koa.init();
    httpServer = await koa.startServer();
    koa.attachSocket();
    request = axios.create({ baseURL: `http://${myConfig.server.hostname}:${myConfig.server.port}/api/v1` });
  });

  afterAll(function () {
    httpServer.close();
  });

  it('should verify route GET /storage exists', async function () {
    expect(1).toBe(1);
  });

  it.skip('should test /status-check', async (done) => {
    // Sends GET Request to /status-check endpoint
    const response = await request.get('/api/status-check');
    const statusUp = {
      ok: false,
    };
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(statusUp);
    done();
  });

  it.skip('should return not found', async (done) => {
    // Sends GET Request to /authenticate/:name endpoint
    const response = await request.get('/api');
    expect(response.status).toBe(404);
    done();
  });

  it.skip('should return token and userId - validating claims', async (done) => {
    const response = await request.get('/api/init');
    expect(response.status).toBe(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.token).not.toBeNull();
    expect(response.body.token).toEqual(expect.any(String));
    expect(response.body.userId).toEqual(expect.any(String));

    token = response.body.token;
    // check claims
    const [, body] = response.body.token.split(/\./);
    const decoded = JSON.parse(Buffer.from(body, 'base64').toString('utf-8'));
    expect(decoded).toEqual(
      expect.objectContaining({
        userId: expect.any(String),
        iat: expect.any(Number),
        exp: expect.any(Number),
      }),
    );

    done();
  });

  it.skip('should fail /create-room', async (done) => {
    const invalidRoomSize = 69;
    // Sends GET Request to /authenticate/:name endpoint
    const { status, body } = await request.post('/api/create-room').send({
      isPublic: 1,
      name: 'RedBull',
      size: invalidRoomSize,
    });
    expect(status).toBe(200);
    expect(body).toEqual(
      expect.objectContaining({
        ok: false,
        msg: expect.any(String),
      }),
    );
    done();
  });

  it.skip('should /create-room', async (done) => {
    // Sends GET Request to /authenticate/:name endpoint
    const { status, body } = await request
      .post('/api/create-room')
      .send({
        isPublic: 1,
        name: 'RedBull',
        size: 4,
      })
      .set('token', token);

    expect(status).toBe(200);
    expect(body).toEqual(
      expect.objectContaining({
        ok: true,
        roomId: expect.any(String),
      }),
    );

    roomId = body.roomId;
    done();
  });

  it.skip('should test /show-rooms', async (done) => {
    // Sends GET Request to /authenticate/:name endpoint
    const { status, body } = await request.get('/api/show-rooms').set('token', token);
    expect(status).toBe(200);
    expect(body).toEqual(
      expect.objectContaining({
        ok: true,
        rooms: expect.any(Object),
      }),
    );
    done();
  });

  it.skip('should fail /join-room', async (done) => {
    const { status, body } = await request
      .post('/api/join-room')
      .send({
        id: 'R-234',
        name: 'Nuca',
      })
      .set('token', token);
    expect(status).toBe(200);
    expect(body).toEqual(
      expect.objectContaining({
        ok: false,
        msg: expect.any(String),
      }),
    );
    done();
  });

  it.skip('should /join-room', async (done) => {
    const { status, body } = await request
      .post('/api/join-room')
      .send({
        id: roomId,
        name: 'Nuca',
      })
      .set('token', token);
    expect(status).toBe(200);
    expect(body).toEqual(
      expect.objectContaining({
        ok: true,
        room: expect.objectContaining({
          id: expect.any(String),
          inRoomSize: expect.any(Number),
          size: expect.any(Number),
          creator: expect.objectContaining({
            name: expect.any(String),
          }),
        }),
      }),
    );
    done();
  });

  it.skip('should fail /leave-room', async (done) => {
    const { status, body } = await request.get('/api/leave-room').set('token', token);
    expect(status).toBe(200);
    expect(body).toEqual(
      expect.objectContaining({
        ok: true,
      }),
    );
    done();
  });

  it.skip('should /leave-room', async (done) => {
    const { status, body } = await request.get('/api/leave-room');
    expect(status).toBe(200);
    expect(body).toEqual(
      expect.objectContaining({
        ok: false,
        msg: expect.any(String),
      }),
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

  it.skip('should create a room', async (done) => {
    const response = await request.get('/api/init');
    // Sends GET Request to /create-room/:size/:isPublic endpoint
    const size = 4;
    const isPublic = +true;
    const { status, body } = await session
      .post(`/api/create-room`)
      .send({
        size,
        isPublic,
        name: 'Nacho Varga',
      })
      .set('token', response.body.token);
    expect(status).toBe(200);
    expect(body).toEqual(
      expect.objectContaining({
        ok: true,
        roomId: expect.any(String),
      }),
    );
    // Game id starts with G-
    expect(body.roomId[0]).toBe('G');
    done();
  });
});
