import { Body, Controller, Get, HttpStatus, Headers, Param, ParseIntPipe, Patch, Post, Query, Res } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { Response } from 'express';
import { PaginationQueryDto } from '../../common';
import { ReservaDto } from './reservas.dto';
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
    // @Get()
    // async getAll(@Query() paginationQuery: PaginationQueryDto,

    // ) {
    //     return await this.service.getAll(paginationQuery);
    // }
    @Get('/')
  async getAll(@Query() paginationQuery: PaginationQueryDto, @Headers('authorization') authorization: string, @Res() response: Response) {
    const reservas = await this.service.getAll(paginationQuery);
    response.status(HttpStatus.OK).json({ ok: true, result: reservas, msg: 'approved' })
  }
    @Post(':id/update-reserva')
    
    async compareReserva(
      @Body() reservaDto: Partial<ReservaDto>,
      @Param('id') id:number,
      @Res() response: Response
    ){
      const result = await this.service.compareEstadoReserva(id, reservaDto);
      response.status(HttpStatus.CREATED).json({result,msg:'creado con exito'})
    }
    
    @Patch(':id/aceptar')
  async acceptReserva(
    @Param('id', ParseIntPipe) id: number,
    @Headers('authorization') authorization: string,
    @Res() response: Response,
  ) {
    try {
      const splitString = authorization.split('Bearer ')[1]; // Bearer ${token}
      const result = await this.service.acceptRequest(id, splitString);
      response.status(HttpStatus.OK).json({ ok: true, msg: 'aceptada con exito', result })
    } catch (error) {
      return error;
    }
  }

  @Patch(':id/rechazar')
  async rejectReserva(
    @Param('id', ParseIntPipe) id: number,
    @Headers('authorization') authorization: string,
    @Res() response: Response,
  ) {
    try {
      const splitString = authorization.split('Bearer ')[1]; // Bearer ${token}
      const result = await this.service.rejectRequest(id, splitString);
      response.status(HttpStatus.OK).json({ ok: true, msg: 'rechazaza con exito', result })
    } catch (error) {
      return error;
    }
  }
}
  
    // @Patch(':id/change-estado')
    // async updateEstadoReserva(
    //   @Param('id',ParseIntPipe) id: string,
      
    //   @Body() estado: Partial<ReservaDto>
    // ){
  
    //   try {
    //     const result = await this.service.updateEstadoReserva(+id,estado)
    //     return result;
    //   } catch (error) {
    //     console.log(error)
    //     return null;
    //   }
     
    // }





