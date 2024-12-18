import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { STATUS_INBOX, TIPE_PENGIRIM } from './types';

@Entity({ name: 'inbox', schema: 'processor' })
export class Inbox {
@PrimaryGeneratedColumn({ type: 'bigint' })
id?: number;

@Column({ type: 'timestamptz' })
tgl_entri: Date;

@Column({ type: 'int', nullable: true })
id_reseller?: number | null;

@Column({ type: 'int', nullable: true })
id_merchant?: number | null;

@Column({ type: 'enum', enum: Object.values(TIPE_PENGIRIM), nullable: false }) // Replace with actual enum values
tipe: TIPE_PENGIRIM; // Adjust based on your actual enum definition

@Column({ type: 'varchar' })
penerima: string;

@Column({ type: 'varchar' })
pengirim: string;

@Column({ type: 'text' })
pesan: string;

@Column({ type: 'enum', enum: Object.values(STATUS_INBOX), nullable: false }) // Replace with actual enum values
status: STATUS_INBOX; // Adjust based on your actual enum definition

@Column({ type: 'timestamptz' })
tgl_status: Date;

@Column({ type: 'int', nullable: true })
id_imcenter: number | null;

@Column({ type: 'int', nullable: true })
id_smsgateway?: number | null;

@Column({ type: 'int', nullable: true })
id_supplier?: number | null;

@Column({ type: 'bigint', nullable: true })
id_transaksi?: number | null;

@Column({ type: 'bigint', nullable: true })
id_outbox?: number | null;

@Column({ type: 'varchar', nullable: true })
service_center: string | null;

@Column({ type: 'varchar', nullable: true })
raw_message: string | null;

@Column({ type: 'timestamptz', nullable: true })
sender_timestamp: Date | null;
}