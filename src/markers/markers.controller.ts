import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { MarkersService } from './markers.service';
import { CreateMarkerDto } from './dto/create-marker.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { User } from '@prisma/client';

@Controller('markers')
export class MarkersController {
  constructor(private readonly markersService: MarkersService) {}

  @Post()
  @Roles('USER', 'REPRESENTANTE', 'ADMIN')
  @HttpCode(201)
  create(@Body() createMarkerDto: CreateMarkerDto, @CurrentUser() user: User) {
    return this.markersService.create(createMarkerDto, user);
  }

  @Get()
  findAll() {
    return this.markersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.markersService.findOne(id);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: number, @CurrentUser() user: User) {
    return await this.markersService.findByUser(userId ? userId : user.id);
  }

  @Roles('REPRESENTANTE','USER')
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.markersService.remove(id, user);
  }
}
