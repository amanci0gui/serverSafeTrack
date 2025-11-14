import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateMarkerDto } from './dto/create-marker.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { GeoService } from 'src/geo/geo.service';

@Injectable()
export class MarkersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly geoService: GeoService,
  ) {}

  async create(createMarkerDto: CreateMarkerDto, user: User) {
    if (user.bairroId !== createMarkerDto.bairroId) throw new ForbiddenException();

    const canCreateMarker = await this.geoService.isInsideBairro(
      createMarkerDto.longitude,
      createMarkerDto.latitude,
      createMarkerDto.bairroId,
    );

    if (!canCreateMarker) {
      throw new ForbiddenException(
        `Você não pode criar um marcador fora da região ABC!`,
      );
    }

    const existingMarker = await this.prisma.marker.findFirst({
      where: {
        latitude: createMarkerDto.latitude,
        longitude: createMarkerDto.longitude,
        title: createMarkerDto.title,
        category: createMarkerDto.category,
      },
    });

    if (existingMarker) {
      throw new ForbiddenException(
        `Uma ocorrência com as mesmas descrições já foi criada!`,
      );
    }

    const userId = user.id;

    const data = {
      ...createMarkerDto,
      userId: userId,
    };

    const createdMarker = await this.prisma.marker.create({ data });

    return createdMarker;
  }

  async findAll() {
    const today = new Date(); //pega data atual

    const threeMonths = new Date();
    threeMonths.setMonth(threeMonths.getMonth() - 3); //pega data de três meses atrás

    const markers = await this.prisma.marker.findMany({
      where: {
        active: true,
        createdAt: {
          //filtra as ocorrências para pegar até os últimos três meses
          gte: threeMonths,
          lte: today,
        },
      },
    }); // Fetch all markers from the database

    return markers;
  }

  async findOne(id: string) {
    const marker = await this.prisma.marker.findUnique({
      // Fetch a single marker by its ID
      where: {
        id: id,
      },
    });

    if (!marker) {
      throw new NotFoundException(`Marcador com id ${id} não encontrado`); // Throw an exception if the marker is not found
    }

    return marker;
  }

  async remove(id: string, user: User) {
    const marker = await this.findOne(id);

    if (!marker || marker.active === false) {
      throw new NotFoundException(
        `Marcador com id ${id} já foi removido ou não existe`,
      ); //lança uma exceção se o marcador foi removido ou não existe
    }

    if (marker.userId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException(
        `Você não tem permissão para remover este marcador, pois não foi você quem o criou`,
      ); //lança uma exception se não for o dono quem está excluindo
    }

    return this.prisma.marker.update({
      where: { id },
      data: { active: false }, //faz soft delete no marcador
    });
  }

  async findByUser(userId: number) {
    return await this.prisma.marker.findMany({
      where: {
        userId: userId,
        active: true,
      },
    });
  }
}
