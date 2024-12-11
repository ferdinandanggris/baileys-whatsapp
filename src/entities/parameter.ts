import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({schema : 'processor', name : 'parameter'})
export class Parameter{
    @PrimaryColumn({type : 'varchar'})
    group!: number;

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