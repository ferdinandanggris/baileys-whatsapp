import { AppDataSource } from "../configs/db";
import Imcenter from "../entities/imcenter";
import { Reseller } from "../entities/reseller";
import { TIPE_PENGIRIM } from "../entities/types";
import { ResellerModel } from "../interfaces/reseller";
export class ResellerRepository {
    private repository = AppDataSource.getRepository(Reseller);
    
    async findByPhoneNumber(phone_number: string, tipe : TIPE_PENGIRIM): Promise<ResellerModel> {
        const result = await this.repository.createQueryBuilder('reseller')
        .leftJoinAndSelect("reseller.merchant", "merchant")
        .leftJoinAndSelect("merchant.pengirim", "pengirim")
        .where('pengirim.pengirim = :phone_number', { phone_number })
        .andWhere('pengirim.tipe = :tipe', { tipe }).getOne();

        var reseller : ResellerModel = {
            kode: result?.kode,
            tipe: result?.merchant?.pengirim[0]?.tipe,
            id_reseller: result?.id,
            id_master: result?.merchant?.id_master,
            id_merchant: result?.merchant?.id
        }
        return reseller;
    }
}