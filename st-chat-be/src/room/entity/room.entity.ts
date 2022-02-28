import { WorkspaceEntity } from 'src/workspace/entity/workspace.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { MessageEntity } from './message.entity';
import { UserRoomEntity } from './userroom.entity';

@Entity('room')
export class RoomEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  name: string;

  @ManyToOne(
    () => WorkspaceEntity,
    (workspaceEntity) => workspaceEntity.rooms,
    { eager: true },
  )
  @JoinTable()
  workspace: WorkspaceEntity;

  @OneToMany(() => UserRoomEntity, (userroom) => userroom.room)
  userRooms?: UserRoomEntity[];

  @OneToMany(() => MessageEntity, (message) => message.room)
  messages?: MessageEntity[];
}
