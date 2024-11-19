import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from 'apps/app-nest/src/app.controller';
import { AppService } from 'apps/app-nest/src/app.service';
import { UsuariosModule } from 'apps/app-nest/src/usuarios/usuarios.module';

import { TypeOrmModule } from '@nestjs/typeorm';
<<<<<<< Updated upstream
import { JwtMiddleware } from './usuarios/auth/middlewares/jwt/jwt.middleware';
import { dbConfig } from './configs/database-config';
import { SocketModule } from './socket/socket.module';
=======
import { JwtMiddleware } from 'apps/app-nest/src/usuarios/auth/middlewares/jwt/jwt.middleware';
import { dbConfig } from 'apps/app-nest/src/configs';
import { SocketModule } from 'apps/app-nest/src/socket/socket.module';
import { DepartamentosModule } from 'apps/app-nest/src/alquiler/departamentos/departamentos.module';
import { IngresosModule } from 'apps/app-nest/src/alquiler/ingresos/ingresos.module';
import { ParcelasModule } from 'apps/app-nest/src/alquiler/parcelas/parcelas.module';
import { ReservasModule } from 'apps/app-nest/src/alquiler/reservas/reservas.module';
>>>>>>> Stashed changes

@Module({
  imports: [
    
    TypeOrmModule.forRoot(dbConfig),
    UsuariosModule,
    SocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware)
      .exclude({
        path: '/usuarios/auth/login',
        method: RequestMethod.POST,
      },
        {
          path: '/usuarios/auth/register',
          method: RequestMethod.POST,
        },
        {
          path: 'parcelas',
          method: RequestMethod.GET,
        },
        {
          path: 'departamentos',
          method: RequestMethod.GET,
        }
      )
      .forRoutes('')
  }
}
