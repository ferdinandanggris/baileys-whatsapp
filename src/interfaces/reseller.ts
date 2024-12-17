import { TIPE_PENGIRIM } from "../entities/types"

export type ResellerModel = {
    kode: string;
    tipe: TIPE_PENGIRIM;
    id_master?: number;
    id_merchant?: number;
    id_reseller: number;
    
}