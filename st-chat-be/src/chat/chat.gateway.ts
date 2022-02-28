import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { RoomService } from '../room/room.service';
import { Server, Socket } from 'socket.io';
import { MessageDto } from 'src/room/dto/message.dto';
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private roomService: RoomService) { }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(client.id + ' Connected!');
  }

  handleDisconnect(client: Socket, ...args: any[]) {
    console.log(client.id + ' Disconnected!');
  }

  @SubscribeMessage('userSelectedWorkspace')
  async onUserSelectedWorkspace(
    client: Socket,
    [userId, workspaceId]: string[],
  ) {
    const rooms = await this.roomService.getRooms(workspaceId);
    for (const room of rooms) {
      await client.join(room.name);
    }
  }

  @SubscribeMessage('userSelectedRoom')
  async onUserSelectedRoom(client: Socket, [userId, roomId]: number[]) {
    const messages = await this.roomService.getMessages(roomId);
    await this.roomService.deleteNotifications(userId, roomId);
    client.emit('RoomMessages', messages);
  }

  @SubscribeMessage('chat')
  async onAddMessage(socket: Socket, message: MessageDto) {
    await this.roomService.addMessage(message);
    const room = await this.roomService.getRoomById(message.roomId);
    await this.roomService.notificationUsers(message);

    this.server.to(room.name).emit('chatToFront', message);
  }


  @SubscribeMessage('createRoom')
  async onRoomCreate(client: Socket, room: string) {
    client.join(room);
  }

  @SubscribeMessage('logout')
  async onLogout(client: Socket) {
    console.log('Logout');
  }
}
