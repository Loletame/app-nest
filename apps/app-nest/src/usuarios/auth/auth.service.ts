import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import { UsuarioDto } from "../usuarios.dto";

@Injectable()
export class AuthService {

    /** 
    * @param password nueva contraseña de usuario
    * @returns contraseña hasheada
*/
    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 12);
    }

    /**
     * @description compara la contraseña del login y la compara con la guardada
     * @param password entra la contraseña
     * @param hashPassword contraseña del usuario guardada
     * @returns booleano
     */
    async validatePassword(password: string, hashedPassword: string,): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
    constructor(private jwtService: JwtService) { }
    /**
     * @description compara el token de sesion de usuario
     * @param jwt jwt del cliente
     * @returns payload
     */
    async verifyJwt(jwt: string): Promise<any> {
        return await this.jwtService.verifyAsync(jwt);
    }
    /**
     * @param usuario
     * @returns token generado
     *
     */
    async generateJwt(user: UsuarioDto): Promise<string>{
        /**
         * @description
         * creamos el payload con la informacion del usuario
         */
        const payload = {
            sub: user.id,
            email: user.email,
            nombre: user.nombre,
        };
        return this.jwtService.signAsync(payload);
    }

    
    
}

