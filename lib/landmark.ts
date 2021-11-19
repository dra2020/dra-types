import { Util, G } from '@dra2020/baseclient';

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

export function collectionToLandmarks(col: G.GeoFeatureCollection): Landmarks
{
  let landmarks: Landmarks = {};
  if (col && col.features) col.features.forEach((f: G.GeoFeature) => {
      if (f.geometry.type === 'Point')
      {
        let c: any = f.geometry.coordinates;
        if (Array.isArray(c) && typeof c[0] === 'number' && typeof c[1] === 'number')
        {
          let landmark: Landmark = {
            id: Util.createGuid(),
            name: G.flexName(f),
            description: f.properties.description || '',
            coord: [c[0], c[1]],
            };
          landmarks[landmark.id] = landmark;
        }
      }
    });
  return landmarks;
}
