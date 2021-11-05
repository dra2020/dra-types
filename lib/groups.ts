export interface Group
{
  id: string,
  name: string,
  description: string,
}

const GROUP_OWNER = 1;
const GROUP_VERIFIED = 2;
const GROUP_SEEN = 4;
const GROUP_REMOVED = 8;

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
