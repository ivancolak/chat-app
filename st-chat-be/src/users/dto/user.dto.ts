import { IsNotEmpty, IsEmail } from 'class-validator';
import { WorkspaceDto } from 'src/workspace/dto/workspace.dto';
import { WorkspaceEntity } from 'src/workspace/entity/workspace.entity';

export class UserDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  profileImage: string;

  createdOn?: Date;

  workspaces: WorkspaceDto[];

  workspaceId?: string;
}
