import { IsNotEmpty } from 'class-validator';
import { RoomDto } from 'src/room/dto/room.dto';
import { PrimaryGeneratedColumn } from 'typeorm';
import { UserDto } from '../../users/dto/user.dto';

export class WorkspaceDto {
  @IsNotEmpty()
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  name: string;

  users: UserDto[];

  rooms: RoomDto[];
}
