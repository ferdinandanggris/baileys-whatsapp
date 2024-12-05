import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('imcenter_logs')
export class ImcenterLogs{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({default : () => 'CURRENT_TIMESTAMP'})
    tgl_entry!: Date;

    @Column({type : 'int'})
    imcenter_id!: number;

    @Column({type : 'varchar', nullable : true})
    message_id!: string;

    @Column({type : 'enum', enum : ['log', 'outbox', 'inbox'], default : 'log'})
    type!: string;

    @Column({type : 'varchar', nullable : true})
    keterangan!: string;

    @Column({type : 'varchar', nullable : true  })
    kode_reseller!: string;

    @Column({type : 'varchar', nullable : true})
    pengirim!: string;

    @Column({type : 'enum' , enum : ['Diterima', 'Dibaca'], nullable : true})
    status!: string;

    @Column({type : 'varchar', nullable : true})
    raw_message!: string;

    @Column({nullable : true})
    sender_timestamp!: Date;
}