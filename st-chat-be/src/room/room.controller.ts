import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoomService } from '../room/room.service';
import { RoomDto } from '../room/dto/room.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { WorkspaceDto } from 'src/workspace/dto/workspace.dto';
import { RoomEntity } from './entity/room.entity';
import { UserRoomDto } from './dto/userroom.dto';

@Controller('rooms')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Get()
  @UseGuards(AuthGuard())
  async getRooms(@Query() query): Promise<RoomDto[]> {
    return await this.roomService.getRooms(query.workspaceId);
  }

  @Post()
  @UseGuards(AuthGuard())
  async create(
    @Body() createRoomDto: RoomDto
  ): Promise<RoomDto> {
    return await this.roomService.createRoom(
      createRoomDto.workspaceId,
      createRoomDto as RoomEntity,
    );
  }

  @Post('inviteToRoom')
  @UseGuards(AuthGuard())
  async inviteToRoom(
    @Body() createUserRoomDto: UserRoomDto,
  ): Promise<UserRoomDto> {
    const userId = createUserRoomDto.userId;
    const roomName = createUserRoomDto.roomName;
    return await this.roomService.inviteToRoom(userId, roomName);
  }

  @Post('inviteToWorkspace')
  @UseGuards(AuthGuard())
  async inviteToWorkspace(
    @Body() inviteUser: UserDto
  ) {
    return await this.roomService.inviteToWorkspace(inviteUser);
  }
}
