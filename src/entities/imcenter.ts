import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IMCENTER_TYPE, STATUS_LOGIN, TIPE_APLIKASI } from "./types";
@Entity({schema : 'terminal', name : 'imcenter'})
export default class Imcenter{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type : 'enum', enum : Object.values(IMCENTER_TYPE)})
    tipe!: string;

    @Column({type : 'varchar'})
    label!: string;

    @Column({type : 'varchar'})
    username!: string;

    @Column({type : 'varchar', nullable : true})
    token_api! : string;

    @Column({type : 'varchar', nullable : true})
    connect_api! : string;

    @Column({type : 'varchar', nullable : true})
    status_pesan! : string;

    @Column({type : 'int', default : 0})
    expired_inbox! : number;

    @Column({type : 'int', default : 0})
    pause_kirim! : number;

    @Column({type : 'bool', default : false})
    aktif! : boolean;

    @Column({type : 'bool', default : false})
    disable! : boolean;

    @Column({type : 'bool', default : false})
    broadcast! : boolean;

    @Column({type : 'bool', default : false})
    griyabayar! : boolean;

    @Column({type : 'varchar', nullable : true})
    im_jid! : string;

    @Column({type : 'varchar', nullable : true})
    qr! : string;

    @Column({type : 'varchar', default : false})
    device! : string;

    @Column({type : 'enum', enum: Object.values(TIPE_APLIKASI)})
    aplikasi! : string;

    @Column({type : 'enum', enum : Object.values(STATUS_LOGIN)})
    status_login! : string;

    @Column({nullable : true})
    tgl_aktivitas!: Date;

    @Column({})
    tgl_update!: Date;
}
