import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WorkspaceDto } from './dto/workspace.dto';
import { WorkspaceService } from './workspace.service';
import { UserDto } from '../users/dto/user.dto';

@Controller('workspaces')
export class WorkspaceController {
  constructor(private workspaceService: WorkspaceService) {}

  @Get()
  @UseGuards(AuthGuard())
  async getWorkspaces(@Req() req: any): Promise<WorkspaceDto[]> {
    const reqUser = req.user as UserDto;
    return await this.workspaceService.getWorkspaces(reqUser);
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  async getWorkspaceById(@Param('id') id: number): Promise<WorkspaceDto> {
    return await this.workspaceService.getWorkspaceById(id);
  }

  @Post()
  @UseGuards(AuthGuard())
  async create(
    @Body() createWorkspaceDto: WorkspaceDto,
    @Req() req: any,
  ): Promise<WorkspaceDto> {
    const user = req.user as UserDto;
    return await this.workspaceService.createWorkspace(
      user,
      createWorkspaceDto
    );
  }
}
