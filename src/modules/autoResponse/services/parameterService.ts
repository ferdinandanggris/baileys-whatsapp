import { FindOperator, In } from "typeorm";
import { Parameter } from "../../../entities/parameter";
import { AppDataSource } from "../../../configs/db";
import { PARAMETER_GROUP } from "../../../entities/types";
import { IParameter } from "../../../interfaces/parameter";
import { ParameterGriyaBayar } from "../../../entities/parameterGriyabayar";

export default class ParameterService {
    private repository = AppDataSource.getRepository(Parameter)

    async findByGroupAndKey(group : PARAMETER_GROUP, key : string): Promise<IParameter> {
        return this.repository.findOne({where : {group : group, key}});
    }
}