import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { TIPE_PENGIRIM } from './types';

@Entity({ name: 'pengirim', schema: 'griyabayar' })
@Unique(['tipe', 'pengirim'])
export class PengirimGriyabayar {
@PrimaryGeneratedColumn()
id: number;

@Column({ type: 'enum', enum: Object.values(TIPE_PENGIRIM), nullable: false }) // Replace with actual enum values
tipe: string;

@Column({ type: 'varchar', nullable: false })
pengirim: string;

@Column({ type: 'int', nullable: false })
id_reseller: number;

@Column({ type: 'boolean', default: false, nullable: false })
aktif: boolean;

@Column({ type: 'boolean', default: false, nullable: false })
utama: boolean;

@Column({ type: 'varchar', nullable: true })
username?: string;

@Column({ type: 'varchar', nullable: true })
token_access?: string;

@Column({ type: 'varchar', nullable: true })
token_refresh?: string;

@Column({ type: 'varchar', nullable: true })
token_firebase?: string;

@Column({ type: 'text', array: true, default: () => 'ARRAY[]::character varying[]', nullable: false })
sender_process: string[];

@Column({ type: 'timestamp', nullable: true })
tgl_validasi?: Date;

@CreateDateColumn({ type: 'timestamp' })
tgl_created: Date;

@UpdateDateColumn({ type: 'timestamp' })
tgl_update: Date;

@Column({ type: 'timestamp', nullable: true })
tgl_aktivitas?: Date;
}