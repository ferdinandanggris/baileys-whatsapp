import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('whatsapp_sessions')
export class WhatsappSession{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({unique : true})
    sessionKey!: string;

    @Column({type : 'jsonb', nullable : true})
    sessionData!: Record<string, any> | null;
}