
import { Parcela } from "../parcelas/parcelas.entity";
import { Usuario } from "../../usuarios/usuarios.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';

@Entity('ingresos')
export class Ingreso{
    @PrimaryGeneratedColumn('increment')
    id: number;

    //date de uso entrada y salida
    @Column({ type: 'date', nullable: false})
    entrada: Date
    @Column({ type: 'date', nullable: true})
    salida: Date

    //usuario que ingresa/sale
    @ManyToOne(() => Usuario, usuario => usuario.id)
    @JoinColumn({name: 'usuarioId'})
    usuario: Usuario;

    //a cual parcela
    @ManyToOne(() => Parcela, parcela => parcela.id)
    @JoinColumn({name: 'parcelaId'})
    parcela: Parcela;
}