import { WASocket } from "baileys";
import { ImCenterService } from "../services/imcenterService";

export class ProfileHandler{
    constructor(private imcenter_id : number,private socket: WASocket, private imcenterService : ImCenterService) {
    }

    async updateProfileStatus() {
        try {
            const imcenter = await this.imcenterService.getImcenterById(this.imcenter_id);
            if (!imcenter) {
                throw new Error("Imcenter not found");
            }
            if(imcenter.status_pesan){
                this.socket.updateProfileStatus(imcenter.status_pesan);
            }
        } catch (error) {
            console.error("Gagal update status", error);
        }

    }
}