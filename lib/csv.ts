// Public libraries
import { Util } from '@dra2020/baseclient';

// Local library
import * as VF from './vfeature';

// Used internally to index into District Properties Array
export type BlockMap = { [id: string]: number };

// Used more generically and allows string districtIDs
export type BlockMapping = { [id: string]: string };

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
// so alphabetic sorting will result in correct numeric sort for mixed alphanumber
// district labels.
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

// If purely numeric districtIDs and we are missing some number of IDs less than
export function canonicalDistrictIDGapFill(keys: string[]): string[]
{
  if (keys == null || keys.length == 0) return keys;
  let nonNumeric = keys.find((s: string) => !reDistrictNumber.test(s)) !== undefined;
  if (nonNumeric) return keys;
  let max = Number(keys[keys.length-1]);
  if (max == keys.length || (max - keys.length) > keys.length) return keys;  // no gaps or too many gaps

  // OK, finally going to fill some gaps
  for (let i: number = 0; i < keys.length; i++)
  {
    let here = Number(keys[i]);
    while (here > i+1)
    {
      keys.splice(i, 0, canonicalSortingDistrictID(String(i+1)));
      i++;
    }
  }

  return keys;
}

export function canonicalDistrictIDOrdering(order: DistrictOrder): DistrictOrder
{
  let keys = Object.keys(order);
  let i: number;
  let a: any = [];
  let template: string = undefined;

  keys = keys.map((s: string) => canonicalSortingDistrictID(s));
  keys = canonicalDistrictIDGapFill(keys);
  keys.sort();
  order = {};
  for (i = 0; i < keys.length; i++)
    order[canonicalDistrictID(keys[i])] = i+1;

  // Remove water districts
  if (order['ZZZ']) delete order['ZZZ'];
  if (order['ZZ']) delete order['ZZ'];

  return order;
}

export interface OneCSVLine
{
  geoid: string;
  districtID: string;
}

let reArray = [
  // comma-delimited
  /^(\d\d[^\s,"']*)[\s]*,[\s]*([^\s'"]+)[\s]*$/,
  /^["'](\d\d[^"']*)["'][\s]*,[\s]*["']([^"']*)["'][\s]*$/,
  /^(\d\d[^\s,]*)[\s]*,[\s]*["']([^"']*)["'][\s]*$/,
  /^["'](\d\d[^"']*)["'][\s]*,[\s]*([^\s]+)[\s]*$/,

  // pipe-delimited, new 2020 Census Bureau format
  /^(\d\d[^\s\|"']*)[\s]*\|[\s]*([^\s'"]+)[\s]*$/,
  /^["'](\d\d[^"']*)["'][\s]*\|[\s]*["']([^"']*)["'][\s]*$/,
  /^(\d\d[^\s\|]*)[\s]*\|[\s]*["']([^"']*)["'][\s]*$/,
  /^["'](\d\d[^"']*)["'][\s]*\|[\s]*([^\s]+)[\s]*$/,
  ];

export function parseCSVLine(line: string): OneCSVLine
{
  if (line == null || line == '') return null;
  for (let i: number = 0; i < reArray.length; i++)
  {
    let a = reArray[i].exec(line);
    if (a && a.length === 3)
      return { geoid: a[1], districtID: a[2] };
  }
  return null;
}

export interface ConvertResult
{
  inBlockMap: BlockMapping;
  inBinTrie: Util.BinTrie;
  outValid: boolean;
  outState: string;
  outMap: BlockMapping;
  outOrder: DistrictOrder;
  outDistrictToSplit: VF.DistrictToSplitBlock;
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

export function blockmapToVTDmap(blockMap: BlockMapping, stateBT: Util.BinTrie): ConvertResult
{
  let res: ConvertResult = {
      inBlockMap: blockMap,
      inBinTrie: stateBT,
      outValid: true,
      outState: null,
      outMap: {},
      outOrder: {},
      outDistrictToSplit: {}
    };

  let bmGather: { [geoid: string]: { [district: string]: { [blockid: string]: boolean } } } = {};
  let id: string;

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
      if (stateBT && stateBT.get(id) !== undefined)
        geoid = stateBT.get(id);
      else
      {
        //res.outValid = false;
        //break;
        //Actually, let's just ignore unknown blockIDs
        continue;
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
        let split: VF.SplitBlock = { state: '', datasource: '', geoid: geoid, blocks: Object.keys(districtToBlocks[districtID]) };
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

export const StateIdToStateCode: any = {
  '01': 'AL',
  '02': 'AK',
  '04': 'AZ',
  '05': 'AR',
  '06': 'CA',
  '08': 'CO',
  '09': 'CT',
  '10': 'DE',
  '11': 'DC',
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
  '72': 'PR',
};

export const StateCodeToStateId: any = {
  'AL': '01',
  'AK': '02',
  'AZ': '04',
  'AR': '05',
  'CA': '06',
  'CO': '08',
  'CT': '09',
  'DE': '10',
  'DC': '11',
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
  'PR': '72',
};

export function geoidToState(geoid: string): string
{
  let re = /^(..).*$/;

  let a = re.exec(geoid);
  if (a == null || a.length != 2) return null;
  return StateIdToStateCode[a[1]];
}

export type StateUrls = (
  'alabama' |
  'alaska' |
  'arizona' |
  'arkansas' |
  'california' |
  'colorado' |
  'connecticut' |
  'delaware' |
  'district-of-columbia' |
  'florida' |
  'georgia' |
  'hawaii' |
  'idaho' |
  'illinois' |
  'indiana' |
  'iowa' |
  'kansas' |
  'kentucky' |
  'louisiana' |
  'maine' |
  'maryland' |
  'massachusetts' |
  'michigan' |
  'minnesota' |
  'mississippi' |
  'missouri' |
  'montana' |
  'nebraska' |
  'nevada' |
  'new-hampshire' |
  'new-jersey' |
  'new-mexico' |
  'new-york' |
  'north-carolina' |
  'north-dakota' |
  'ohio' |
  'oklahoma' |
  'oregon' |
  'pennsylvania' |
  'rhode-island' |
  'south-carolina' |
  'south-dakota' |
  'tennessee' |
  'texas' |
  'utah' |
  'vermont' |
  'virginia' |
  'washington' |
  'west-virginia' |
  'wisconsin' |
  'wyoming' |
  'puerto-rico'
);

export type ValidStateNamesForUrlType =
{
  readonly [stateUrl in StateUrls]: boolean;
};

const ValidStateNamesForUrl: ValidStateNamesForUrlType = {
  'alabama': true,
  'alaska': true,
  'arizona': true,
  'arkansas': true,
  'california': true,
  'colorado': true,
  'connecticut': true,
  'delaware': true,
  'district-of-columbia': true,
  'florida': true,
  'georgia': true,
  'hawaii': true,
  'idaho': true,
  'illinois': true,
  'indiana': true,
  'iowa': true,
  'kansas': true,
  'kentucky': true,
  'louisiana': true,
  'maine': true,
  'maryland': true,
  'massachusetts': true,
  'michigan': true,
  'minnesota': true,
  'mississippi': true,
  'missouri': true,
  'montana': true,
  'nebraska': true,
  'nevada': true,
  'new-hampshire': true,
  'new-jersey': true,
  'new-mexico': true,
  'new-york': true,
  'north-carolina': true,
  'north-dakota': true,
  'ohio': true,
  'oklahoma': true,
  'oregon': true,
  'pennsylvania': true,
  'rhode-island': true,
  'south-carolina': true,
  'south-dakota': true,
  'tennessee': true,
  'texas': true,
  'utah': true,
  'vermont': true,
  'virginia': true,
  'washington': true,
  'west-virginia': true,
  'wisconsin': true,
  'wyoming': true,
  'puerto-rico': true,
};

export function isValidStateNameForUrl(s: any): s is StateUrls
{
  return (typeof s === 'string' && s in ValidStateNamesForUrl);
}
