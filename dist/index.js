"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const dotenv = __importStar(require("dotenv"));
require("reflect-metadata");
const db_1 = require("./src/configs/db");
const express_1 = __importDefault(require("express"));
const imcenterRoutes_1 = __importDefault(require("./src/routes/imcenterRoutes"));
const whatsappSessionRoutes_1 = __importDefault(require("./src/routes/whatsappSessionRoutes"));
require("reflect-metadata");
const queues_1 = require("./src/queues");
dotenv.config();
const app = (0, express_1.default)();
// app.use(errorHandler)
app.use(express_1.default.json());
const PORT = process.env.PORT || 3000;
app.use("/imcenter", imcenterRoutes_1.default);
app.use("/wa-service", whatsappSessionRoutes_1.default);
db_1.AppDataSource.initialize()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Database connected!');
    // auto run if session is exist
    const instanceManager = require('./src/modules/whatsapp/instanceManagerService');
    instanceManager.autoActiveSession();
    yield (0, queues_1.initQueue)(); // Inisialisasi RabbitMQ
    yield (0, queues_1.startConsumers)();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}))
    .catch((error) => console.error('Error connecting to database:', error));
//# sourceMappingURL=index.js.map