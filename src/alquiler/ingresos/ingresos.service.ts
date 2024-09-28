import { Get, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Ingreso } from './ingresos.entity';
import { IngresoDto } from './ingresos.dto';
import { Parcela } from '../parcelas/parcelas.entity';
import { ParcelaDto } from '../parcelas/parcelas.dto';
import { Usuario } from 'src/usuarios/usuarios.entity';
import { UsuarioDto } from 'src/usuarios/usuarios.dto';
import { PaginationQueryDto } from 'src/common';
import { ParcelasService } from '../parcelas/parcelas.service';

@Injectable()
export class IngresosService {
    constructor(
        @InjectRepository(Ingreso)
        private readonly repo: Repository<IngresoDto>,
        @InjectRepository(Parcela)
        private readonly parcela: Repository<ParcelaDto>,
        private readonly parcelaS: ParcelasService,
        @InjectRepository(Usuario)
        private readonly usuario: Repository<UsuarioDto>
    ) { }

    async saveIngreso(
        usuarioId: number,
        parcelaId: number,

    ): Promise<IngresoDto> {
        try {
            // comprueba que exista el usuario 
            const usuarioF = await this.usuario.findOne({ where: { id: usuarioId } })
            if (!usuarioF) throw new NotFoundException('usuario no encontrado')
            //Comprueba si existe la parcela y que no este ocupada
            const parcelaF = await this.parcela.findOne({ where: { id: parcelaId } })
            if (!parcelaF) throw new NotFoundException('parcela no encontrado')
            if (parcelaF.ocupada) throw new NotFoundException(`parcela ${parcelaId} en uso`)

            const ingreso = this.repo.create({
                //carga usuario
                usuario: usuarioF,
                //carga parcela
                parcela: parcelaF,
                //carga date actual en ingreso
                entrada: new Date(),
                salida: null,
            })
            //
            if (ingreso) this.parcelaS.ocupar(parcelaId)
            return this.repo.save(ingreso)






        } catch (err) {
            console.error(err)
            if (err instanceof QueryFailedError)
                throw new HttpException(`${err.name} ${err.driverError}`, 404);
            throw new HttpException(err.message, err.status)
        }
    }

    async saveEgreso(
        parcelaId: number,
        usuarioId: number,
        ingresoId: number
    ): Promise<IngresoDto> {

        const parcelaF = await this.parcela.findOne({ where: { id: parcelaId } });
        // se fija si existe la parcela y si  esta ocupada
        if (!parcelaF) { throw new NotFoundException(`Parcela no encontrada ${parcelaId}`); }
        if (!parcelaF.ocupada) { throw new NotFoundException(`Parcela ${parcelaId} no esta ocupada`); }

        // comprueba que existe el ingreso de determinado usuario
        const ingresoE = await this.repo.findOne({ where: { id: ingresoId }, relations: ['usuario', 'parcela'] })
        if (!ingresoE) throw new NotFoundException(`Ingreso no encontrado ${ingresoId}`)
        // comprueba que exista el usuario 
        const usuarioF = await this.usuario.findOne({ where: { id: usuarioId } });
        if (!usuarioF) throw new NotFoundException('Usuario no encontrado');

        //ve si la parcela en base de datos sea la misma que la ingresada (id)
        if (ingresoE.parcela.id != parcelaId) {
            console.log(parcelaId)
            console.log(ingresoE)
            throw new NotFoundException(
                `La parcela ${parcelaId} no esta en el registro ${ingresoId}`);

        }

        //chequea que el usuario en base de datos coincida con el ingresado(id)
        if (ingresoE.usuario.id != usuarioId) {
            throw new NotFoundException(
                `El usuario ${usuarioId} no esta en el registro ${ingresoId}`);
        }

        // Verifica si el usuario y la parcela del "ingresoEncontrado" coinciden con los IDs proporcionados
        const salir = (ingresoE.usuario.id == usuarioId && ingresoE.parcela.id == parcelaId)


        // si hay una desocupacion 
        if (salir) {
            //cambiar a false la ocupacion parcela/ocupacion
            this.parcelaS.desocupar(parcelaId)
            //cargar la fecha actual en ingresos/salida      
            this.repo.update(ingresoId, { salida: new Date() })
        }

        return
    }

    //trae todos los ingresos   
    async getAll(paginationQuery: PaginationQueryDto): Promise<{
        data: IngresoDto[];
        total: number;
        page: number;
        limit: number;
    }> {
        const { page = 1, limit = 10 } = paginationQuery;
        try {
            const [entrada, total] = await this.repo.findAndCount({
                skip: (page - 1) * limit,
                take: limit,
            });
            if (!entrada) throw new NotFoundException('User not found');

            return { data: entrada, total, page, limit };
        } catch (err) {
            if (err instanceof QueryFailedError)
                throw new HttpException(`${err.name} ${err.driverError}`, 404);
            throw new HttpException(err.message, err.status);
        }
    }
}
