
export enum IMCENTER_TYPE  {
    WHATSAPP = 'WhatsApp',
    TELEGRAM_BOT = 'Telegram Bot'
}

export enum TIPE_APLIKASI {
    GOLANG = 'Golang',
    NODEJS = 'Node.js',
    DEKSTOP = 'Dekstop'
}

export enum STATUS_LOGIN {
    BELUM_LOGIN = 'Belum Login',
    PROSES_LOGIN = 'Proses Login',
    SUDAH_LOGIN = 'Sudah Login',
    MENGIRIM_PESAN = 'Mengirim Pesan',
    DISABLE_QR = 'Disable QR'
}

export enum TIPE_LOG {
    LOG = 'log',
    INFO = 'info',
    ERROR = 'error',
    INBOX = 'inbox',
    OUTBOX = 'outbox'
}

export enum GROUP_MERCHANT{
    RETAIL = 'Retail',
    SERVER = 'Server',
}

export enum TIPE_AKTIVITAS{
    AKTIF = 'Aktif',
    BARU_1_HARI = 'Baru 1 Hari',
    BARU_1_MINGGU = 'Baru 1 Minggu',
    BARU_1_BULAN = 'Baru 1 Bulan',
    BARU_3_BULAN = 'Baru 3 Bulan',
    PASIF_1_BULAN = 'Pasif 1 Bulan',
    PASIF_3_BULAN = 'Pasif 3 Bulan',
    PASIF_6_BULAN = 'Pasif 6 Bulan',
    PASIF_1_TAHUN = 'Pasif 1 Tahun',
    PASIF_3_TAHUN = 'Pasif 3 Tahun',
}

export enum STATUS_LOG{
    DIBACA = 'Dibaca',
}

export enum OUTBOX_STATUS{
    BELUM_DIPROSES = 0,
    STATUS_DIBATALKAN = 50,
    STATUS_GAGAL = 40,
    STATUS_SEDANG_DIPROSES = 1,
    STATUS_SUKSES = 20,
    STATUS_GAGAL_KIRIM = 3,
    DEFAULT = -1
}
