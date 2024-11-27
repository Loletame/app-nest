import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('departamentos')
export class Departamento {
    @PrimaryGeneratedColumn('increment')
    id: number;

    //nombre identificador de el departamento
    @Column({ type: 'varchar', length: 255, nullable: true})
    nombre: string
    //descripcion(ubicacion) de el departamento
    @Column({ type: 'varchar', length: 255, nullable: true})
    descripcion: string
    //precio del departamento 
    @Column({ type: 'integer', default: 0 })
    precio: number;

}