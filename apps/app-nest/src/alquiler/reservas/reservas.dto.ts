import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsOptional } from "class-validator";
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
    

    @IsEnum (
        EstadoReserva,{
            message: `solo los estados:${EstadoReserva.APROBADA}/${EstadoReserva.PENDIENTE}/${EstadoReserva.DESAPROBADA} estan permitidos`
        }
    )
    estado: EstadoReserva 

}