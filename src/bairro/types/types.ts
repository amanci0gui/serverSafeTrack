export type Coordinates = number[][][]; // Para Polygon: [[[lng, lat], [lng, lat], ...]]

export interface GeoJsonPolygon {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: Coordinates;
}