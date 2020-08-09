"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const koa_1 = __importDefault(require("koa"));
const koa_router_1 = __importDefault(require("koa-router"));
const socket_io_1 = __importDefault(require("socket.io"));
const dotenv_1 = __importDefault(require("dotenv"));
const koa_static_1 = __importDefault(require("koa-static"));
const path_1 = __importDefault(require("path"));
// initialize configuration
dotenv_1.default.config();
// port is now available to the Node.js runtime
// as if it were an environment variable
const httpPort = process.env.SERVER_PORT_HTTP;
const app = new koa_1.default();
const router = new koa_router_1.default();
const httpServer = http_1.default.createServer(app.callback());
// Pass a http.Server instance to the listen method
const io = socket_io_1.default.listen(httpServer);
app.use(router.routes())
    .use(router.allowedMethods())
    .use((ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    // custom middleware
    ctx.cookies.set('test-cookie', 'test-value');
    yield next();
}));
// make public all content inside ../public folder
// mainly for testing(socket.io),
// public files will be served from apache/nginx
app.use(koa_static_1.default(path_1.default.join(__dirname, '../public')));
// To check server status
router.get('/status-check', ctx => ctx.body = {
    status: "up"
});
io.on('connection', function (socket) {
    console.log("Connected successfully to the socket ...");
    socket.on('create', function (message) {
        console.log(message);
    });
    socket.on('join', function (message) {
        console.log(message);
    });
});
// start the server
httpServer.listen(httpPort, () => {
    console.log(`server started at http://localhost:${httpPort}`);
});
//# sourceMappingURL=index.js.map