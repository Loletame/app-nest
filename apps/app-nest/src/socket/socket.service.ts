import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Payload } from '../common';

@Injectable()
export class SocketService {

    /**
     * @description
     * Almacenamos los users conectados
     */
    private clients: { [key: string]: { socket: Socket; payload: Payload } } = {};

    /** 
     * @description
     * Almacenamos el socket el usuario, identificado por el id unico generado
     */
    onConnection(socket: Socket, payload: Payload) {
        this.clients[socket.id] = { socket: socket, payload: payload };

    }
    /** 
     * @description
     * Una vez desconectado, se elimina de la lista
     */
    onDisconnection(socket: Socket) {
        delete this.clients[socket.id];
    }

    /**
     * @description
     * Obtenemos un socket a traves de id de un usuario
     */
    getSocket(id: number) {
        //recorremos la lista objeto valor 
        for (let key in this.clients) {
            //retornamos el valor
            if (this.clients[key].payload.sub == id) return this.clients[key];
            //o si no existe, nulo.
            else return null;
            
        }

    }

}
