import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtMiddleware } from './usuarios/auth/middlewares/jwt/jwt.middleware';
import { dbConfig } from './configs/database-config';
import { SocketModule } from './socket/socket.module';
import { DepartamentosModule } from './alquiler/departamentos/departamentos.module';
import { IngresosModule } from './alquiler/ingresos/ingresos.module';
import { ParcelasModule } from './alquiler/parcelas/parcelas.module';
import { ReservasModule } from './alquiler/reservas/reservas.module';

@Module({
  imports: [
    
    TypeOrmModule.forRoot(dbConfig),
    UsuariosModule,
    SocketModule,
    DepartamentosModule,
    IngresosModule,
    ParcelasModule,
    ReservasModule
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
      )
      .forRoutes('')
  }
}
