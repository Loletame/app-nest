import { Controller, Get, HttpStatus, Param, Query, Res } from '@nestjs/common';
import { ParcelasService } from './parcelas.service';
import { PaginationQueryDto } from '../../common';
import { Response } from 'express';
@Controller('parcelas')
export class ParcelasController {
    constructor(private readonly service: ParcelasService) {}
    //trae todas las parcelas
    // @Get()
    // async getAll(@Query() paginationQuery: PaginationQueryDto) {
    //     return await this.service.getAll(paginationQuery);
    // }
    @Get()
    async getAll(@Query() paginationQuery: PaginationQueryDto, @Res() response: Response){
        const parcelas = await this.service.getAll(paginationQuery);
     response.status(HttpStatus.OK).json({ ok: true, result: parcelas, msg: 'approved' })
    }
    //trae parcela por indice id
    @Get(':id')
    async getOne(@Param('id') id: number, @Res() response: Response) {
        const parcela = await this.service.getOne(id);
        response.status(HttpStatus.OK).json({ ok:true, result: parcela, msg: 'approved'})
    }
    
}
