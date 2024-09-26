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

            const usuarioF = await this.usuario.findOne({ where: { id: usuarioId } })
            if (!usuarioF) throw new NotFoundException('usuario no encontrado')
            const parcelaF = await this.parcela.findOne({ where: { id: parcelaId } })
            if (!parcelaF) throw new NotFoundException('parcela no encontrado')
            if (parcelaF.ocupada) throw new NotFoundException(`parcela ${parcelaId}en uso`,)

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
            if (ingreso) this.parcelaS.update(parcelaId)
            return this.repo.save(ingreso)






        } catch (err) {
            console.error(err)
            if (err instanceof QueryFailedError)
                throw new HttpException(`${err.name} ${err.driverError}`, 404);
            throw new HttpException(err.message, err.status)
        }
    }
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
