import { Module } from '@nestjs/common';
import { IngresosController } from './ingresos.controller';
import { IngresosService } from './ingresos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parcela } from '../parcelas/parcelas.entity';
import { Usuario } from 'src/usuarios/usuarios.entity';
import { Ingreso } from './ingresos.entity';
import { ParcelasService } from '../parcelas/parcelas.service';


@Module({
  imports:[TypeOrmModule.forFeature([Ingreso, Parcela, Usuario])],
  controllers: [IngresosController],
  providers: [IngresosService, ParcelasService]
})
export class IngresosModule {}
