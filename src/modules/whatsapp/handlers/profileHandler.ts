import { WhatsappServiceProps } from "../../../interfaces/whatsapp";

export class ProfileHandler{
    constructor(private props : WhatsappServiceProps) {
    }

    async updateProfileStatus() : Promise<void> {
        try {
            const imcenter = await this.props.imcenterService.getImcenterById(this.props.imcenter_id);
            if (!imcenter) {
                throw new Error("Imcenter not found");
            }
            if(imcenter.status_pesan){
                this.props.socket.updateProfileStatus(imcenter.status_pesan);
            }
        } catch (error) {
            console.error("Gagal update status", error);
        }

    }
}