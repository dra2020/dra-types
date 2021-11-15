export interface Group
{
  id: string,
  name: string,
  description: string,
}

export const GROUP_OWNER = 1;
export const GROUP_VERIFIED = 2;
export const GROUP_SEEN = 4;
export const GROUP_REMOVED = 8;
export const GROUP_BLOCKED = 16;

export function hideGroup(flags: number): boolean
{
  return (flags & (GROUP_REMOVED|GROUP_BLOCKED)) != 0;
}

export interface GroupUser
{
  id: string,
  uid: string,
  flags: number,
}

export interface GroupMap
{
  id: string,           // group id
  sid: string,          // map (session) id
  permission: number,   // permissions (read or readwrite)
}

export type GroupUserIndex = { [groupid: string]: number }; // GroupUser flags
export type GroupMapIndex = { [groupid: string]: number };  // GroupMap permission
export type GroupIndex = { [groupid: string]: Group };
