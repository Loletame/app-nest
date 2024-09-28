import { Controller, Get, Param, Query } from '@nestjs/common';
import { DepartamentosService } from './departamentos.service';
import { PaginationQueryDto } from 'src/common';

@Controller('departamentos')
export class DepartamentosController {
    constructor(private readonly service: DepartamentosService) {}
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
}
