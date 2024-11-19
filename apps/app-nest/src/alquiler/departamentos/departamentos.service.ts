import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Departamento } from './departamentos.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { DepartamentoDto } from './departamentos.dto';
import { PaginationQueryDto } from '../../common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class DepartamentosService {

  constructor(
    @InjectRepository(Departamento) private readonly repo: Repository<DepartamentoDto>,
    @Inject('MAILER') private readonly proxy: ClientProxy
  ) { }

  create(createDepartamentoDto: DepartamentoDto) {
    return 'this action adds a new departamento;'
  }

  async createDepartamento(departamentoDto: DepartamentoDto){

    try {

      const departamento = await this.repo.save(departamentoDto);

      return departamento;
      
    } catch (error) {
      console.error(error);
      throw new BadRequestException(HttpStatus.BAD_REQUEST, 'error a la hora de crear un departamento')
    }

  }

  //trae todas los departamentos
  async getAll(paginationQuery: PaginationQueryDto): Promise<{
    data: DepartamentoDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10 } = paginationQuery;
    try {
      const [departamento, total] = await this.repo.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
      });
      if (!departamento) throw new NotFoundException('Parcelas not found');
      return { data: departamento, total, page, limit };
    } catch (err) {
      if (err instanceof QueryFailedError)
        throw new HttpException(`${err.name} ${err.driverError}`, 404);
      throw new HttpException(err.message, err.status);
    }
  }
  //trae departamento por indice id 
  async getOne(id: number): Promise<DepartamentoDto> {
    try {
      const departamento = await this.repo.findOne({ where: { id } });

      if (!departamento) throw new NotFoundException('Parcela no encontrada');
      return departamento;
    } catch (err) {
      console.error(err);
      if (err instanceof QueryFailedError)
        throw new HttpException(`${err.name} ${err.driverError}`, 404);
      throw new HttpException(err.message, err.status);
    }
  }

}
