import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "../../usuarios/usuarios.entity";
import { Departamento } from "../departamentos/departamentos.entity";


export enum EstadoReserva {
    PENDIENTE = 'PENDIENTE',
    APROBADA = 'APROBADA',
    DESAPROBADA = 'DESAPROBADA'
}
@Entity('reservas')
export class Reserva {
    @PrimaryGeneratedColumn('increment')
    id: number;

    //cuando la usa
    @Column({ type: 'date', nullable: false })
    entrada: Date
    @Column({ type: 'date', nullable: false })
    salida: Date

    //estado
    @Column({ type: 'enum', enum: EstadoReserva, default: EstadoReserva.PENDIENTE })
    estado: EstadoReserva;

    //usuario que reserva
    @ManyToOne(() => Usuario, usuario => usuario.id)
    @JoinColumn({ name: 'usuarioId' })
    usuario: Usuario;

    //a cual departamento (pueden haber hasta 2 reservas en un mismo departamento)
    @ManyToOne(() => Departamento, departamento => departamento.id)
    @JoinColumn({ name: 'departamentoId' })
    departamento: Departamento;
}