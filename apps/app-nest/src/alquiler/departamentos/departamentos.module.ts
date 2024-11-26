import { Module } from '@nestjs/common';
import { DepartamentosController } from './departamentos.controller';
import { DepartamentosService } from './departamentos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Departamento } from './departamentos.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from '../../configs';
import { Usuario } from '../../usuarios/usuarios.entity';



@Module({
  imports: [ TypeOrmModule.forFeature([Departamento, Usuario]),
    ClientsModule.register([
      {
        name: 'MAILER',
        transport: Transport.TCP,
        options: { port: envs.ms_port, host: envs.ms_host,},
      }
    ])
  ],
  controllers: [DepartamentosController],
  providers: [DepartamentosService],
})
export class DepartamentosModule{}

