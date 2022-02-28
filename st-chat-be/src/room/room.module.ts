import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entity/message.entity';
import { RoomEntity } from './entity/room.entity';
import { WorkspaceEntity } from 'src/workspace/entity/workspace.entity';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { UserEntity } from 'src/users/entity/user.entity';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserRoomEntity } from './entity/userroom.entity';

@Module({
  imports: [
    RoomModule,
    WorkspaceModule,
    UsersModule,
    AuthModule,
    TypeOrmModule.forFeature([MessageEntity,RoomEntity,WorkspaceEntity,UserEntity,UserRoomEntity])
  ],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService]
})
export class RoomModule {}
