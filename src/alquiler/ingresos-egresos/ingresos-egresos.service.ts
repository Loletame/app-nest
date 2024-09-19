import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { IngresoEgreso } from './ingresos-egresos.entity';
import { IngresoEgresoDto } from './ingresos-egresos.dto';
import { Parcela } from '../parcelas/parcelas.entity';
import { ParcelaDto } from '../parcelas/parcelas.dto';
import { Usuarios } from 'src/usuarios/usuarios.entity';
import { UsuarioDto } from 'src/usuarios/usuarios.dto';

@Injectable()
export class IngresosEgresosService {
    constructor(
        @InjectRepository(IngresoEgreso)
        private readonly repo: Repository<IngresoEgresoDto>,
        @InjectRepository(Parcela)
        private readonly parcela: Repository<ParcelaDto>,
        @InjectRepository(Usuarios)
        private readonly usuario: Repository<UsuarioDto>
    ) { }

    async saveIngreso(
        usuarioId: number,
        parcelaId: number,
        ingresoEgreso: IngresoEgresoDto
    ) {
        try {
            const usuario = await this.usuario.find({ where: { id: usuarioId } })
            if (!usuario) throw new NotFoundException('usuario no encontrado')
            const parcela = await this.parcela.find({ where: { id: parcelaId } })
            if (!parcela) throw new NotFoundException('parcela no encontrado')

            const result = await this.repo.save(ingresoEgreso)
            return result
        } catch (err) {
            console.error(err)
            if (err instanceof QueryFailedError)
                throw new HttpException(`${err.name} ${err.driverError}`, 404);
            throw new HttpException(err.message, err.status)
        }
    }
}
