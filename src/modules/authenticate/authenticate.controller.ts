import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthenticateDTO } from './authenticate.dto';
import { AuthenticateService } from './authenticate.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './authenticate.guard';
import { AuthRefresh } from './authenticate-refresh.guard';

@ApiTags('authenticate')
@Controller('authenticate')
export class AuthenticateController {
  constructor(private readonly authenticateService: AuthenticateService) {}

  @Post()
  @HttpCode(200)
  async authenticate(@Body() data: AuthenticateDTO) {
    try {
      return this.authenticateService.authenticate(data);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new HttpException(error.messsage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  @HttpCode(200)
  @UseGuards(AuthRefresh)
  async refreshToken(@Body() data: AuthenticateDTO) {
    try {
      return this.authenticateService.authenticate(data);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new HttpException(error.messsage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
