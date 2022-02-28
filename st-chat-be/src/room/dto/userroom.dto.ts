import { IsNotEmpty } from 'class-validator';
import { RoomDto } from './room.dto';
import { UserDto } from 'src/users/dto/user.dto';

export class UserRoomDto {
  @IsNotEmpty()
  id: number;

  room: RoomDto;

  user: UserDto;

  notificationCount: number;

  roomName?: string;
  userId?: number;
}
