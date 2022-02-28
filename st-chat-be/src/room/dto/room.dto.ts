import { IsNotEmpty } from 'class-validator';
import { WorkspaceDto } from 'src/workspace/dto/workspace.dto';

export class RoomDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  name: string;

  workspace: WorkspaceDto;

  workspaceId?: string;

}