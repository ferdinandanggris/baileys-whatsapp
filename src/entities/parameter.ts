import { Column, Entity, PrimaryColumn } from "typeorm";
import { IParameter } from "../interfaces/parameter";

@Entity({schema : 'processor', name : 'parameter'})
export class Parameter implements IParameter{
    @PrimaryColumn({type : 'varchar'})
    group!: string;

    @PrimaryColumn({type : 'varchar'})
    key!: string;

    @Column({ type: "text" })
    value!: string;

    @Column({ type: "varchar", nullable : true })
    keterangan!: string;
    
    @Column({type : 'int', nullable : true})
    prioritas!: number;

    @Column({nullable : true})
    tgl_update!: Date;
}