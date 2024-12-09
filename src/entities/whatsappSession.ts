import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('whatsapp_sessions')
export class WhatsappSession{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({unique : true})
    nomorhp!: string;

    @Column({type : 'jsonb', nullable : true})
    sessionCred!: Record<string, any> | null;

    @Column({type : 'jsonb', nullable : true})
    sessionKey!: Record<string, any> | null;
}