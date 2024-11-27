import { Module } from '@nestjs/common';
import { ReservasController } from './reservas.controller';
import { ReservasService } from './reservas.service';
import { Reserva } from './reservas.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Departamento } from '../departamentos/departamentos.entity';
import { Usuario } from '../../usuarios/usuarios.entity';
import { UsuariosModule } from '../../usuarios/usuarios.module';

@Module({
  imports:[TypeOrmModule.forFeature([Reserva, Departamento, Usuario]), UsuariosModule],
  controllers: [ReservasController],
  providers: [ReservasService]
})
export class ReservasModule {}
