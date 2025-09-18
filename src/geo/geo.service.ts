import * as turf from '@turf/turf';
import { FeatureCollection, Polygon, MultiPolygon} from 'geojson';
import * as fs from 'fs';

export class GeoService {
    private polygons: number[][][][]; //lista de coordenadas dos poligonos

    constructor() {
        const geojson: FeatureCollection<Polygon | MultiPolygon> = JSON.parse(
            fs.readFileSync('src/geo/regiaoABC.geojson', 'utf8'),
        )

        this.polygons = geojson.features.map((feature) => {
            if (feature.geometry.type === 'Polygon') {
                return [feature.geometry.coordinates[0]];
            }

            if (feature.geometry.type === 'MultiPolygon') {
                return feature.geometry.coordinates.map((poly) => poly[0]);
            }

            return [];

        })
    }

    isInside(longitude: number, latitude: number): boolean {
        return this.polygons.some((polygon) =>
            polygon.some((ring) =>
                pointInPolygon([longitude, latitude], ring as [number, number][])
            )
        );
    }

}


//algoritmo que verifica se o ponto está dentro do polígono
function pointInPolygon(point: [number, number], vs: [number, number][]): boolean {
  const [x, y] = point;
  let inside = false;

  //para cada vértice do polígono
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {

    //coordenadas do vértice atual
    const xi = vs[i][0], yi = vs[i][1];

    //coordenadas do vértice anterior
    const xj = vs[j][0], yj = vs[j][1];

    //verifica se o ponto está dentro do polígono
    const intersect =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }
  return inside;
}
