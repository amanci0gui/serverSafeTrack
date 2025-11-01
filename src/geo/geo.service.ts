import { PrismaClient } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';
import * as turf from '@turf/turf';
import { Polygon } from 'geojson';

const prisma = new PrismaClient();

export class GeoService {
  // Verifica se um ponto está dentro do bairro informado usando Turf.js
  async isInsideBairro(
    longitude: number,
    latitude: number,
    bairroId: number
  ): Promise<boolean> {
    // Busca o registro específico no banco
    const regiao = await prisma.bairro.findFirst({
      where: { id: bairroId },
      select: { polygon: true },
    });

    if (!regiao) {
      console.warn('Bairro não encontrado no banco.');
      return false;
    }

    // Aqui assumimos que o polygon já é um objeto JSON válido
    const geojson = regiao.polygon as any;

    // Cria o ponto para verificação
    const point = turf.point([longitude, latitude]);

    const geometry = geojson.type === 'Feature' ? geojson.geometry : geojson;

    let polygon;
    if (geometry.type === 'Polygon') {
      polygon = turf.polygon(geometry.coordinates);
    } else if (geometry.type === 'MultiPolygon') {
      polygon = turf.multiPolygon(geometry.coordinates);
    } else {
      console.warn('GeoJSON inválido');
      return false;
    }

    // Verifica se o ponto está dentro
    const inside = turf.booleanPointInPolygon(point, polygon);

    return inside;
  }
}
