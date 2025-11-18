import { Injectable } from '@nestjs/common';
import { GeoService } from 'src/geo/geo.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BairroService {
    constructor(
        private readonly geoService: GeoService,
        private readonly prismaService: PrismaService,
    ) {}

    async getBairros() {
        return await this.prismaService.bairro.findMany();
    }

    async getBairroById(id: number) {
        return await this.prismaService.bairro.findUnique({
            where: { id },
        });
    }

    async getBairroPolygon(id: number) {
        const polygon = await this.prismaService.bairro.findUnique({
            where: { id },
            select: { polygon: true },
        });

        if (!polygon) {
            throw new Error('Bairro não encontrado');
        }

        return polygon;
    }

    async getBairroCentro(type: string, polygon: { lat: number; lng: number }[]) {
        return this.geoService.calculatePolygonCentroid(type,polygon);
    }

}
