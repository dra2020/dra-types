export interface Landmark
{
  id: string,
  name: string,
  description: string,
  coord: [number, number],
}

export type Landmarks = { [id: string]: Landmark };
