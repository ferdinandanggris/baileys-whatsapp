import  {makeWASocket, DisconnectReason, useMultiFileAuthState, makeCacheableSignalKeyStore } from 'baileys'
import { Boom } from '@hapi/boom'
import P from 'pino'
import * as dotenv from "dotenv";
import "reflect-metadata";
import { AppDataSource } from './src/configs/Db';
import { errorHandler } from './src/middlewares/error.middleware';
import express from "express";
import router from './src/routes/ImcenterRoutes';
import ImcenterRouter from './src/routes/ImcenterRoutes';
import WhatsappSessionRoute from './src/routes/WhatsappSessionRoutes';
dotenv.config();


const logger = P({ timestamp: () => `,"time":"${new Date().toJSON()}"` }, P.destination('./wa-logs.txt'))
async function connectToWhatsApp () {
	const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
    const sock = makeWASocket({
        // can provide additional config here
        printQRInTerminal: true,
		auth :{
			creds : state.creds,
			keys : makeCacheableSignalKeyStore(state.keys,logger)
		}
    })
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
            // reconnect if not logged out
            if(shouldReconnect) {
                connectToWhatsApp()
            }
        } else if(connection === 'open') {
            console.log('opened connection')
        }
    })
    sock.ev.on('messages.upsert', async m => {  
        console.log(JSON.stringify(m, undefined, 2))

		console.log(m);
        console.log('replying to', m.messages[0].key.remoteJid)
        await sock.sendMessage(m.messages[0].key.remoteJid!, { text: 'Hello there!' })
    })

	sock.ev.on('creds.update', saveCreds)
}

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
		// run in main file
		// await connectToWhatsApp()
	})
    .catch((error) => console.error('Error connecting to database:', error));
