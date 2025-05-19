import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMarkerDto } from './dto/create-marker.dto';
import { UpdateMarkerDto } from './dto/update-marker.dto';
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

  async findAll() {
    const markers = await this.prisma.marker.findMany(); // Fetch all markers from the database

    return markers;
  }

  async findOne(id: string) {

    const marker = await this.prisma.marker.findUnique({ // Fetch a single marker by its ID
      where: {
        id: id
      }
    })

    if (!marker) {
      throw new NotFoundException(`Marcador com id ${id} não encontrado`); // Throw an exception if the marker is not found
    } 

    return marker;
  }

  update(id: number, updateMarkerDto: UpdateMarkerDto) {
    return `This action updates a #${id} marker`;
  }

  remove(id: number) {
    return `This action removes a #${id} marker`;
  }
}
