const {httpServer} = require('../../index');
const superTest = require('supertest');

const request = superTest(httpServer)

describe('Test Api endpoints with all routes', () => {
    it('should return health-check message', async done => {
        // Sends GET Request to /status-check endpoint
        const response = await request.get('/status-check');
        const statusUp = {
            status: 'up'
        };
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(statusUp);
        // ...
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

    it('should return auth user', async done => {
        // Sends GET Request to /authenticate/:name endpoint
        const myName = 'james';
        const {status, body} = await request.get(`/authenticate/${myName}`);
        expect(status).toBe(200);
        console.log(body)
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

    // it('asdasd return error message', async done => {
    //     // Sends GET Request to /ad endpoint
    //     const response = await request.get('/authenticate');
    //     console.log(response.headers)
    //     expect(1).toBe(1)
    //     done();
    // });
})
