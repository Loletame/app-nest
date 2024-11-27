import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { envs } from "./envs";
// import * as dotenv from 'dotenv';

// dotenv.config();

export const dbConfig: TypeOrmModuleOptions={
    type: 'mysql',
    host: envs.host,
    username: envs.user,
    password:envs.pass,
    database: envs.database,
    entities: [],
    autoLoadEntities: true,
    synchronize: true,
}