import {
  Controller,
  Body,
  Post,
  HttpException,
  HttpStatus,
  Get,
  Req,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginStatus } from './interfaces/login-status.interface';
import { LoginUserDto } from '../users/dto/user-login.dto';
import { JwtPayload } from './interfaces/payload.interface';
import { AuthGuard } from '@nestjs/passport';
import { InviteStatus } from './interfaces/invite-status.interface';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserDto } from 'src/users/dto/user.dto';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';
import { UploadedFile } from '@nestjs/common/decorators/http/route-params.decorator';
import { UsersService } from 'src/users/users.service';
import { ResetPasswordUserDto } from 'src/users/dto/reset-password.dto';
import { ForgotPasswordDto } from 'src/users/dto/ForgotPassword.dto';


export const storage = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      cb(null, `${file.originalname}`)
    }
  })

}

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService, private userService: UsersService) { }

  @Post('invite')
  public async invite(
    @Body() createUserDto: UserDto,
  ): Promise<InviteStatus> {
    const result: InviteStatus = await this.authService.invite(createUserDto);

    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result;
  }

  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto): Promise<LoginStatus> {
    return await this.authService.login(loginUserDto);
  }

  @Get('user')
  @UseGuards(AuthGuard())
  public async testAuth(@Req() req: any): Promise<JwtPayload> {
    return req.user;
  }

  @Post('upload')
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('file', storage))
  async uploadFile(@UploadedFile() file, @Request() req) {
    const user: UserDto = req.user;
    user.profileImage = file.filename;
    return await this.userService.updateProfileImg(user.id, user);
  }

  @Post('reset-password')
  @UseGuards(AuthGuard())
  async setNewPassord(
    @Body()
    resetPasswordUserDto: ResetPasswordUserDto,
    @Request() req) {
    const result = await this.authService.resetPassword(req.user, resetPasswordUserDto);
    return result;
  }

  @Post('forgotPassword')
  public async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto
  ): Promise<InviteStatus> {
    const result: InviteStatus = await this.authService.forgotPassword(forgotPasswordDto);
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
    return result;
  }
}

