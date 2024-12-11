import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TIPE_APLIKASI } from "./types";

@Entity('imcenter_logs')
export class ImcenterLogs{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({})
    tgl_entri!: Date;

    @Column({type : 'int'})
    imcenter_id!: number;

    @Column({type : 'varchar', nullable : true})
    message_id!: string;

    @Column({type : 'enum', enum : Object.values(TIPE_APLIKASI), default : TIPE_APLIKASI.GOLANG})
    aplikasi!: string
    
    @Column({type : 'enum', enum : Object.values(ImcenterLogs)})
    tipe!: string;

    @Column({type : 'text', nullable : true})
    keterangan!: string;

    @Column({type : 'varchar', nullable : true  })
    kode_reseller!: string;

    @Column({type : 'varchar', nullable : true})
    pengirim!: string;

    @Column({type : 'varchar',nullable : true})
    status!: string;

    @Column({type : 'varchar', nullable : true})
    raw_message!: string;

    @Column({nullable : true})
    sender_timestamp!: Date;
}