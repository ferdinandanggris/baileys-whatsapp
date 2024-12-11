import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('whatsapp_nodejs_sessions')
export class WhatsappSession{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type : 'varchar',nullable : true})
    jid!: string;

    @Column({ type: "int",unique : true })
    imcenter_id!: number;

    @Column({ type: "text" })
    auth: string;
}