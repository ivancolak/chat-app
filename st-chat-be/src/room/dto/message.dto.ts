import { IsNotEmpty } from 'class-validator';
import { UserDto } from 'src/users/dto/user.dto';
import { RoomDto } from './room.dto';

export class MessageDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  room: RoomDto;

  @IsNotEmpty()
  user: UserDto;

  roomId?: number;

  userId?: string;
}
