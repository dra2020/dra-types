// Public libraries
import * as Hash from 'object-hash';
import * as Util from '@dra2020/util';

// Used internally to index into District Properties Array
export type BlockMap = { [id: string]: number };

// Used more generically and allows string districtIDs
export type BlockMapping = { [id: string]: string };

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

export function vgeoidToHash(vgeoid: string): string
{
  // vgeoid is string of form: "vfeature_[geoid]_[chunkid]_[hash]"
  let re = /vfeature_([^_]*)_([^_*])_(.*)/;
  let a = re.exec(vgeoid);
  if (a && a.length == 4)
    vgeoid = a[3];
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

  keys = keys.map((s: string) => canonicalSortingDistrictID(s));
  keys.sort();
  order = {};
  for (i = 0; i < keys.length; i++)
    order[canonicalDistrictID(keys[i])] = i+1;

  // Remove water districts
  if (order['ZZZ'])
    delete order['ZZZ'];

  return order;
}

export interface ConvertResult
{
  inBlockMap: BlockMapping;
  inStateMap: BlockMapping;
  outValid: boolean;
  outState: string;
  outMap: BlockMapping;
  outOrder: DistrictOrder;
  outDistrictToSplit: DistrictToSplitBlock;
}

export function blockmapToState(blockMap: BlockMapping): string
{
  for (var id in blockMap) if (blockMap.hasOwnProperty(id))
    return geoidToState(id);
  return null;
}

// blockToVTD:
//  Take BlockMapping (simple map of GEOID to districtID) and a per-state map of block-level GEOID to VTD
//  and return the output mapping of VTD to districtID, as well a data structure that describes any VTD's
//  that need to be split between districtIDs. Also returns the DistrictOrder structure that defines the
//  districtIDs that were used by the file.
//
//  The state (as specified by the first two digits of the GEOID) is also determined. If the GEOID's do
//  not all specify the same state, the mapping is considered invalid and the outValid flag is set to false.
//

export function blockmapToVTDmap(blockMap: BlockMapping, stateMap: BlockMapping): ConvertResult
{
  let res: ConvertResult = {
      inBlockMap: blockMap,
      inStateMap: stateMap,
      outValid: true,
      outState: null,
      outMap: {},
      outOrder: {},
      outDistrictToSplit: {}
    };

  let bmGather: { [geoid: string]: { [district: string]: { [blockid: string]: boolean } } } = {};
  let revMap: BlockMapping = {};
  let id: string;

  if (stateMap)
    for (id in stateMap) if (stateMap.hasOwnProperty(id))
      revMap[stateMap[id]] = null;

  // First aggregate into features across all the blocks
  for (id in blockMap) if (blockMap.hasOwnProperty(id))
  {
    let state = geoidToState(id);
    if (res.outState == null)
      res.outState = state;
    else if (res.outState !== state)
    {
      res.outValid = false;
      break;
    }

    let districtID: string = canonicalDistrictID(blockMap[id]);

    // Just ignore ZZZ (water) blocks
    if (districtID === 'ZZZ')
      continue;

    let n: number = id.length;
    let geoid: string;

    // Simple test for block id (vs. voting district or block group) id
    if (n >= 15)
    {
      if (stateMap && stateMap[id] !== undefined)
        geoid = stateMap[id];
      else
      {
        geoid = id.substr(0, 12); // heuristic for mapping blockID to blockgroupID
        if (revMap[geoid] === undefined)
        {
          res.outValid = false;
          break;
        }
      }
    }
    else
      geoid = id;

    if (res.outOrder[districtID] === undefined)
      res.outOrder[districtID] = 0;

    let districtToBlocks: { [districtID: string]: { [blockid: string]: boolean } } = bmGather[geoid];
    if (districtToBlocks === undefined)
      bmGather[geoid] = { [districtID]: { [id]: true } };
    else
    {
      let thisDistrict: { [blockid: string]: boolean } = districtToBlocks[districtID];
      if (thisDistrict === undefined)
      {
        thisDistrict = { };
        districtToBlocks[districtID] = thisDistrict;
      }
      thisDistrict[id] = true;
    }
  }

  // Now determine actual mapping of blocks to features, looking for split features
  for (let geoid in bmGather) if (bmGather.hasOwnProperty(geoid))
  {
    let districtToBlocks = bmGather[geoid];
    if (Util.countKeys(districtToBlocks) == 1)
    {
      res.outMap[geoid] = Util.nthKey(districtToBlocks);
    }
    else
    {
      for (let districtID in districtToBlocks) if (districtToBlocks.hasOwnProperty(districtID))
      {
        let split: SplitBlock = { state: '', datasource: '', geoid: geoid, blocks: Object.keys(districtToBlocks[districtID]) };
        let splits = res.outDistrictToSplit[districtID];
        if (splits === undefined)
        {
          splits = [];
          res.outDistrictToSplit[districtID] = splits;
        }
        splits.push(split);
      }
    }
  }

  res.outOrder = canonicalDistrictIDOrdering(res.outOrder);

  return res;
}

export const GEOIDToState: any = {
  '01': 'AL',
  '02': 'AK',
  '04': 'AZ',
  '05': 'AR',
  '06': 'CA',
  '08': 'CO',
  '09': 'CT',
  '10': 'DE',
  '12': 'FL',
  '13': 'GA',
  '15': 'HI',
  '16': 'ID',
  '17': 'IL',
  '18': 'IN',
  '19': 'IA',
  '20': 'KS',
  '21': 'KY',
  '22': 'LA',
  '23': 'ME',
  '24': 'MD',
  '25': 'MA',
  '26': 'MI',
  '27': 'MN',
  '28': 'MS',
  '29': 'MO',
  '30': 'MT',
  '31': 'NE',
  '32': 'NV',
  '33': 'NH',
  '34': 'NJ',
  '35': 'NM',
  '36': 'NY',
  '37': 'NC',
  '38': 'ND',
  '39': 'OH',
  '40': 'OK',
  '41': 'OR',
  '42': 'PA',
  '44': 'RI',
  '45': 'SC',
  '46': 'SD',
  '47': 'TN',
  '48': 'TX',
  '49': 'UT',
  '50': 'VT',
  '51': 'VA',
  '53': 'WA',
  '54': 'WV',
  '55': 'WI',
  '56': 'WY',
};

export const StateToGEOID: any = {
  'AL': '01',
  'AK': '02',
  'AZ': '04',
  'AR': '05',
  'CA': '06',
  'CO': '08',
  'CT': '09',
  'DE': '10',
  'FL': '12',
  'GA': '13',
  'HI': '15',
  'ID': '16',
  'IL': '17',
  'IN': '18',
  'IA': '19',
  'KS': '20',
  'KY': '21',
  'LA': '22',
  'ME': '23',
  'MD': '24',
  'MA': '25',
  'MI': '26',
  'MN': '27',
  'MS': '28',
  'MO': '29',
  'MT': '30',
  'NE': '31',
  'NV': '32',
  'NH': '33',
  'NJ': '34',
  'NM': '35',
  'NY': '36',
  'NC': '37',
  'ND': '38',
  'OH': '39',
  'OK': '40',
  'OR': '41',
  'PA': '42',
  'RI': '44',
  'SC': '45',
  'SD': '46',
  'TN': '47',
  'TX': '48',
  'UT': '49',
  'VT': '50',
  'VA': '51',
  'WA': '53',
  'WV': '54',
  'WI': '55',
  'WY': '56',
};

export function geoidToState(geoid: string): string
{
  let re = /^(..).*$/;

  let a = re.exec(geoid);
  if (a == null || a.length != 2) return null;
  return GEOIDToState[a[1]];
}
