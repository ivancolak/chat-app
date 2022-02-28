import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { toWorkspaceDto } from 'src/shared/mapper';
import { UserDto } from 'src/users/dto/user.dto';
import { UserEntity } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import { WorkspaceDto } from './dto/workspace.dto';
import { WorkspaceEntity } from './entity/workspace.entity';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(WorkspaceEntity)
    private workspaceRepository: Repository<WorkspaceEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) { }

  async getWorkspaces(user: UserDto): Promise<WorkspaceDto[]> {
    const currentUser = await this.userRepository.findOne({ where: { id: user.id },relations: ['workspaces'] });
    const workspaces = currentUser.workspaces || [];
    return workspaces.map((workspace) => toWorkspaceDto(workspace));
  }

  async getWorkspaceById(id: number): Promise<WorkspaceDto> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id },
    });
    return toWorkspaceDto(workspace);
  }

  async createWorkspace(
    { username }: UserDto,
    createWorkspace: WorkspaceEntity,
  ): Promise<WorkspaceDto> {
    const user = await this.userRepository.findOne({ where: { username },relations: ['workspaces'] });
    const workspace = new WorkspaceEntity();
    workspace.users = [user]
    workspace.name = createWorkspace.name;
    const newWorkspace = await this.workspaceRepository.create(workspace);
    await this.workspaceRepository.save(newWorkspace);
    return toWorkspaceDto(newWorkspace);
  }
}
