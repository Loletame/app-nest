import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "src/usuarios/usuarios.entity";
import { Departamento } from "../departamentos/departamentos.entity";

@Entity('reservas')
export class Reserva {
    @PrimaryGeneratedColumn('increment')
    id: number;

   //cuando la usa
   @Column({ type: 'date', nullable: false })
   entrada: Date
   @Column({ type: 'date', nullable: true })
   salida: Date

   //usuario que reserva
   @ManyToOne(() => Usuario, usuario => usuario.id)
   @JoinColumn({name: 'usuarioId'})
   usuario: Usuario;
   
   //a cual parcela
   @ManyToOne(() => Departamento, departamento => departamento.id)
   @JoinColumn({name: 'parcelaId'})
   departamento: Departamento;
}