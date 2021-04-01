import { G } from '@dra2020/baseclient';

export interface Landmark
{
  id: string,
  name: string,
  description: string,
  coord: [number, number],
}

export type Landmarks = { [id: string]: Landmark };

export function landmarksToCollection(landmarks: Landmarks): G.GeoFeatureCollection
{
  if (landmarks == null) return null;

  let col: G.GeoFeatureCollection = { type: 'FeatureCollection', features: [] };
  Object.values(landmarks).forEach(l => {
      let f: G.GeoFeature = {
          type: 'Feature',
          properties: {
              id: l.id,
              name: l.name,
              description: l.description,
            },
          geometry: {
              type: 'Point',
              coordinates: l.coord,
            },
        };
      col.features.push(f);
    });
  return col;
}
