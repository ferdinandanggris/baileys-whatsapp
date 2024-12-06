"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionHandler = void 0;
class ConnectionHandler {
    constructor(socket, sessionService, imcenterService) {
        this.sessionService = sessionService;
        this.imcenterService = imcenterService;
        this.socket = socket;
    }
    handleConnectionEvents() {
        this.socket.ev.on("connection.update", (update) => {
            var _a;
            const { connection, lastDisconnect } = update;
            if (connection === "close") {
                const reason = ((_a = lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.toString()) || "Unknown reason";
                console.log(`Koneksi tertutup: ${reason}`);
                this.sessionService.removeSession("6282131955087");
                // Lakukan rekoneksi jika diperlukan
            }
            else if (connection === "open") {
                console.log("Koneksi berhasil dibuka!");
                this.sessionService.saveSession("6282131955087", this.socket);
            }
            else if (update.qr) {
                console.log("QR Code tersedia. Silakan scan!");
                this.imcenterService.updateQRCode("6282131955087", update.qr);
            }
        });
    }
}
exports.ConnectionHandler = ConnectionHandler;
//# sourceMappingURL=connectionHandler.js.map