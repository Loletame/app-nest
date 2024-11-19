import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Parcela } from './parcelas.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { ParcelaDto } from './parcelas.dto';
import { PaginationQueryDto } from '../../common';
@Injectable()
export class ParcelasService {

  constructor(
    @InjectRepository(Parcela) private readonly repo: Repository<ParcelaDto>
  ) { }
  //ocupa la parcela (setea el booleano a verdadero)
  async ocupar(id: number) {

    try {
      const parcela = await this.repo.findOne({ where: { id } });
      if (!parcela) throw new NotFoundException(`No encontramos ninguna parcela con id ${id}`)
      await this.repo.update(parcela, { ocupada: true });
      return parcela;


    } catch (err) {
      console.error(err);
      if (err instanceof QueryFailedError)
        throw new HttpException(`${err.name} ${err.driverError}`, 404);
      throw new HttpException(err.message, err.status);
    }
  }
  //desocupa la parcela (setea el booleano a falso)
  async desocupar(id: number) {

    try {
      const parcela = await this.repo.findOne({ where: { id } });
      if (!parcela) throw new NotFoundException('no encontramos ninguna parcela con ese id')
      await this.repo.update(parcela, { ocupada: false });
      return parcela;


    } catch (err) {
      console.error(err);
      if (err instanceof QueryFailedError)
        throw new HttpException(`${err.name} ${err.driverError}`, 404);
      throw new HttpException(err.message, err.status);
    }
  }
  //trae todas las parcelas
  async getAll(paginationQuery: PaginationQueryDto): Promise<{
    data: ParcelaDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10 } = paginationQuery;
    try {
      const [parcelas, total] = await this.repo.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
      });
      if (!parcelas) throw new NotFoundException('no hay parcelas ');
      return { data: parcelas, total, page, limit };
    } catch (err) {
      if (err instanceof QueryFailedError)
        throw new HttpException(`${err.name} ${err.driverError}`, 404);
      throw new HttpException(err.message, err.status);
    }
  }
  //trae parcela por indice id 
  async getOne(id: number): Promise<ParcelaDto> {
    try {
      const parcela = await this.repo.findOne({ where: { id } });

      if (!parcela) throw new NotFoundException('Parcela no encontrada');
      return parcela;
    } catch (err) {
      console.error(err);
      if (err instanceof QueryFailedError)
        throw new HttpException(`${err.name} ${err.driverError}`, 404);
      throw new HttpException(err.message, err.status);
    }
  }
}
