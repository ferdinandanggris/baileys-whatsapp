import { AppDataSource } from "../../configs/db";
import { Merchant } from "../../entities/merchant";
import { Pengirim } from "../../entities/pengirim";
import { PengirimGriyabayar } from "../../entities/pengirimGriyabayar";
import { Reseller } from "../../entities/reseller";
import { TIPE_APLIKASI, TIPE_PENGIRIM } from "../../entities/types";

export default class ResellerService {
    private repository = AppDataSource.getRepository(Reseller);

    async findByPhoneNumber(phone_number: string, is_griyabayar : boolean, tipe : TIPE_PENGIRIM): Promise<Reseller> {

        if (is_griyabayar) {
            if(phone_number.startsWith('62')){
                phone_number = phone_number.replace('62', '0');
                phone_number = `0${phone_number}`;
            }

            return await this.repository.createQueryBuilder('reseller')
                .leftJoinAndSelect(PengirimGriyabayar, "pengirim" , "pengirim.id_reseller = reseller.id")
                .where('pengirim.pengirim = :phone_number', { phone_number })
                .andWhere('pengirim.tipe = :tipe', { tipe }).getOne();
        }

        return await this.repository.createQueryBuilder('reseller')
        .leftJoinAndSelect(Merchant, "merchant" , "merchant.id = reseller.id_merchant")
        .leftJoinAndSelect(Pengirim, "pengirim" , "pengirim.id_merchant = merchant.id")
        .where('pengirim.pengirim = :phone_number', { phone_number })
        .andWhere('pengirim.tipe = :tipe', { tipe }).getOne();
    }

}