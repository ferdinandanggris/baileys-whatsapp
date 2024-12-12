import * as dotenv from "dotenv";
import "reflect-metadata";
import { AppDataSource } from './src/configs/db';
import { errorHandler } from './src/middlewares/error.middleware';
import express from "express";
import ImcenterRouter from './src/routes/imcenterRoutes';
import WhatsappSessionRoute from './src/routes/whatsappSessionRoutes';
import "reflect-metadata";
import { initQueue, startConsumers } from "./src/queues";
import { InstanceManager } from "./src/modules/whatsapp/instanceManagerService";
dotenv.config();

const app = express()
// app.use(errorHandler)
app.use(express.json())
const PORT = process.env.PORT || 3000

 app.use("/imcenter",ImcenterRouter);
 app.use("/wa-service",WhatsappSessionRoute);

AppDataSource.initialize()
    .then(async () => {
		console.log('Database connected!')
        // auto run if session is exist
        const instanceManager : InstanceManager = require('./src/modules/whatsapp/instanceManagerService');
        instanceManager.autoActiveSession();

        await initQueue(); // Inisialisasi RabbitMQ
        await startConsumers();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
	})
    .catch((error) => console.error('Error connecting to database:', error));
