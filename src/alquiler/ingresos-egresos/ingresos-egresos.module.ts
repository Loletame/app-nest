import { Module } from '@nestjs/common';
import { IngresosEgresosController } from './ingresos-egresos.controller';
import { IngresosEgresosService } from './ingresos-egresos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parcela } from '../parcelas/parcelas.entity';
import { Usuarios } from 'src/usuarios/usuarios.entity';
import { IngresoEgreso } from './ingresos-egresos.entity';


@Module({
  imports:[TypeOrmModule.forFeature([IngresoEgreso, Parcela, Usuarios])],
  controllers: [IngresosEgresosController],
  providers: [IngresosEgresosService]
})
export class IngresosEgresosModule {}
