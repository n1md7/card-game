import {router} from "./httpServer";
import gameSetup from "./controller/gameSetup";

// To check server status
router.get('/status-check', ctx => gameSetup.status(ctx));
router.get('/authenticate/:name?', ctx => gameSetup.authenticate(ctx));
router.get('/create-room/:size/:isPublic', ctx => gameSetup.create(ctx));
router.get('/rooms', ctx => gameSetup.showRooms(ctx));

router.get('/lol/:id?', ctx => {
    console.dir(ctx.response.body);
    console.dir(ctx.params);

    ctx.body = {
        yo: 'got it'
    };
});