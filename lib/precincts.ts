export interface Precincts
{
  id?: string,
  state?: string,
  datasource?: string,
  name?: string,
  description?: string,
  labels?: string[],
  createdBy?: string,
  createTime?: string,
  modifyTime?: string,
  deleted?: boolean,
  published?: string,
  official?: boolean,
  supersets?: string[],
  subsets?: string[],
  conflicts?: string[],
}

export type PrecinctsIndex = { [id: string]: Precincts };
