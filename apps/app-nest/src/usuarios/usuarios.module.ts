import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuarios.entity';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { saveImagesToStorage } from '../helpers/image-storage';
import { envs } from '../configs';

@Module({
  imports: [
     //para que cree la tabla en la bd
    TypeOrmModule.forFeature([Usuario]),
    JwtModule.register({
      secret: envs.jwt,
      signOptions:{
        expiresIn: '24h',
      }      
    }),
    MulterModule.register({
      dest: './uploads',
      fileFilter: saveImagesToStorage('avatars').fileFilter,
      storage: saveImagesToStorage('avatars').storage,
    })
  ],


  controllers: [UsuariosController],
  providers: [UsuariosService, AuthService],
  exports: [AuthService, UsuariosService],
})
export class UsuariosModule { }
