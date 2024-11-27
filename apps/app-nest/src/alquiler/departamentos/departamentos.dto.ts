import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class DepartamentoDto {

    id: number;

    @IsString()
    nombre: string;

    @IsString()
    @IsOptional()
    descripcion: string;


    @IsInt()
    @IsOptional()
    precio: number;


}