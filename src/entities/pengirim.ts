import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TIPE_PENGIRIM } from './types';

@Entity('pengirim', { schema: 'processor' })
export class Pengirim {
@PrimaryGeneratedColumn()
id: number;

@Column({ type: 'enum', enum : Object.values(TIPE_PENGIRIM), nullable: true })
tipe: string;

@Column({ type: 'varchar', nullable: true })
pengirim: string;

@Column({ type: 'int', default: 0 })
id_merchant: number;

@Column({ type: 'boolean', default: false })
aktif: boolean;

@Column({ type: 'boolean', default: false })
utama: boolean;

@Column({ type: 'varchar', nullable: true })
username: string;

@Column({ type: 'varchar', nullable: true })
token_access: string;

@Column({ type: 'varchar', nullable: true })
token_refresh: string;

@Column({ type: 'varchar', nullable: true })
token_firebase: string;

@Column('varchar', { array: true, default: () => 'ARRAY[]::character varying[]' })
sender_process: string[];

@Column({ type: 'timestamp', nullable: true })
tgl_aktivitas: Date;

@Column({ type: 'timestamp', nullable: true })
tgl_validasi: Date;

@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
tgl_created: Date;

@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
tgl_update: Date;
}