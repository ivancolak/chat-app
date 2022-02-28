import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  toMessageDto,
  toRoomDto,
  toUserRoomDto,
} from 'src/shared/mapper';
import { Repository } from 'typeorm';
import { MessageDto } from '../room/dto/message.dto';
import { MessageEntity } from './entity/message.entity';
import { RoomDto } from '../room/dto/room.dto';
import { RoomEntity } from './entity/room.entity';
import { UserDto } from 'src/users/dto/user.dto';
import { UserEntity } from 'src/users/entity/user.entity';
import { WorkspaceEntity } from 'src/workspace/entity/workspace.entity';
import { UserRoomDto } from './dto/userroom.dto';
import { UserRoomEntity } from './entity/userroom.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
    @InjectRepository(RoomEntity)
    private roomRepository: Repository<RoomEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(WorkspaceEntity)
    private workspaceRepository: Repository<WorkspaceEntity>,
    @InjectRepository(UserRoomEntity)
    private userRoomRepository: Repository<UserRoomEntity>,
    private readonly autService: AuthService,
  ) {}

  async addMessage(msgDto: MessageDto): Promise<MessageDto> {
    const { content, date, user, room, userId, roomId } = msgDto;
    const userDto = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['workspaces'],
    });
    const roomDto = await this.roomRepository.findOne({
      where: { id: roomId },
    });
    const msg: MessageEntity = await this.messageRepository.create({
      content,
      date,
      user: userDto,
      room: roomDto,
    });

    await this.messageRepository.save(msg);
    return toMessageDto(msg);
  }

  async getRooms(workspaceId: string): Promise<RoomDto[]> {
    const currentWs = await this.workspaceRepository.findOne({
      where: { id: workspaceId },
      relations: ['rooms'],
    });
    const rooms = currentWs.rooms || [];
    return rooms.map((r) => toRoomDto(r));
  }

  async createRoom(
    workspaceId: string,
    createRoom: RoomEntity,
  ): Promise<RoomDto> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId },
      relations: ['rooms', 'users'],
    });
    const room = new RoomEntity();
    room.name = createRoom.name;
    const newRoom = await this.roomRepository.create(room);
    if (workspace.rooms.length == 0) {
      workspace.rooms = [newRoom];
    } else {
      workspace.rooms.push(newRoom);
    }
    await this.roomRepository.save(newRoom);
    await this.workspaceRepository.save(workspace);
    const userList = workspace.users;
    for (let user of userList) {
      await this.inviteToRoom(user.id, newRoom.name);
    }

    return toRoomDto(newRoom);
  }

  async inviteToRoom(userId: number, roomName: string): Promise<UserRoomDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['workspaces'],
    });
    const room = await this.roomRepository.findOne({
      where: { name: roomName },
    });
    const newUserRoom: UserRoomEntity = await this.userRoomRepository.create({
      room: room,
      user,
      notificationCount: 0,
    });
    await this.userRoomRepository.save(newUserRoom);
    return toUserRoomDto(newUserRoom);
  }

  async getMessages(roomid: number) {
    const roomDto = await this.roomRepository.findOne({
      where: { id: roomid },
      relations: ['messages'],
    });
    return roomDto.messages.map((r) => toMessageDto(r));
  }

  async getRoomById(roomId: number) {
    const roomDto = await this.roomRepository.findOne({
      where: { id: roomId },
    });
    return toRoomDto(roomDto);
  }

  async notificationUsers(message: MessageDto) {
    const userRooms = await this.userRoomRepository.find({
      where: { roomId: message.roomId },
      relations: ['room', 'user'],
    });
    for (let userRoom of userRooms) {
      if (message.userId != userRoom.userId) {
        userRoom.notificationCount++;
        this.userRoomRepository.save(userRoom);
      }
    }
  }

  async deleteNotifications(userId: number, roomId: number) {
    const userRoom = await this.userRoomRepository.findOne({
      where: { userId: userId } && { roomId: roomId },
    });
    userRoom.notificationCount = 0;
    await this.userRoomRepository.save(userRoom);
  }

  async inviteToWorkspace(userDto: UserDto) {
    const user = await this.userRepository.findOne({
      where: { username: userDto.username },
    });
    if (!user) {
      await this.autService.invite(userDto);
    }
    const userEntity = await this.userRepository.findOne({
      where: { username: userDto.username },
      relations: ['workspaces'],
    });
    const workspace = await this.workspaceRepository.findOne({
      where: { id: userDto.workspaceId },
      relations: ['rooms'],
    });
    if (userEntity.workspaces.length == 0) {
      userEntity.workspaces = [workspace];
    } else {
      userEntity.workspaces.push(workspace);
    }
    for (let room of workspace.rooms) {
      await this.inviteToRoom(userEntity.id, room.name);
    }
    await this.userRepository.save(userEntity);
  }
}
