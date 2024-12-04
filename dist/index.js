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
const baileys_1 = require("baileys");
const pino_1 = __importDefault(require("pino"));
require("reflect-metadata");
const Db_1 = require("./src/configs/Db");
const logger = (0, pino_1.default)({ timestamp: () => `,"time":"${new Date().toJSON()}"` }, pino_1.default.destination('./wa-logs.txt'));
function connectToWhatsApp() {
    return __awaiter(this, void 0, void 0, function* () {
        const { state, saveCreds } = yield (0, baileys_1.useMultiFileAuthState)('auth_info_baileys');
        const sock = (0, baileys_1.makeWASocket)({
            // can provide additional config here
            printQRInTerminal: true,
            auth: {
                creds: state.creds,
                keys: (0, baileys_1.makeCacheableSignalKeyStore)(state.keys, logger)
            }
        });
        sock.ev.on('connection.update', (update) => {
            var _a, _b;
            const { connection, lastDisconnect } = update;
            if (connection === 'close') {
                const shouldReconnect = ((_b = (_a = lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) !== baileys_1.DisconnectReason.loggedOut;
                console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect);
                // reconnect if not logged out
                if (shouldReconnect) {
                    connectToWhatsApp();
                }
            }
            else if (connection === 'open') {
                console.log('opened connection');
            }
        });
        sock.ev.on('messages.upsert', (m) => __awaiter(this, void 0, void 0, function* () {
            console.log(JSON.stringify(m, undefined, 2));
            console.log(m);
            console.log('replying to', m.messages[0].key.remoteJid);
            yield sock.sendMessage(m.messages[0].key.remoteJid, { text: 'Hello there!' });
        }));
        sock.ev.on('creds.update', saveCreds);
    });
}
Db_1.AppDataSource.initialize()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Database connected!');
    // run in main file
    yield connectToWhatsApp();
}))
    .catch((error) => console.error('Error connecting to database:', error));
//# sourceMappingURL=index.js.map