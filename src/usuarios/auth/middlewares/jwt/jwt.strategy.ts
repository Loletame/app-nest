import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { envs } from "src/configs";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor (){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: envs.jwt,
        });
    }
    async validate (payload: any){
        return { ...payload.user};
    }

}