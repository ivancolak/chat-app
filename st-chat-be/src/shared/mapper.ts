import { UserEntity } from '../users/entity/user.entity';
import { UserDto } from '../users/dto/user.dto';
import { MessageEntity } from 'src/room/entity/message.entity';
import { MessageDto } from 'src/room/dto/message.dto';
import { WorkspaceEntity } from 'src/workspace/entity/workspace.entity';
import { WorkspaceDto } from '../workspace/dto/workspace.dto';
import { RoomEntity } from 'src/room/entity/room.entity';
import { RoomDto } from 'src/room/dto/room.dto';
import { UserRoomDto } from 'src/room/dto/userroom.dto';
import { UserRoomEntity } from 'src/room/entity/userroom.entity';

export const toUserDto = (data: UserEntity): UserDto => {
  const { id, username, email, password, profileImage, workspaces } = data;
  let workspacesDto = [];
  if (workspaces) {
    workspacesDto = workspaces.map((ws) => toWorkspaceDto(ws));
  }
  const userDto: UserDto = {
    id,
    username,
    email,
    password, 
    profileImage,
    workspaces: workspacesDto,
  };

  return userDto;
};

export const toWorkspaceDto = (data: WorkspaceEntity): WorkspaceDto => {
  const { id, name, users, rooms } = data;
  let usersDto = [];
  if (users) {
    usersDto = users.map((u) => toUserDto(u));
  }
  let roomsDto = [];
  if (rooms) {
    roomsDto = rooms.map((room) => toRoomDto(room));
  }
  const WorkspaceDto: WorkspaceDto = {
    id,
    name,
    users: usersDto,
    rooms: roomsDto,
  };

  return WorkspaceDto;
};

export const toMessageDto = (data: MessageEntity): MessageDto => {
  const { id, content, date, room, user } = data;
  const roomDto = room as RoomDto;
  const userDto = user as UserDto;

  let msgDto: MessageDto = {
    id,
    content,
    date,
    room: roomDto,
    user: userDto,
    userId: userDto.id.toString(),
    roomId: roomDto.id

  };

  return msgDto;
};

export const toRoomDto = (data: RoomEntity): RoomDto => {
  const { id, name, workspace } = data;
  const workspaceDto = workspace as WorkspaceDto;

  let roomDto: RoomDto = {
    id,
    name,
    workspace: workspaceDto,
  };

  return roomDto;
};

export const toUserRoomDto = (data: UserRoomEntity): UserRoomDto => {
  const { id, user, room, notificationCount } = data;

  const roomDto = room as RoomDto;
  const userDto = user as UserDto;

  let userRoomDto: UserRoomDto = {
    id,
    room: roomDto,
    user: userDto,
    notificationCount,
  };

  return userRoomDto;
};
