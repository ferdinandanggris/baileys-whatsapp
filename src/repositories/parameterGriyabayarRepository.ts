import { AppDataSource } from "../configs/db";
import { ParameterGriyaBayar } from "../entities/parameterGriyabayar";
import { PARAMETER_GROUP } from "../entities/types";
import { IParameter } from "../interfaces/parameter";

export default class ParameterGriyabayarService {
    private repository = AppDataSource.getRepository(ParameterGriyaBayar) 

    async findByGroupAndKey(group : PARAMETER_GROUP, key : string): Promise<IParameter> {
            return this.repository.findOne({where : {group : group, key}});

    }
}