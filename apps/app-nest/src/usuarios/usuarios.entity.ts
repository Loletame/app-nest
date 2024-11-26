import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER"
}

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER"
   
}

@Entity('usuarios')
export class Usuario {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    nombre: string;
    @Column({ type: 'varchar', length: 255, nullable: false })
    password: string;
    @Column({ type: 'varchar', unique: true, length: 255, nullable: false })
    email: string;
    @Column({ type: 'enum', enum: Role, default: Role.USER})
    role: Role;
    @Column({ type: 'bool', default: true })
    isActive: boolean;
    @Column({ type: 'varchar', length: 255, nullable: false })
    avatar: string;

}