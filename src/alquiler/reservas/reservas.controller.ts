import { Body, Controller, Get, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { Response } from 'express';
import { PaginationQueryDto } from 'src/common';
@Controller('reservas')
export class ReservasController {
    constructor(private readonly service: ReservasService) { }
    
    @Post('entrada')

    /**
     * ejemplo de cuerpo json{
         "usuarioId": 1,
         "departamentoId": 2,
         "fechaEntrada": "2024-09-27T10:00:00Z",
         "fechaSalida": "2024-09-30T10:00:00Z"
         } 
    */

    async saveReserva (
        @Body('usuarioId') usuarioId: number,
        @Body('departamentoId') departamentoId: number,
        @Body('fechaEntrada') fechaEntrada: Date,
        @Body('fechaSalida') fechaSalida: Date,
        
        @Res() response: Response

    ){
        const result = await this.service.saveReserva(usuarioId, departamentoId, fechaEntrada, fechaSalida)
        response.status(HttpStatus.OK).json({ result, msg: 'Reserva solicitada con éxito!' })
        return result;
    }
    @Get()
    async getAll(@Query() paginationQuery: PaginationQueryDto,

    ) {
        return await this.service.getAll(paginationQuery);
    }

}

