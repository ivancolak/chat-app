import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginStatus } from './interfaces/login-status.interface';
import { LoginUserDto } from '../users/dto/user-login.dto';
import { InviteStatus } from './interfaces/invite-status.interface';
import { UserDto } from 'src/users/dto/user.dto';
import { JwtPayload } from './interfaces/payload.interface';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './strategy/constant';
import { ResetPasswordUserDto } from 'src/users/dto/reset-password.dto';
import { ForgotPasswordDto } from 'src/users/dto/ForgotPassword.dto';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/shared/services/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService
  ) { }

  async invite(userDto: UserDto): Promise<InviteStatus> {
    try {
      await this.usersService.create(userDto);
    } catch (err) {
      return {
        success: false,
        message: err,
      };
    }
    return {
      success: true,
      message: 'user invited',
    };
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginStatus> {
    const user = await this.usersService.findByLogin(loginUserDto);
    const token = this.createToken(user);
    return {
      accessToken: token,
    };
  }

  async validateUser(payload: JwtPayload): Promise<UserDto> {
    const user = await this.usersService.findByUsername(payload.username);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  private createToken({ username, id }: UserDto): string {
    const expiresIn = '1h';
    const payload: JwtPayload = { username, id };
    const accessToken = this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
      expiresIn,
    });
    return accessToken;
  }

  async resetPassword(
    payload: JwtPayload,
    resetPasswordUserDto: ResetPasswordUserDto,
  ): Promise<UserDto> {
    const user = await this.usersService.setPassword(
      payload.username,
      resetPasswordUserDto.password,
    );
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
  
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<InviteStatus> {
    try {
      const user = await this.usersService.findByEmail(forgotPasswordDto.username);
      const randomPassword = Math.random().toString(36).substring(7);
      user.password = await bcrypt.hash(randomPassword, 10);
      this.usersService.updateUser(user);
      await this.emailService.sendResetPasswordEmail(
        user.email,
        user.username,
        randomPassword
      );
    } catch (err) {
      return {
        success: false,
        message: err,
      };
    }
    return {
      success: true,
      message: 'password changed',
    };
  }


}