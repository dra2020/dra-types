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
  official?: boolean
}

export type UserLayerRef = {
  id: string,
  fill: boolean,
  stroke: boolean,
  label: boolean
  strokeColor: string,
  strokeOpacity: number,
  fillColor: string,
  fillOpacity: number,
}

export type UserLayerRefIndex = {
  [id: string]: UserLayerRef
}
