import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { GROUP_MERCHANT, TIPE_AKTIVITAS } from './types';

@Entity('merchant', { schema: 'processor' })
export class Merchant {
@PrimaryGeneratedColumn()
id: number;

@Column()
kode: string;

@Column()
id_master: number;

@Column()
nama: string;

@Column()
nama_pemilik: string;

@Column()
pin: string;

@Column({ name: 'password' })
password: string;

@Column()
poin: number;

@Column()
saldo: number;

@Column()
aktif: boolean;

@Column({ type: 'enum', enum: Object.values(GROUP_MERCHANT), default: GROUP_MERCHANT.RETAIL })
group: string;

@Column()
otp: string;

@Column()
otp_expired: string;

@Column()
otp_counter: number;

@Column()
pin_counter: number;

@Column()
provinsi: number;

@Column()
kabupaten: number;

@Column()
kecamatan: number;

@Column()
kelurahan: number;

@Column()
alamat: string;

@Column()
lokasi: string;

@Column()
ip_address: string;

@Column()
url_report: string;

@Column()
nik_ktp: string;

@Column()
foto_ktp: string;

@Column()
foto_kyc: string;

@Column()
validasi_ktp: boolean;

@Column()
email: string;

@Column()
validasi_email: boolean;

@Column()
keterangan: string;

@Column()
follow_up: string;

@Column({ type: 'enum', enum: Object.values(TIPE_AKTIVITAS), default: TIPE_AKTIVITAS.BARU_1_HARI })
tipe_aktivitas: string;

@Column()
tgl_aktivitas: string;

@Column()
tgl_created: string;

@Column()
tgl_update: string;
}