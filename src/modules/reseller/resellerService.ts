import { AppDataSource } from "../../configs/db";
import { Merchant } from "../../entities/merchant";
import { Pengirim } from "../../entities/pengirim";
import { PengirimGriyabayar } from "../../entities/pengirimGriyabayar";
import { Reseller as ResellerEntity } from "../../entities/reseller";
import { ResellerGriyabayar } from "../../entities/resellerGriyabayar";
import { TIPE_PENGIRIM } from "../../entities/types";
import { Reseller } from "../../interfaces/reseller";

export default class ResellerService {
    private repository = {
        default : AppDataSource.getRepository(ResellerEntity),
        griyabayar : AppDataSource.getRepository(ResellerGriyabayar)
    }

    async findByPhoneNumber(phone_number: string, is_griyabayar : boolean, tipe : TIPE_PENGIRIM): Promise<Reseller> {

        if (is_griyabayar) {
            if(phone_number.startsWith('62')){
                phone_number = phone_number.substring(2);
                phone_number = `0${phone_number}`;
            }

            const result = await this.repository.griyabayar.createQueryBuilder('reseller')
                .leftJoinAndSelect("reseller.pengirim", "pengirim")
                .where('pengirim.pengirim = :phone_number', { phone_number })
                .andWhere('pengirim.tipe = :tipe', { tipe }).getOne();

            // object Keys to type Reseller
            var reseller: Reseller = {
                kode: result?.kode,
                tipe: result?.pengirim[0]?.tipe,
                id_reseller: result?.id
            }

            return reseller;
        }

        const result = await this.repository.default.createQueryBuilder('reseller')
        .leftJoinAndSelect("reseller.merchant", "merchant")
        .leftJoinAndSelect("merchant.pengirim", "pengirim")
        .where('pengirim.pengirim = :phone_number', { phone_number })
        .andWhere('pengirim.tipe = :tipe', { tipe }).getOne();


        var reseller : Reseller = {
            kode: result?.kode,
            tipe: result?.merchant?.pengirim[0]?.tipe,
            id_reseller: result?.id,
            id_master: result?.merchant?.id_master,
            id_merchant: result?.merchant?.id
        }
        return reseller;
    }

}