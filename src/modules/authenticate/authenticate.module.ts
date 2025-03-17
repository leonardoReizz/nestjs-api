import { Module } from '@nestjs/common';
import { AuthenticateController } from './authenticate.controller';
import { UserRepository } from '../user/user.repository';
import { AuthenticateService } from './authenticate.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AuthenticateController],
  providers: [UserRepository, AuthenticateService, JwtService],
})
export class AuthenticateModule {}
