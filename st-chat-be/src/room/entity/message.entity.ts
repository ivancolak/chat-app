import { UserEntity } from 'src/users/entity/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { RoomEntity } from './room.entity';

@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  content: string;

  @Column({
    type: 'datetime',
    nullable: false,
  })
  date: Date;

  @ManyToOne(() => RoomEntity, (roomEntity) => roomEntity.messages, {
    eager: true,
  })
  @JoinTable()
  room: RoomEntity;

  @ManyToOne(() => UserEntity, (UserEntity) => UserEntity.messages, {
    eager: true,
  })
  @JoinTable()
  user: UserEntity;
}
