import { AppDataSource } from "../configs/db";
import { ResellerGriyabayar } from "../entities/resellerGriyabayar";
import { TIPE_PENGIRIM } from "../entities/types";
import { ResellerModel } from "../interfaces/reseller";

export class ResellerGriyabayarRepository {
    private repository = AppDataSource.getRepository(ResellerGriyabayar);

    async findByPhoneNumber(phone_number: string, tipe: TIPE_PENGIRIM): Promise<ResellerModel> {
        const result = await this.repository.createQueryBuilder('reseller')
            .leftJoinAndSelect("reseller.pengirim", "pengirim")
            .where('pengirim.pengirim = :phone_number', { phone_number })
            .andWhere('pengirim.tipe = :tipe', { tipe }).getOne();

        // object Keys to type Reseller
        var reseller: ResellerModel = {
            kode: result?.kode,
            tipe: result?.pengirim[0]?.tipe,
            id_reseller: result?.id
        }

        return reseller;
    }
}
