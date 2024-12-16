import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { STATUS_INBOX, TIPE_PENGIRIM } from './types';

@Entity('inbox', { schema: 'griyabayar' })
export class InboxGriyabayar {
@PrimaryGeneratedColumn()
id?: number | null;

@CreateDateColumn({ type: 'timestamptz' })
tgl_entri: Date;

@Column({ type: 'varchar', nullable: true })
kode_reseller: string | null;

@Column({ type: 'enum', enum : Object.keys(TIPE_PENGIRIM) })
tipe: string; // Assuming 'tipe' is a string, adjust the type as necessary

@Column({ type: 'varchar' })
penerima: string;

@Column({ type: 'varchar' })
pengirim: string;

@Column({ type: 'text' })
pesan: string;

@Column({ type: 'enum', enum : Object.keys(STATUS_INBOX) })
status: string; // Assuming 'status' is a string, adjust the type as necessary

@CreateDateColumn({ type: 'timestamptz' })
tgl_status: Date;

@Column({ type: 'int', nullable: true })
id_imcenter: number | null;

@Column({ type: 'int', nullable: true })
id_smsgateway?: number | null;

@Column({ type: 'bigint', nullable: true })
id_outbox?: number | null;

@Column({ type: 'varchar', nullable: true })
service_center: string | null;

@Column({ type: 'varchar', nullable: true })
raw_message: string | null;

@Column({ type: 'timestamptz', nullable: true })
sender_timestamp: Date | null;
}