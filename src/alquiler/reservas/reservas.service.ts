import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Departamento } from '../departamentos/departamentos.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { Reserva } from './reservas.entity';
import { ReservaDto } from './reservas.dto';
import { DepartamentoDto } from '../departamentos/departamentos.dto';
import { Usuario } from 'src/usuarios/usuarios.entity';
import { UsuarioDto } from 'src/usuarios/usuarios.dto';
import { PaginationQueryDto } from 'src/common';

@Injectable()
export class ReservasService {
    constructor(
        @InjectRepository(Reserva)
        private readonly repo: Repository<ReservaDto>,
        @InjectRepository(Departamento)
        private readonly departamento: Repository<DepartamentoDto>,
        @InjectRepository(Usuario)
        private readonly usuario: Repository<UsuarioDto>
    ) { }
    async saveReserva(
        usuarioId: number,
        departamentoId: number,
        fechaEntrada: Date,
        fechaSalida: Date
    ): Promise<ReservaDto> {
        try {
            // comprueba que exista el usuario 
            const usuarioF = await this.usuario.findOne({ where: { id: usuarioId } });
            if (!usuarioF) throw new NotFoundException('Usuario no encontrado');
            //Comprueba si existe el departamento 
            const departamentoF = await this.departamento.findOne({ where: { id: departamentoId } });
            if (!departamentoF) throw new NotFoundException('Departamento no encontrado');
            // Convertimos las fechas string a objetos Date
            const fechaEntradaDate = new Date(fechaEntrada);  // Conversion a Date
            const fechaSalidaDate = new Date(fechaSalida);    // Conversion a Date

            const reserva = this.repo.create({
                //carga usuario
                usuario: usuarioF,
                //carga departamento
                departamento: departamentoF,
                //carga Date entrada
                entrada: fechaEntradaDate,
                //carga Date salida
                salida: fechaSalidaDate
            })

            if (reserva) this.repo.save(reserva)
            return;



        } catch (error) {
            console.log(error);
            throw new BadRequestException('error al momento de registrar reserva')
        }

    }
    async getAll(paginationQuery: PaginationQueryDto): Promise<{
        data: ReservaDto[];
        total: number;
        page: number;
        limit: number;
      }> {
        const { page = 1, limit = 10 } = paginationQuery;
        try {
          const [reserva, total] = await this.repo.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
          });
          if (!reserva) throw new NotFoundException('no hay reservas');
          return { data: reserva, total, page, limit };
        } catch (err) {
          if (err instanceof QueryFailedError)
            throw new HttpException(`${err.name} ${err.driverError}`, 404);
          throw new HttpException(err.message, err.status);
        }
      }


}


