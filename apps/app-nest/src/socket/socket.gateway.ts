import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';
import { AuthService } from '../usuarios/auth/auth.service';

@WebSocketGateway()
export class SocketGateway implements OnModuleInit {
  constructor(
    private readonly socketService: SocketService,
    private readonly auth: AuthService,
  ) { }
  @WebSocketServer()
  server: Server;
  clients: { [key: string]: { socket: Socket } } = {};
  onModuleInit() {
    this.server.on('connection', async (socket: Socket) => {
      try {
        //Veificacion Token
        const payload = await this.auth.verifyJwt(socket.handshake.headers.authorization,);
        const socketUsuario = this.socketService.getSocket(
          +socket.handshake.headers['usuario'],
        );
        if (socketUsuario) {
          socketUsuario.socket.emit(`El usuario: ${payload.nombre} establecio una conexion`,)
        }
        
        console.log(payload);
        console.log(`Usuario conectado con id: ${socket.id}`,
          socket.handshake.headers['usuario'],
        );
        this.clients[socket.id] = { socket: socket };
        //emite mensaje bienvenida
        this.server.emit('welcome-message', `Bienvenido al servidor, usuario ${socket.id}`,);     
        //mandamos la info del user al servicio
        this.socketService.onConnection(socket, payload);



        socket.on('disconnect', () => {
          console.log(`Usuario desconectado con id: ${socket.id}`);
          //si se desconecta, se elimina el usuario del servicio
          this.socketService.onDisconnection(socket);

        })
      } catch (error) {
        //en caso de error se debe desconectar
        socket.disconnect();
        throw new UnauthorizedException('informacion incorrecta')
      }
    });
  }
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
