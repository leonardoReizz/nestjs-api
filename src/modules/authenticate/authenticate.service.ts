import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { AuthenticateDTO } from './authenticate.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthenticateService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async authenticate(data: AuthenticateDTO) {
    const user = await this.userRepository.getByEmailWithPassword(data.email);

    if (!user) throw new BadRequestException('Invalid email or password 1');

    const isValidPassword = await compare(data.password, user.hashed_password);

    if (!isValidPassword)
      throw new BadRequestException('Invalid email or password 2');

    const accessToken = this.generateToken(user).access_token;
    const refreshToken = this.generateRefreshToken(user).access_token;

    return { access_token: accessToken, refreshToken: refreshToken };
  }

  generateToken(user: Pick<User, 'id' | 'email'>) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '6h',
      }),
    };
  }

  generateRefreshToken(user: Pick<User, 'id' | 'email'>) {
    const payload = { sub: user.id, email: user.email, refreshToken: true };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '3d',
      }),
    };
  }
}
