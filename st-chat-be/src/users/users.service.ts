import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './entity/user.entity';
import { toUserDto } from 'src/shared/mapper';
import { LoginUserDto } from './dto/user-login.dto';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/shared/services/email/email.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly emailService: EmailService,
  ) { }

  async findOne(options?: any): Promise<UserDto> {
    const user = await this.userRepo.findOne(options);
    return toUserDto(user);
  }

  async create(userDto: UserDto): Promise<UserDto> {
    const randomPassword = Math.random().toString(36).substring(7);
    const { username, email, profileImage, workspaces } = userDto;
    const userInDb = await this.userRepo.findOne({ where: { username } });
    if (userInDb) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    } else
      await this.emailService.sendInvitationEmail(
        userDto.email,
        userDto.username,
        randomPassword,
      );
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    const user: UserEntity = await this.userRepo.create({
      username,
      password: hashedPassword,
      email,
      profileImage,
      workspaces,
    });
    await this.userRepo.save(user);
    return toUserDto(user);
  }

  async findByLogin({ username, password }: LoginUserDto): Promise<UserDto> {
    const user = await this.userRepo.findOne({ where: { username } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
    const areEqual = await bcrypt.compare(password, user.password);
    if (!areEqual) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return toUserDto(user);
  }

  async findByUsername(username: string): Promise<UserDto> {
    return await this.findOne({ where: { username } });
  }

  async updateProfileImg(id: number, userDto: UserDto) {
    const user = new UserEntity();
    user.profileImage = userDto.profileImage;
    await this.userRepo.update({ id }, user);
    return await this.userRepo.findOne({ id });
  }

  async findByEmail(username: string): Promise<UserDto> {
    const user = await this.userRepo.findOne({ where: { username: username } });
    return toUserDto(user);
  }

  async updateUser(userDto: UserDto) {
    await this.userRepo.save(userDto);
  }

  async setPassword(username: string, newPassword: string): Promise<UserDto> {
    const user = toUserDto(await this.userRepo.findOne({ username }));
    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepo.save(user);
    return toUserDto(user);
  }
}
