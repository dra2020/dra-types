export interface Cities
{
  id?: string,
  state?: string,
  datasource?: string,
  geoids?: string[],
  name?: string,
  description?: string,
  labels?: string[],
  createdBy?: string,
  createTime?: string,
  modifyTime?: string,
  publishTime?: string,
  deleted?: boolean,
  published?: string,
  official?: boolean,
  supersets?: string[],
  subsets?: string[],
  conflicts?: string[],
}

export type CitiesIndex = { [id: string]: Cities };
