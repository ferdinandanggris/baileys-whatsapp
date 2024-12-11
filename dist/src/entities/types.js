"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TIPE_LOG = exports.STATUS_LOGIN = exports.TIPE_APLIKASI = exports.IMCENTER_TYPE = void 0;
var IMCENTER_TYPE;
(function (IMCENTER_TYPE) {
    IMCENTER_TYPE["WHATSAPP"] = "Whatsapp";
    IMCENTER_TYPE["TELEGRAM_BOT"] = "Telegram Bot";
})(IMCENTER_TYPE || (exports.IMCENTER_TYPE = IMCENTER_TYPE = {}));
var TIPE_APLIKASI;
(function (TIPE_APLIKASI) {
    TIPE_APLIKASI["GOLANG"] = "Golang";
    TIPE_APLIKASI["NODEJS"] = "Node.js";
    TIPE_APLIKASI["DEKSTOP"] = "Dekstop";
})(TIPE_APLIKASI || (exports.TIPE_APLIKASI = TIPE_APLIKASI = {}));
var STATUS_LOGIN;
(function (STATUS_LOGIN) {
    STATUS_LOGIN["BELUM_LOGIN"] = "Belum Login";
    STATUS_LOGIN["PROSES_LOGIN"] = "Proses Login";
    STATUS_LOGIN["SUDAH_LOGIN"] = "Sudah Login";
    STATUS_LOGIN["MENGIRIM_PESAN"] = "Mengirim Pesan";
    STATUS_LOGIN["DISABLE_QR"] = "Disable QR";
})(STATUS_LOGIN || (exports.STATUS_LOGIN = STATUS_LOGIN = {}));
var TIPE_LOG;
(function (TIPE_LOG) {
    TIPE_LOG["LOG"] = "log";
    TIPE_LOG["INFO"] = "info";
    TIPE_LOG["ERROR"] = "error";
    TIPE_LOG["INBOX"] = "inbox";
    TIPE_LOG["OUTBOX"] = "outbox";
})(TIPE_LOG || (exports.TIPE_LOG = TIPE_LOG = {}));
//# sourceMappingURL=types.js.map