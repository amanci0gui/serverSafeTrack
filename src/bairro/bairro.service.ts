import { Injectable } from '@nestjs/common';
import { GeoService } from 'src/geo/geo.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { GeoJsonPolygon } from './types/types';
import { Prisma } from '@prisma/client';

@Injectable()
export class BairroService {
    constructor(
        private readonly geoService: GeoService,
        private readonly prismaService: PrismaService,
    ) {}

    async getBairros() {
        return await this.prismaService.bairro.findMany({
            select: {
                id: true,
                name: true,
                cidade: true,
                adminId: true
            },
        });
    }

    async getBairroById(id: number) {
        return await this.prismaService.bairro.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                cidade: true,
                adminId: true
            },
        });
    }

    async getBairrosByCidade(cidade: string) {
        return await this.prismaService.bairro.findMany({
            where: { cidade },
            select: {
                id: true,
                name: true,
                cidade: true,
                adminId: true
            },

        });
    }

    async getBairroByNameAndCidade(name: string, cidade: string) {
        return await this.prismaService.bairro.findFirst({
            where: { name, cidade },
            select: {
                id: true,
                name: true,
                cidade: true,
                adminId: true
            },
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

    async getBairroCentroById(id: number) {
        const bairro = await this.prismaService.bairro.findUnique({
            where: { id },
            select: { polygon: true },
        });

        if (!bairro || !bairro.polygon) {
            throw new Error('Bairro não encontrado');
        }

        const polygonData = bairro.polygon as unknown as GeoJsonPolygon;
        
        if (!polygonData.type || !polygonData.coordinates) {
            throw new Error('Estrutura do polígono inválida');
        }

        // Verifica se é MultiPolygon ou Polygon
        let coordinates: { lat: number; lng: number; }[];
        
        if (polygonData.type === 'MultiPolygon') {
            // Para MultiPolygon, pega o primeiro polígono e seu primeiro anel
            coordinates = polygonData.coordinates[0][0].map(coord => ({
                lat: coord[1],
                lng: coord[0]
            }));
        } else {
            // Para Polygon, pega o primeiro anel (contorno externo)
            coordinates = polygonData.coordinates[0].map(coord => ({
                lat: coord[1],
                lng: coord[0]
            }));
        }

        return this.geoService.calculatePolygonCentroid(polygonData.type, coordinates);
    }

}
