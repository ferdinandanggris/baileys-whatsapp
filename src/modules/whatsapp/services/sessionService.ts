import makeWASocket from "baileys";
import { AppDataSource } from "../../../configs/db";
import { WhatsappSession } from "../../../entities/whatsappSession";

export default class SessionService {

    private repository = AppDataSource.getRepository(WhatsappSession);

    async saveSession(nomorhp : string, socket: ReturnType<typeof makeWASocket>) {
        const whatsappSession = await this.repository.findOneBy({ nomorhp });
        if(!whatsappSession) {
            this.repository.save({ nomorhp : nomorhp, sessionCred : socket.authState.creds, sessionKey: socket.authState.keys });
        }
    }

    async removeSession(nomorhp: string) {
        // Remove session
        this.repository.delete({ nomorhp });
    }
}