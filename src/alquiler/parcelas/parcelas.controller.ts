import { Controller, Get, Param, Query } from '@nestjs/common';
import { ParcelasService } from './parcelas.service';
import { PaginationQueryDto } from 'src/common';

@Controller('parcelas')
export class ParcelasController {
    constructor(private readonly service: ParcelasService) {}
    //trae todas las parcelas
    @Get()
    async getAll(@Query() paginationQuery: PaginationQueryDto) {
        return await this.service.getAll(paginationQuery);
    }
    //trae parcela por indice id
    @Get(':id')
    async getOne(@Param('id') id: number) {
        return await this.service.getOne(id);
    }
    
}
