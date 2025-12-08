import { PrismaClient } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';
import * as turf from '@turf/turf';
import { Polygon } from 'geojson';

const prisma = new PrismaClient();

export class GeoService {

  private readonly BUFFER_DISTANCE_METERS = 100;

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

    const bufferedPolygon = turf.buffer(polygon, this.BUFFER_DISTANCE_METERS, {
      units: 'meters',
    })

    if (!bufferedPolygon) {
      console.warn('Erro ao criar buffer do polígono');
      // Fallback: verifica sem buffer
      return turf.booleanPointInPolygon(point, polygon);
    }

    // Verifica se o ponto está dentro
    const inside = turf.booleanPointInPolygon(point, bufferedPolygon);

    return inside;
  }

  async calculatePolygonCentroid(type: string, polygon: { lat: number; lng: number }[]) {
    let geoJson: any;

    if (type === 'Polygon') {
      // Cria um GeoJSON do tipo Polygon
      geoJson = turf.polygon([
        polygon.map((point) => [point.lng, point.lat]), // Turf usa [lng, lat]
      ]);
    } else if (type === 'MultiPolygon') {
      // Cria um GeoJSON do tipo MultiPolygon
      geoJson = turf.multiPolygon([
        [
          polygon.map((point) => [point.lng, point.lat]), // Turf usa [lng, lat]
        ],
      ]);
    } else {
      throw new Error('Tipo de polígono inválido');
    }

    // Calcula o centroide do Polygon ou MultiPolygon
    const centroid = turf.centroid(geoJson);

    return {
      lat: centroid.geometry.coordinates[1],
      lng: centroid.geometry.coordinates[0],
    };
  }
}
