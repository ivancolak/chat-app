import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailService } from 'src/shared/services/email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [],
  providers: [UsersService, EmailService],
  exports: [UsersService],
})
export class UsersModule {}
