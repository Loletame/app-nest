import { Controller, Body, Param, Post } from '@nestjs/common';
import { IngresosEgresosService } from './ingresos-egresos.service';
import { IngresoEgresoDto } from './ingresos-egresos.dto';

@Controller('ingresos-egresos')
export class IngresosEgresosController {
    constructor(private readonly service: IngresosEgresosService) {}

        @Post('entrada')
        async saveIngreso(
            @Body() ingreso: IngresoEgresoDto,
            usuarioId: number,
            parcelaId: number
        ){
            const result = await this.service.saveIngreso(usuarioId, parcelaId, ingreso);
            return result;
    }
}
