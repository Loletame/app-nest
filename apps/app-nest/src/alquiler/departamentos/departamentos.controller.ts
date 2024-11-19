import { Body, Controller, Get, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';
import { DepartamentosService } from './departamentos.service';
import { PaginationQueryDto } from '../../common';
import { DepartamentoDto } from './departamentos.dto';
import { Response } from 'express';

@Controller('departamentos')
export class DepartamentosController {
    constructor(private readonly service: DepartamentosService) { }
    //trae todas lasdepartamentos
    @Get()
    async getAll(@Query() paginationQuery: PaginationQueryDto) {
        return await this.service.getAll(paginationQuery);
    }
    //trae departamento por indice id
    @Get(':id')
    async getOne(@Param('id') id: number) {
        return await this.service.getOne(id);
    }

    @Post('departamento')
    async createDepartamento(
        @Body() deptoDto: DepartamentoDto,
        @Res() res: Response
    ) {
        const result = await this.service.createDepartamento(deptoDto)
        res.status(HttpStatus.CREATED)
        .json({ result, msg: 'creado on exito' });
    }

}
