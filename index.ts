import * as dotenv from "dotenv";
import "reflect-metadata";
import { AppDataSource } from './src/configs/db';
import "reflect-metadata";
import { initQueue, startConsumers } from "./src/queues";
import { InstanceManager } from "./src/modules/whatsapp/instanceManagerService";
const { createServer } = require('node:http');
dotenv.config();

const server = createServer((req, res) => {

})


const HOSTNAME = '127.0.0.1';
const PORT = process.env.PORT || 3000

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

AppDataSource.initialize()
    .then(async () => {
        try {
            console.log('Database connected!')
            // auto run if session is exist
            const instanceManager: InstanceManager = require('./src/modules/whatsapp/instanceManagerService');
            instanceManager.autoActiveSession();

            await initQueue(); // Inisialisasi RabbitMQ
            await startConsumers();
            
            server.listen(PORT, HOSTNAME, () => {
                console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
              });

        } catch (error) {
            console.error('Error starting server:', error);
        }
    })
    .catch((error) => console.error('Error connecting to database:', error));


// aplikasi ditutup
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    process.exit(0);
});

// Menangani uncaughtException
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    logError(err);  // Mencatat error ke log
    process.exit(1);  // Keluar dari aplikasi setelah menangani error
});

// Menangani unhandledRejection
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    logError(reason);  // Mencatat error ke log
});
