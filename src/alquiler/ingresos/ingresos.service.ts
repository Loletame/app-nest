import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Ingreso } from './ingresos.entity';
import { IngresoDto } from './ingresos.dto';
import { Parcela } from '../parcelas/parcelas.entity';
import { ParcelaDto } from '../parcelas/parcelas.dto';
import { Usuario } from 'src/usuarios/usuarios.entity';
import { UsuarioDto } from 'src/usuarios/usuarios.dto';
import { PaginationQueryDto } from 'src/common';

@Injectable()
export class IngresosService {
    constructor(
        @InjectRepository(Ingreso)
        private readonly repo: Repository<IngresoDto>,
        @InjectRepository(Parcela)
        private readonly parcela: Repository<ParcelaDto>,
        @InjectRepository(Usuario)
        private readonly usuario: Repository<UsuarioDto>
    ) { }

    async saveIngreso(
        usuarioId: number,
        parcelaId: number,
        ingreso: IngresoDto
    ) {
        try {
            const usuario = await this.usuario.find({ where: { id: usuarioId } })
            if (!usuario) throw new NotFoundException('usuario no encontrado')
            const parcela = await this.parcela.find({ where: { id: parcelaId } })
            if (!parcela) throw new NotFoundException('parcela no encontrado')

            const result = await this.repo.save(ingreso)
            return result
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
