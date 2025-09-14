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
  @Roles('USER')
  @Roles('ADMIN')
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

  @Get(':userId')
  findByUser(@Param('userId') userId: number) {
    return this.markersService.findByUser(userId);
  }

  @Roles('USER')
  @Roles('ADMIN')
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.markersService.remove(id, user);
  }
}
