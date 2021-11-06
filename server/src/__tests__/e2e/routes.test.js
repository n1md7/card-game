require('dotenv').config({ path: '.env.test' });

import config from '../../config';
import Server from '../../server';
import axios from 'axios';
import { copy } from '../../helpers/extras';
import { HttpCode } from '../../types';

describe('/api/v1/storage', () => {
  const ref = { httpServer: null, myConfig: null, request: null };

  beforeAll(async function () {
    ref.myConfig = copy(config);
    ref.myConfig.server.port = 3458;
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

  it('GET /api/v1/storage', async function () {
    const { status = null } = await ref.request.get('/storage');
    expect(status).not.toBeNull();
  });
});

describe('/api/v1/auth', () => {
  const ref = { httpServer: null, myConfig: null, request: null };

  beforeAll(async function () {
    ref.myConfig = copy(config);
    ref.myConfig.server.port = 3459;
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
    ref.myConfig.server.port = 3460;
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

  it('GET /user', async function () {
    const { status = null } = await ref.request.get('/user');
    expect(status).toBe(HttpCode.unauthorized);
  });
});

describe('/api/v1/game(s)', () => {
  const ref = { httpServer: null, myConfig: null, request: null };

  beforeAll(async function () {
    ref.myConfig = copy(config);
    ref.myConfig.server.port = 3461;
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
