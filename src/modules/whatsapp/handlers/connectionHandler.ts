import { WASocket } from "baileys";
import SessionService from "../services/sessionService";
import { ImCenterService } from "../../../services/imcenterService"

export class ConnectionHandler {
    private socket: WASocket;

    constructor(socket: WASocket, private sessionService : SessionService, private imcenterService: ImCenterService) {
        this.socket = socket;
    }

    handleConnectionEvents() {
        this.socket.ev.on("connection.update", (update) => {
            const { connection, lastDisconnect } = update;

            if (connection === "close") {
                const reason = lastDisconnect?.error?.toString() || "Unknown reason";
                console.log(`Koneksi tertutup: ${reason}`);
                this.sessionService.removeSession("6282131955087");
                // Lakukan rekoneksi jika diperlukan
            } else if (connection === "open") {
                console.log("Koneksi berhasil dibuka!");
                this.sessionService.saveSession("6282131955087", this.socket);
            } else if (update.qr) {
                console.log("QR Code tersedia. Silakan scan!");
                this.imcenterService.updateQRCode("6282131955087", update.qr);
            }
        });
    }

    async Logout() {
        if (this.socket) {
            await this.socket.logout();
            this.socket = null;
            this.sessionService.removeSession("6282131955087");
        }
    }

    async updateModeStandby(standby: boolean) {
        this.imcenterService.updateModeStandby(standby, "6282131955087");
    }
}