import * as dotenv from "dotenv";
import "reflect-metadata";
import { AppDataSource } from './src/configs/Db';
import { errorHandler } from './src/middlewares/error.middleware';
import express from "express";
import ImcenterRouter from './src/routes/imcenterRoutes';
import WhatsappSessionRoute from './src/routes/whatsappSessionRoutes';
import "reflect-metadata";
import { WhatsappSessionService } from "./src/services/whatsappSessionService";
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

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

        const whatsappSessionService = new WhatsappSessionService();
        await whatsappSessionService.checkAutoActiveSessions();
	})
    .catch((error) => console.error('Error connecting to database:', error));
