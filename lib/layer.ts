import * as G from './groups';

export interface UserLayerMeta
{
  createdBy: string,
  id: string,
  name?: string,
  description?: string,
  state?: string,
  createTime?: string,
  modifyTime?: string,
  deleted?: boolean,
  published?: string,
  official?: boolean,
  groups?: G.GroupMapIndex,
  labels?: string[],
  labelupdate?: { [name: string]: boolean|null }, // just for update purposes, not stored
}

export type UserLayerMetaIndex = {
  [id: string]: UserLayerMeta
}

export type LayerType = 'layer' | 'map' | 'restriction' | 'precincts';

export interface UserLayerRef
{
  id: string,
  name?: string,
  layerType?: LayerType,
  geojsonName?: string,
  blockmapName?: string,
  cacheState?: string,
  cacheDatasource?: string,
  cachePlanType?: string,
  fill: boolean,
  stroke: boolean,
  label: boolean,
  landmark: boolean,
  strokeColor: string,
  strokeOpacity: number,
  fillColor: string,
  fillOpacity: number,
  lineWidth?: number,
}

export type UserLayerRefIndex = {
  [id: string]: UserLayerRef
}
