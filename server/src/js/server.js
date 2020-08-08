const Koa = require('koa');
const Router = require('koa-router');
const Logger = require('koa-logger');

const app = new Koa();
const router = new Router();

// Response to GET requests
router.get('/', async (ctx) => {
  ctx.body = 'Hello, World!\n';
});

// Logging
app.use(Logger());

// Add routes and response to the OPTIONS requests
app.use(router.routes()).use(router.allowedMethods());

// Listening to the port
app.listen(8080, () => {
  console.log('Server running on port 8080');
});
