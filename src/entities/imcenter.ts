import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('imcenter')
export class Imcenter{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({unique : true})
    nomorhp!: string;

    @Column({type : 'bool'})
    aktif!: boolean;

    @Column({type :  'bool'})
    standby!: boolean;

    @Column({type : 'bool', default : false})
    auto_aktif!: boolean;

    @Column({type : 'varchar', nullable : true})
    qrcode!: string;
}