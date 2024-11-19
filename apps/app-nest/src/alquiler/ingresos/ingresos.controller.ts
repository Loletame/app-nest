import { Controller, Body, Param, Post, Query, Get, HttpStatus, Res } from '@nestjs/common';
import { IngresosService } from './ingresos.service';
import { IngresoDto } from './ingresos.dto';
import { PaginationQueryDto } from '../../common';
import { Response } from 'express';

@Controller('ingresos')
export class IngresosController {
    constructor(private readonly service: IngresosService) { }

    @Post('entrada')
    //Guarda ingreso con fecha actual 
    async saveIngreso(
        @Body('usuarioId') usuarioId: number,
        @Body('parcelaId') parcelaId: number,
        @Res() response: Response
    ) {
        const result = await this.service.saveIngreso(usuarioId, parcelaId);
        response.status(HttpStatus.CREATED).json({ result, msg: 'Entrada registrada con éxito!' })
        return result;
    }
    //Guarda la salida con la fecha al (valga la redundancia) momento de  la salida, desocupando la parcela 
    @Post('salida')
    //la idea es otra pero por el momento el id de ingreso seria el codigo unico de salida
    async saveEgreso(
        @Body('parcelaId') parcelaId: number,
        @Body('usuarioId') usuarioId: number,
        @Body('ingresoId') ingresoId: number,
        @Res() response: Response
    ) {
        const result = this.service.saveEgreso(parcelaId, usuarioId, ingresoId);
        response.status(HttpStatus.OK).json({ msg: 'Salida registrada con éxito' });
        return result;
    }

    //Trae todos los ingresos
    @Get()
    async getAll(@Query() paginationQuery: PaginationQueryDto,

    ) {
        return await this.service.getAll(paginationQuery);
    }

}
