import { IsDate, IsDateString, IsNotEmpty, IsOptional } from "class-validator";
import { EstadoReserva } from "./reservas.entity";
import { UsuarioDto } from "../../usuarios/usuarios.dto";
import { DepartamentoDto } from "../departamentos/departamentos.dto";

export class ReservaDto {
    id: number;

    @IsNotEmpty({
        message: 'ingrese fecha de entrada'
    })
    @IsDate()
    entrada: Date;


    @IsNotEmpty({
        message: 'ingrese fecha de salida'
    })
    @IsDate()
    salida: Date;
    
    @IsNotEmpty()
    usuario: UsuarioDto;

    @IsNotEmpty()
    departamento: DepartamentoDto;
    

    @IsOptional()
    estado: EstadoReserva = EstadoReserva.PENDIENTE;

    

}