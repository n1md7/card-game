const { httpServer } = require( "../../index" );
const superTest = require( "supertest" );

describe( "Test Api endpoints for create-room", () => {

  it.skip( "should auth and create a room and set cookies", async done => {
    // Sends GET Request to /create-room/:size/:isPublic endpoint
    const session = superTest.agent( httpServer );
    const myName = "harry";
    const size = 3;
    const isPublic = + false;
    // this will keep set cookies for the next request
    await session.get( `/api` );
    const { status, body } = await session.post( `/api/create-room` )
      .send( {
        size, isPublic, name: myName
      } );
    expect( status ).toBe( 200 );
    expect( body ).toEqual(
      expect.objectContaining( {
        ok: true,
        roomId: expect.any( String )
      } )
    );
    done();
  } );

} );


describe( "Test Api endpoints for create-room", () => {
  it.skip( "should auth, create room and try to join another one and fail", async done => {
    const session1 = superTest.agent( httpServer );
    const myName = "ninja";
    const size = 2;
    const isPublic = + false;
    // this will keep set cookies for the next request
    // this is just a dummy request to make sure the server sets cookies
    await session1.get( `/api` );
    // create and join the room
    await session1.post( `/api/create-room` )
      .send( {
        size, isPublic, name: myName
      } );
    // try to create new room
    // should fail cause already in one room
    const r1 = await session1.post( `/api/create-room` )
      .send( {
        size, isPublic, name: myName
      } );
    expect( r1.status ).toBe( 200 );
    expect( r1.body ).toEqual(
      expect.objectContaining( {
        ok: false,
        msg: expect.any( String )
      } )
    );

    // leave current room and try to create new one
    await session1.get( `/api/leave-room` );
    const r2 = await session1.post( `/api/create-room` )
      .send( {
        size, isPublic, name: myName
      } );
    expect( r2.status ).toBe( 200 );
    expect( r2.body ).toEqual(
      expect.objectContaining( {
        ok: true,
        roomId: expect.any( String )
      } )
    );

    // lets try to join the room while been in one room
    // it will return already joined room id
    const r3 = await session1.post( `/api/join-room` )
      .send( {
        id: r2.body.roomId,
        name: myName
      } );
    expect( r3.status ).toBe( 200 );
    expect( r3.body ).toEqual(
      expect.objectContaining( {
        ok: true,
        room: expect.any( Object )
      } )
    );

    // now leave the room and try again
    await session1.get( `/api/leave-room` );
    // join room
    const r4 = await session1.post( `/api/join-room/` )
      .send( {
        id: r2.body.roomId,
        name: myName
      } );
    expect( r4.status ).toBe( 200 );
    expect( r4.body ).toEqual(
      expect.objectContaining( {
        ok: true,
        room: expect.any( Object )
      } )
    );
    done();
  } );
} );


describe.each( [
  [ 0, "fail" ],
  [ 1, "fail" ],
  [ 5, "fail" ],
  [ 6, "fail" ],
  [ 17, "fail" ]
] )( "create-room with size %i and it should %s with error message", ( sz, ms ) => {
  it( `it ${ ms }s for ${ sz }`, async () => {
    const session2 = superTest.agent( httpServer );
    await session2.get( `/api/leave-room` );
    // create room with non valid room size
    const r5 = await session2.post( `/api/create-room` )
      .send( {
        size: sz, isPublic: 1, name: "Yoyo"
      } );
    expect( r5.status ).toBe( 200 );
    expect( r5.body ).toEqual(
      expect.objectContaining( {
        ok: false,
        msg: expect.any( String )
      } )
    );
  } );
} );
