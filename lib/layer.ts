export interface UserLayer
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
