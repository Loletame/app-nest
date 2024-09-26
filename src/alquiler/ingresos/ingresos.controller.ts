import { Controller, Body, Param, Post, Query, Get } from '@nestjs/common';
import { IngresosService } from './ingresos.service';
import { IngresoDto } from './ingresos.dto';
import { PaginationQueryDto } from 'src/common';

@Controller('ingresos')
export class IngresosController {
    constructor(private readonly service: IngresosService) {}

        @Post('entrada')
        async saveIngreso(
            @Body('usuarioId')  usuarioId: number,
            @Body('parcelaId')  parcelaId: number
            
        ){
            const result = await this.service.saveIngreso(usuarioId, parcelaId);
            return result;
    }
    @Get()
    async getAll(@Query() paginationQuery: PaginationQueryDto) {
        return await this.service.getAll(paginationQuery);
    }
}
