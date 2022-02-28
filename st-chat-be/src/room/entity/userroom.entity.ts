import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';

import { RoomEntity } from './room.entity';
import { UserEntity } from 'src/users/entity/user.entity';

@Entity('userroom')
export class UserRoomEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => RoomEntity, (roomEntity) => roomEntity.userRooms, {
    eager: true,
  })
  @JoinTable()
  room: RoomEntity;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.userRooms, {
    eager: true,
  })
  @JoinTable()
  user: UserEntity;

  @Column()
  notificationCount: number;

  @Column()
  roomId?: string;
  @Column()
  userId?: string;
}
