import { Injectable } from '@nestjs/common';
import { CreateMarkerDto } from './dto/create-marker.dto';
import { UpdateMarkerDto } from './dto/update-marker.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MarkersService {

  constructor(private readonly prisma: PrismaService){}

  async create(createMarkerDto: CreateMarkerDto, user: User) {
    const userId = user.id

    const data = {
      ...createMarkerDto,
      userId: userId
    }

    const createdMarker = await this.prisma.marker.create({ data });


    return createdMarker;
  }

  findAll() {
    return `This action returns all markers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} marker`;
  }

  update(id: number, updateMarkerDto: UpdateMarkerDto) {
    return `This action updates a #${id} marker`;
  }

  remove(id: number) {
    return `This action removes a #${id} marker`;
  }
}
