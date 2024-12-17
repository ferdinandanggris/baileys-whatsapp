import { AppDataSource } from "../../../configs/db";
import { PengirimGriyabayar } from "../../../entities/pengirimGriyabayar";
import { ResellerGriyabayar } from "../../../entities/resellerGriyabayar";
import { TIPE_PENGIRIM } from "../../../entities/types";

export default class ResellerGriyabayarService {
    private repository = AppDataSource.getRepository(ResellerGriyabayar);

    async findByPhoneNumber(phone_number: string, tipe : TIPE_PENGIRIM): Promise<ResellerGriyabayar> {

        if(phone_number.startsWith('62')){
            phone_number = phone_number.replace('62', '0');
            phone_number = `0${phone_number}`;
        }

        return await this.repository.createQueryBuilder('reseller')
            .leftJoinAndSelect(PengirimGriyabayar, "pengirim" , "pengirim.id_reseller = reseller.id")
            .where('pengirim.pengirim = :phone_number', { phone_number })
            .andWhere('pengirim.tipe = :tipe', { tipe }).getOne();

    }

}