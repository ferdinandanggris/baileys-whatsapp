import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { TIPE_AKTIVITAS } from './types';
import { PengirimGriyabayar } from './pengirimGriyabayar';

@Entity('reseller', { schema: 'griyabayar' })
export class ResellerGriyabayar {
@PrimaryGeneratedColumn('increment', { type: 'bigint' })
id: number;

@Column({ type: 'varchar' })
kode: string;

@Column({ type: 'int' })
id_pp: number;

@Column({ type: 'varchar' })
kode_pp: string;

@Column({ type: 'int' })
id_provider: number;

@Column({ type: 'varchar' })
kode_provider: string;

@Column({ type: 'varchar' })
nama: string;

@Column({ type: 'boolean', default: true })
aktif: boolean;

@Column({ type: 'int', nullable: true })
upline: number;

@Column({ type: 'int', default: 0 })
markup: number;

@Column({ type: 'boolean', default: false })
fee_tunda: boolean;

@Column({ type: 'bigint', default: 0 })
saldo: number;

@Column({ type: 'bigint', default: 0 })
selisih: number;

@Column({ type: 'varchar', nullable: true })
otp: string;

@Column({ type: 'timestamp', nullable: true })
otp_expired: Date;

@Column({ type: 'smallint', default: 0 })
otp_counter: number;

@Column({ type: 'int' })
provinsi: number;

@Column({ type: 'int' })
kabupaten: number;

@Column({ type: 'int' })
kecamatan: number;

@Column({ type: 'int' })
kelurahan: number;

@Column({ type: 'varchar' })
alamat: string;

@Column({ type: 'varchar', nullable: true })
lokasi: string;

@Column({ type: 'varchar', nullable: true })
nik_ktp: string;

@Column({ type: 'varchar', nullable: true })
foto_ktp: string;

@Column({ type: 'varchar', nullable: true })
foto_kyc: string;

@Column({ type: 'boolean', default: false })
validasi_ktp: boolean;

@Column({ type: 'varchar', nullable: true })
email: string;

@Column({ type: 'boolean', default: false })
validasi_email: boolean;

@Column({ type: 'text', nullable: true })
keterangan: string;

@Column({ type: 'boolean', default: false })
follow_up: boolean;

@Column({ type: 'enum', enum: Object.keys(TIPE_AKTIVITAS), default: TIPE_AKTIVITAS.BARU_1_HARI })
tipe_aktivitas: string;

@Column({ type: 'timestamp', nullable: true })
tgl_aktivitas: Date;

@CreateDateColumn({ type: 'timestamp' })
tgl_created: Date;

@Column({ type: 'timestamp' })
tgl_sinkron: Date;

@UpdateDateColumn({ type: 'timestamp' })
tgl_update: Date;

@OneToMany(() => PengirimGriyabayar, pengirim => pengirim.reseller)
@JoinColumn({ foreignKeyConstraintName: 'id_reseller' })
pengirim: PengirimGriyabayar[];
}