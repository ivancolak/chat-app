import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { RoomModule } from 'src/room/room.module';

@Module({

  imports: [RoomModule],
  providers: [ChatGateway, ChatService]
})
export class ChatModule {}
