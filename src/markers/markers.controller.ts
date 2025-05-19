import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MarkersService } from './markers.service';
import { CreateMarkerDto } from './dto/create-marker.dto';
import { UpdateMarkerDto } from './dto/update-marker.dto';
import { User } from 'generated/prisma';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorators';

@Controller('markers')
export class MarkersController {
  constructor(private readonly markersService: MarkersService) {}

  @Post()
  @Roles("USER")
  @Roles("ADMIN")
  create(@Body() createMarkerDto: CreateMarkerDto, @CurrentUser() user: User) {
    return this.markersService.create(createMarkerDto, user);
  }

  @Get()
  @Roles("USER")
  @Roles("ADMIN") 
  findAll() {
    return this.markersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.markersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMarkerDto: UpdateMarkerDto) {
    return this.markersService.update(+id, updateMarkerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.markersService.remove(+id);
  }
}
