
import { Parcela } from "../parcelas/parcelas.entity";
import { Usuarios } from "src/usuarios/usuarios.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';

@Entity('ingresos-egresos')
export class IngresoEgreso{
    @PrimaryGeneratedColumn('increment')
    id: number;

    //date de uso entrada y salida
    @Column({ type: 'date', nullable: false})
    entrada: Date
    @Column({ type: 'date', nullable: false})
    salida: Date

    //usuario que ingresa/sale
    @ManyToOne(() => Usuarios, usuario => usuario.id)
    @JoinColumn({name: 'usuarioId'})
    usuario: Usuarios;

    //a cual parcela
    @ManyToOne(() => Parcela, parcela => parcela.id)
    @JoinColumn({name: 'parcelaId'})
    parcela: Parcela;
}