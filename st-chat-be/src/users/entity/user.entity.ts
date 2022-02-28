import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

import * as bcrypt from 'bcrypt';
import { WorkspaceEntity } from 'src/workspace/entity/workspace.entity';
import { UserRoomEntity } from 'src/room/entity/userroom.entity';
import { MessageEntity } from 'src/room/entity/message.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  username: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  email: string;

  @Column({
    nullable: true,
  })
  profileImage: string;

  @ManyToMany(
    () => WorkspaceEntity,
    (workspaceEntity) => workspaceEntity.users,
    { eager: true },
  )
  @JoinTable()
  workspaces: WorkspaceEntity[];

  @OneToMany(() => UserRoomEntity, (userroom) => userroom.user)
  userRooms?: UserRoomEntity[];

  @BeforeInsert()
  async hashPassword?() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @OneToMany(() => MessageEntity, (message) => message.user)
  messages?: MessageEntity[];

  @Column({
    nullable: true,
  })
  workspaceName?: string;
}
