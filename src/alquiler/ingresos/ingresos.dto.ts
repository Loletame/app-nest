import { IsDate, IsNotEmpty, IsOptional } from "class-validator";
import { ParcelaDto } from "../parcelas/parcelas.dto";
import { UsuarioDto } from "src/usuarios/usuarios.dto";

export class IngresoDto {

    id: number;

    @IsDate()
    entrada: Date;

    @IsOptional()
    @IsDate()
    salida: Date;

    @IsNotEmpty()    
    usuario: UsuarioDto;
    
    @IsNotEmpty()
    parcela: ParcelaDto;

}