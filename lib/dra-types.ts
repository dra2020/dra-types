// Public libraries
import * as Hash from 'object-hash';

// Type for single comment
export interface Comment
{
  userid: string;
  text: string;
  date: string;
  recommend: number;
}

// Comment record associated with a map
export interface CommentList
{
  id?: string;
  [commentid: string]: Comment | string;  // Really just Comment but make TypeScript happy
}

// Supported like kinds
export type LikeKind = 'like' | 'love' | 'wow' | 'angry' | 'funny';

// Like record for an individual like
export interface Like
{
  date: string;
  kind: LikeKind;
}

// Record for likes associated with a map
export interface LikeList
{
  id?: string;
  [userid: string]: Like | string;  // Really just Like but make TypeScript happy
}

// Record for likes an individual user has performed
export interface UserLikes
{
  id?: string;
  [aid: string]: Like | string;     // Really just Like but make TypeScript happy
}

export interface SplitBlock
{
  id?: string;
  chunk?: string;
  state: string;
  datasource: string;
  geoid: string;
  blocks: string[];
}

export type DistrictToSplitBlock = { [districtID: string]: SplitBlock[] };

// Canonical hashing of splitblock data
function hash(o: any): string
{
  return Hash(o,
    { respectType: false,
      unorderedArrays: true,
      unorderedObjects: true,
      excludeKeys: (k: string) => (k === 'id' || k === 'chunk')
    });
}

export function vgeoidToGeoid(vgeoid: string): string
{
  let re = /vfeature_([^_]*)_.*/;
  let a = re.exec(vgeoid);
  if (a == null || a.length != 2)
    return '';
  else
    return a[1];
}

export function vgeoidToChunk(vgeoid: string): string
{
  // vgeoid is string of form: "vfeature_[geoid]_[chunkid]_[hash]"
  // the contents are chunked into a file of form "vfeature_chunk_[chunkid]"
  // So extract the chunk ID and download that.
  let re = /vfeature_([^_]*)_([^_*])_(.*)/;
  let a = re.exec(vgeoid);
  if (a && a.length == 4)
    vgeoid = `vfeature_chunk_${a[2]}`;
  else
    vgeoid = null;

  return vgeoid;
}

export function isVfeature(geoid: string): boolean
{
  return geoid.indexOf('vfeature') === 0;
}

export function splitToCacheKey(s: SplitBlock): string
{
  if (s.id === undefined)
    s.id = hash(s);
  if (s.chunk === undefined)
    s.chunk = "0";

  return `_${s.state}_${s.datasource}_vfeature_${s.geoid}_${s.chunk}_${s.id}.geojson`;
}

export function splitToChunkKey(s: SplitBlock): string
{
  if (s.chunk === undefined)
    s.chunk = "0";

  return `_${s.state}_${s.datasource}_vfeature_chunk_${s.chunk}.geojson`;
}

export function splitToPrefix(s: SplitBlock): string
{
  if (s.blocks === undefined)
  {
    let re = /_([^_]*)_(.*)_vfeature.*\.geojson$/;
    let a = re.exec(s.id);
    if (a && a.length == 3)
      return `_${a[1]}_${a[2]}`;
    return s.id;
  }
  return `_${s.state}_${s.datasource}`;
}

export function cacheKeysToChunkHash(keys: string[]): string
{
  return hash(keys);
}

let reNumeric = /^(\D*)(\d*)(\D*)$/;
let reDistrictNumber = /^\d+$/;
let reDistrictNumeric = /^\d/;
let reLeadingZero = /^0+(.*)/;

// Normalize any numeric part to have no padded leading zeros
export function canonicalDistrictID(districtID: string): string
{
  let a = reNumeric.exec(districtID);
  if (a && a.length == 4)
  {
    if (a[2].length > 0)
      a[2] = String(Number(a[2]));
    districtID = `${a[1]}${a[2]}${a[3]}`;
  }
  return districtID;
}

// Normalize any numeric part to have four digits with padded leading zeros
export function canonicalSortingDistrictID(districtID: string): string
{
  let a = reNumeric.exec(districtID);
  if (a && a.length == 4)
  {
    let s = a[2];
    if (s.length > 0)
    {
      switch (s.length)
      {
        case 1: s = `000${s}`;  break;
        case 2: s = `00${s}`;  break;
        case 3: s = `0${s}`;  break;
      }
      a[2] = s;
    }
    districtID = `${a[1]}${a[2]}${a[3]}`;
  }
  return districtID;
}

// Return numeric part of districtID (or -1 if there is none)
export function canonicalNumericFromDistrictID(districtID: string): number
{
  let a = reNumeric.exec(districtID);
  if (a && a.length == 4)
  {
    let s = a[2];
    if (s.length > 0)
      return Number(s);
  }
  return -1;
}

export function canonicalDistrictIDFromNumber(districtID: string, n: number): string
{
  let a = reNumeric.exec(districtID);
  if (a && a.length == 4)
  {
    a[2] = String(n);
    districtID = `${a[1]}${a[2]}${a[3]}`;
  }
  else
    districtID = String(n);
  return districtID;
}

// Numbers start at 1
export type DistrictOrder = { [districtID: string]: number };

export function canonicalDistrictIDOrdering(order: DistrictOrder): DistrictOrder
{
  let keys = Object.keys(order);
  let i: number;
  let a: any = [];
  let template: string = undefined;

  for (i = 0; i < keys.length; i++)
  {
    let s = keys[i];
    keys[i] = canonicalSortingDistrictID(s);
    let n = canonicalNumericFromDistrictID(s);
    if (n > 0)
    {
      if (template === undefined)
        template = s;
      a[n] = true;
    }
  }
  if (template !== undefined)
  {
    for (i = 1; i < a.length; i++)
      if (a[i] === undefined)
        keys.push(canonicalDistrictIDFromNumber(template, i));
  }
  keys.sort();
  order = {};
  for (i = 0; i < keys.length; i++)
    order[canonicalDistrictID(keys[i])] = i+1;
  if (order['ZZZ'])
    delete order['ZZZ'];
  return order;
}
