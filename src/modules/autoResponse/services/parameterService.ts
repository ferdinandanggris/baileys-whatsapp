import { FindOperator, In } from "typeorm";
import { Parameter } from "../../../entities/parameter";
import { AppDataSource } from "../../../configs/db";

export default class ParameterService {
    private repository = AppDataSource.getRepository(Parameter);

    async getParameterAutoResponse(key: string): Promise<Parameter> {
        return this.repository.createQueryBuilder('parameter').where(`key = LEFT('${key}',${key.length})`).addOrderBy("prioritas", "ASC").getOne();
    }

}