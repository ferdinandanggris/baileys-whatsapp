
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
    TERKIRIM = 'Terkirim',
    DITERIMA = 'Diterima',
    DIBACA = 'Dibaca',
    BELUM_DIBACA = 'Belum Dibaca',
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

export enum TIPE_PENGIRIM{
    NOMOR_HP = 'nomorhp',
    WHATSAPP = 'whatsapp',
    TELEGRAM = 'telegram',
    APLIKASI = 'aplikasi',
    IP = 'ip',
}

export enum PARAMETER_GROUP{
    UNKNOWN = 'unknown',
    FORMAT_REQUEST = 'FormatRequest',
    FORMAT_BALASAN = 'FormatBalasan',
    AUTO_RESPONSE = 'AutoResponse',
    SETTING = 'Setting',
    TELEGRAM_CENTER = 'TelegramCenter',
}

export enum STATUS_INBOX{
   BELUM_DIPROSES = '0',
    BUKAN_RESELLER = '41',
    DIABAIKAN = '64',
    DIBATALKAN = '50',
    FORMAT_SALAH = '42',
    GAGAL = '40',
    GROUP_DISALLOWED = '67',
    HARGA_TIDAK_SESUAI = '59',
    INVALID_TERMINAL = '66',
    KODE_AREA_TIDAK_COCOK = '54',
    LIMIT_HARIAN = '62',
    NOMOR_BLACKLIST = '56',
    NOMOR_TIDAK_AKTIF = '58',
    PARAMETER_SALAH = '48',
    PIN_SALAH = '49',
    PRODUK_GANGGUAN = '47',
    PRODUK_SALAH = '44',
    QTY_TIDAK_SESUAI = '61',
    RESELLER_SUSPEND = '63',
    RESELLER_TIDAK_AKTIF = '51',
    SALDO_TIDAK_CUKUP = '43',
    SEDANG_DIPROSES = '1',
    STOK_KOSONG = '45',
    SUKSES = '20',
    SUKSES_DAN_MASUK_CS = '23',
    SUKSES_DAN_MASUK_OUTBOX = '21',
    SUKSES_DAN_MASUK_TRANSAKSI = '22',
    TIDAK_ADA_DATA = '60',
    TIMEOUT = '55',
    TRANSAKSI_DOBEL = '46',
    TUJUAN_DILUAR_WILAYAH = '53',
    TUJUAN_SALAH = '52',
    UNIT_TIDAK_CUKUP = '65',
    WRONG_SIGNATURE = '57',
}



