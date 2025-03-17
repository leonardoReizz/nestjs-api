import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../infra/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {}

  async create(data: Prisma.UserUncheckedCreateInput) {
    return this.prismaService.user.create({
      data,
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        created_at: true,
        updated_at: true,
        verified_at: true,
      },
    });
  }

  async update({
    id,
    ...data
  }: Prisma.UserUncheckedUpdateInput & { id: string }) {
    return this.prismaService.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        created_at: true,
        updated_at: true,
        verified_at: true,
      },
    });
  }

  async get(id: string) {
    return this.prismaService.user.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        created_at: true,
        updated_at: true,
        verified_at: true,
      },
    });
  }

  async getWithPassword(id: string) {
    return this.prismaService.user.findFirst({
      where: {
        id,
      },
    });
  }

  async getByEmailWithPassword(email: string) {
    return this.prismaService.user.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        created_at: true,
        updated_at: true,
        verified_at: true,
        hashed_password: true,
      },
    });
  }

  async getByEmail(email: string) {
    return this.prismaService.user.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        created_at: true,
        updated_at: true,
        verified_at: true,
        hashed_password: true,
      },
    });
  }

  async delete(id: string) {
    return this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }
}
