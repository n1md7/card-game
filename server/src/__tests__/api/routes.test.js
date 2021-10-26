const { httpServer } = require('../../index');
const superTest = require('supertest');

const request = superTest(httpServer);

describe('Test default responses fromm the endpoints', () => {
  let token, roomId;
  it('should test /status-check', async (done) => {
    // Sends GET Request to /status-check endpoint
    const response = await request.get('/api/status-check');
    const statusUp = {
      ok: false,
    };
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(statusUp);
    done();
  });

  it('should return not found', async (done) => {
    // Sends GET Request to /authenticate/:name endpoint
    const response = await request.get('/api');
    expect(response.status).toBe(404);
    done();
  });

  it('should return token and userId - validating claims', async (done) => {
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

  it('should fail /create-room', async (done) => {
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

  it('should /create-room', async (done) => {
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

  it('should test /show-rooms', async (done) => {
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

  it('should fail /join-room', async (done) => {
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

  it('should /join-room', async (done) => {
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

  it('should fail /leave-room', async (done) => {
    const { status, body } = await request.get('/api/leave-room').set('token', token);
    expect(status).toBe(200);
    expect(body).toEqual(
      expect.objectContaining({
        ok: true,
      }),
    );
    done();
  });

  it('should /leave-room', async (done) => {
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

  it('should create a room', async (done) => {
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
