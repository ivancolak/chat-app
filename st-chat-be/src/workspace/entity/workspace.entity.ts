import { RoomEntity } from 'src/room/entity/room.entity';
import { UserEntity } from 'src/users/entity/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';

@Entity('workspace')
export class WorkspaceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ManyToMany(() => UserEntity, (user) => user.workspaces)
  users: UserEntity[];

  @OneToMany(() => RoomEntity, (room) => room.workspace)
  rooms: RoomEntity[];
}
