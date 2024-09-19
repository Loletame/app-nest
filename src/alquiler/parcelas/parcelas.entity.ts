import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('parcelas')
export class Parcela {
    @PrimaryGeneratedColumn('increment')
    id: number;

    //nombre identificador de la parcela
    @Column({ type: 'varchar', length: 255, nullable: true})
    nombre: string
    //descripcion(ubicacion) de la parcela
    @Column({ type: 'varchar', length: 255, nullable: true})
    descripcion: string
    //precio parcela
    @Column({ type: 'integer', default:0 })
    precio: number;

}