import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDTO, UpdateUserDTO } from './user.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async create({ password, ...data }: CreateUserDTO) {
    const user = await this.userRepository.getByEmail(data.email);
    if (user) throw new BadRequestException('Email already exists');
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.userRepository.create({
      ...data,
      hashed_password: hashedPassword,
    });
  }

  async get(id: string) {
    const user = await this.userRepository.get(id);
    if (!user) throw new BadRequestException('User not found');

    return user;
  }

  async update(id: string, data: UpdateUserDTO) {
    const user = await this.userRepository.get(id);
    if (!user) throw new BadRequestException('User not found');

    return this.userRepository.update({ id, ...data });
  }

  async delete(id: string) {
    const user = await this.userRepository.get(id);
    if (!user) throw new BadRequestException('User not found');

    return this.userRepository.delete(id);
  }
}
