import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Departamento } from '../departamentos/departamentos.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { EstadoReserva, Reserva } from './reservas.entity';
import { ReservaDto } from './reservas.dto';
import { DepartamentoDto } from '../departamentos/departamentos.dto';
import { Usuario } from 'src/usuarios/usuarios.entity';
import { UsuarioDto } from 'src/usuarios/usuarios.dto';
import { PaginationQueryDto } from 'src/common';
import { AuthService } from 'src/usuarios/auth/auth.service';

@Injectable()
export class ReservasService {
    constructor(
        @InjectRepository(Reserva)
        private readonly repo: Repository<ReservaDto>,
        @InjectRepository(Departamento)
        private readonly departamento: Repository<DepartamentoDto>,
        @InjectRepository(Usuario)
        private readonly usuario: Repository<UsuarioDto>,
        private readonly authService: AuthService
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
    async compareEstadoReserva(id: number, reserva: Partial<ReservaDto>) {
        try {
            const reservaId = await this.repo.findOne({
                where: { id }
            })
            if (!reservaId) {
                return new BadRequestException('no existe tal reserva')
            }
            if (reservaId.estado === EstadoReserva.APROBADA) {
                return new UnauthorizedException('reserva ya APROBADA, no es posible el registro')
            }
        } catch (error) {
            console.log(error)
            const httpStatus = HttpStatus.INTERNAL_SERVER_ERROR
            throw new HttpException('no trajo los datos necesarios', httpStatus)
        }

    }


    async updateEstadoReserva(reservaId: number, EstadoReserva: Partial<ReservaDto>) {

        try {
            const reserva = await this.repo.findOne({ where: { id: reservaId } });
            if (!reserva) {
                return new BadRequestException('no existe tal reserva')
            }
            const update = await this.repo.update(reserva, EstadoReserva);
            if (!update) return;
            if (update) return { msg: ` actualizado con exito a ${EstadoReserva.estado}!` };
        } catch (error) {
            console.log(error);
            throw new BadRequestException('error a la hora de registrarse')
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


