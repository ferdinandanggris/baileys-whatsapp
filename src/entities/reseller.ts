import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinTable, JoinColumn } from 'typeorm';
import { Merchant } from './merchant';

@Entity('reseller', { schema: 'processor' })
export class Reseller {
@PrimaryGeneratedColumn()
id: number;

@Column({ type: 'varchar', nullable: true })
kode: string;

@Column({ type: 'int', default: 0 })
id_master: number;

@Column({ type: 'int', default: 0 })
id_merchant: number;

@Column({ type: 'varchar', nullable: true })
id_upline: string;

@Column({ type: 'int', default: 0 })
markup: number;

@Column({ type: 'varchar', nullable: true })
keterangan: string;

@Column({ name: 'tipe_pendaftaran', type: 'varchar', nullable: true })
tipePendaftaran: string;

@Column({ name: 'tgl_pendaftaran', type: 'timestamp', nullable: true })
tglPendaftaran: Date;

@Column({ name: 'tgl_aktivitas', type: 'timestamp', nullable: true })
tglAktivitas: Date;

@Column({ name: 'tgl_update', type: 'timestamp', nullable: true })
tglUpdate: Date;

@ManyToOne(() => Merchant)
@JoinColumn({ name: 'id_merchant' })
merchant: Merchant;
}