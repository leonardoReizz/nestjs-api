import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class GetUserDTO {
  @IsString()
  id: string;
}

export class DeleteUserDTO {
  @IsString()
  id: string;
}

export class CreateUserDTO {
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  first_name: string;

  @IsString()
  @ApiProperty()
  last_name: string;

  @IsString()
  @ApiProperty()
  password: string;
}

export class UpdateUserDTO {
  @IsString()
  @IsEmail()
  @IsOptional()
  @ApiProperty()
  email?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  first_name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  last_name?: string;
}
