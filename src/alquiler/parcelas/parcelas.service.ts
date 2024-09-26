import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Parcela } from './parcelas.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { ParcelaDto } from './parcelas.dto';
import { PaginationQueryDto } from 'src/common';
@Injectable()
export class ParcelasService {

    constructor(
        @InjectRepository(Parcela) private readonly repo: Repository<ParcelaDto>,

    ) { }

    async update(id:number) {

        try {
          const parcela = await this.repo.findOne({where: {id}});
          if (!parcela) throw new NotFoundException(`No encontramos ninguna parcela con id ${id}`)
          await this.repo.update(parcela, {ocupada: true});
          return parcela;
          
  
        }catch (err) {
          console.error(err);
          if (err instanceof QueryFailedError)
            throw new HttpException(`${err.name} ${err.driverError}`, 404);
          throw new HttpException(err.message, err.status);
        }
      }

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
            if (!parcelas) throw new NotFoundException('Parcelas not found');
            return { data: parcelas, total, page, limit };
        } catch (err) {
            if (err instanceof QueryFailedError)
                throw new HttpException(`${err.name} ${err.driverError}`, 404);
            throw new HttpException(err.message, err.status);
        }
    }
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
