import { FindOperator, In } from "typeorm";
import { Parameter } from "../../../entities/parameter";
import { AppDataSource } from "../../../configs/db";
import { PARAMETER_GROUP } from "../../../entities/types";
import { IParameter } from "../../../interfaces/parameter";
import { ParameterGriyaBayar } from "../../../entities/parameterGriyabayar";

export default class ParameterService {
    private repository = {
        default : AppDataSource.getRepository(Parameter),
        griyabayar : AppDataSource.getRepository(ParameterGriyaBayar) 
    }

    async getParameterAutoResponse(key: string): Promise<Parameter> {
        return this.repository.griyabayar.createQueryBuilder('parameter').where(`key = LEFT('${key}',${key.length})`).addOrderBy("prioritas", "ASC").getOne();
    }
    
    async findByGroupAndKey(group : PARAMETER_GROUP, key : string , griyabayar : boolean): Promise<IParameter> {
        if(griyabayar)
            return this.repository.griyabayar.findOne({where : {group : group, key}});

        return this.repository.default.findOne({where : {group : group, key}});
    }
}