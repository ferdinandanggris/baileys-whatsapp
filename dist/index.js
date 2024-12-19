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
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
require("reflect-metadata");
const db_1 = require("./src/configs/db");
require("reflect-metadata");
const queues_1 = require("./src/queues");
const { createServer } = require('node:http');
dotenv.config();
const server = createServer((req, res) => {
});
const HOSTNAME = '127.0.0.1';
const PORT = process.env.PORT || 3000;
const fs = require('fs');
const path = require('path');
// Fungsi untuk mencatat error
const logError = (err) => {
    const logMessage = {
        timestamp: new Date().toISOString(),
        message: err.message,
        stack: err.stack,
    };
    // Membuat path file log
    if (!fs.existsSync(`${__dirname}/logs`)) {
        fs.mkdirSync(`${__dirname}/logs`);
    }
    const logFilePath = path.join(`${__dirname}/logs`, `${new Date().toISOString().split('T')[0]}.json`);
    // ambil data log yang sudah ada dan tambahkan log baru
    let logs = [];
    if (fs.existsSync(logFilePath)) {
        logs = JSON.parse(fs.readFileSync(logFilePath));
    }
    logs.push(logMessage);
    fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2));
};
db_1.AppDataSource.initialize()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Database connected!');
        // auto run if session is exist
        const instanceManager = require('./src/modules/whatsapp/instanceManagerService');
        instanceManager.autoActiveSession();
        yield (0, queues_1.initQueue)(); // Inisialisasi RabbitMQ
        yield (0, queues_1.startConsumers)();
        server.listen(PORT, HOSTNAME, () => {
            console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
        });
    }
    catch (error) {
        console.error('Error starting server:', error);
    }
}))
    .catch((error) => console.error('Error connecting to database:', error));
// aplikasi ditutup
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Shutting down gracefully...');
    process.exit(0);
}));
// Menangani uncaughtException
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    logError(err); // Mencatat error ke log
    process.exit(1); // Keluar dari aplikasi setelah menangani error
});
// Menangani unhandledRejection
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    logError(reason); // Mencatat error ke log
});
//# sourceMappingURL=index.js.map