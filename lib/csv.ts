// Public libraries
import { Util, CSV, G } from '@dra2020/baseclient';

// Local library
import * as VF from './vfeature';

// Used internally to index into District Properties Array
export type BlockMap = { [id: string]: number };

// Used more generically and allows string districtIDs
export type BlockMapping = { [id: string]: string };

export type RevBlockMapping = { [id: string]: string[] };

// Alternate block mapping (only supports <1 std>: <Many alt>)
export type AltBlockMapping = { [blockid: string]: {[blockid: string]: number} }; // {stdblock: {altblock1: pop1, altblock2: pop2, ...}}

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

function reverseSubMapping(mbm: G.MultiBlockMapping, n: number): G.ReverseBlockMapping
{
  let rev: any = {};

  mbm.forEach(blockid => {
      let geoid = blockid.substr(0, n);
      if (! rev[geoid]) rev[geoid] = [];
      rev[geoid].push(blockid);
    });
  return rev;
}

function reverseBlockgroupMapping(mbm: G.MultiBlockMapping): G.ReverseBlockMapping
{
  return reverseSubMapping(mbm, 12);
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

  // Let's omit this. Some official maps have odd numbering schemes and we don't
  // want to generate anomalous spurious extra districts.
  //keys = canonicalDistrictIDGapFill(keys);

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
  /^(\d\d[^\s,']*)[\s]*,[\s]*([^\s']+)[\s]*$/,
  /^(\d\d[^\s,"]*)[\s]*,[\s]*([^\s"]+)[\s]*$/,
  /^['](\d\d[^']*)['][\s]*,[\s]*[']([^']*)['][\s]*$/,
  /^["](\d\d[^"]*)["][\s]*,[\s]*["]([^"]*)["][\s]*$/,
  /^(\d\d[^\s,]*)[\s]*,[\s]*[']([^']*)['][\s]*$/,
  /^(\d\d[^\s,]*)[\s]*,[\s]*["]([^"]*)["][\s]*$/,
  /^['](\d\d[^']*)['][\s]*,[\s]*([^\s]+)[\s]*$/,
  /^["](\d\d[^"]*)["][\s]*,[\s]*([^\s]+)[\s]*$/,

  // pipe-delimited, new 2020 Census Bureau format
  /^(\d\d[^\s\|']*)[\s]*\|[\s]*([^\s']+)[\s]*$/,
  /^(\d\d[^\s\|"]*)[\s]*\|[\s]*([^\s"]+)[\s]*$/,
  /^['](\d\d[^']*)['][\s]*\|[\s]*[']([^']*)['][\s]*$/,
  /^["](\d\d[^"]*)["][\s]*\|[\s]*["]([^"]*)["][\s]*$/,
  /^(\d\d[^\s\|]*)[\s]*\|[\s]*[']([^']*)['][\s]*$/,
  /^(\d\d[^\s\|]*)[\s]*\|[\s]*["]([^"]*)["][\s]*$/,
  /^['](\d\d[^']*)['][\s]*\|[\s]*([^\s]+)[\s]*$/,
  /^["](\d\d[^"]*)["][\s]*\|[\s]*([^\s]+)[\s]*$/,
  ];
let reStart = 0;  // last successful regex

export function parseCSVLine(line: string): OneCSVLine
{
  if (line == null || line == '') return null;

  // start at last successful parse so we don't have to
  // iterate through all the regex's for each line.
  for (let i = reStart; i < reArray.length; i++)
  {
    let a = reArray[i].exec(line);
    if (a && a.length === 3)
    {
      reStart = i;
      return { geoid: a[1], districtID: a[2] };
    }
  }
  for (let i = 0; i < reStart; i++)
  {
    let a = reArray[i].exec(line);
    if (a && a.length === 3)
    {
      reStart = i;
      return { geoid: a[1], districtID: a[2] };
    }
  }
  return null;
}

export function csvLine(coder: Util.Coder, line: string): OneCSVLine
{
  if (!coder || !line) return null;
  let parse = new CSV.ParseOne(coder, line);
  if (parse.length != 2) return null;
  let re = /^\d\d/;
  if (!re.exec(parse.fields[0])) return null;
  return { geoid: parse.fields[0], districtID: parse.fields[1] };
}

export interface ConvertResult
{
  inBlockMap: BlockMapping;
  inMbm: G.MultiBlockMapping;
  outMbm: G.MultiBlockMapping;
  outValid: boolean;
  outState: string;
  outMap: BlockMapping;
  outOrder: DistrictOrder;
  outDistrictToSplit: VF.DistrictToSplitBlock;
  nFeatures: number;
  nSplitFromFeatures: number;
  nSplitToFeatures: number;
  nBlocks: number;
  nSplitBlocks: number;
}

export function blockmapToState(blockMap: BlockMapping): string
{
  for (var id in blockMap) if (blockMap.hasOwnProperty(id))
    return geoidToState(id);
  return null;
}

export function blockmapToVTDmap(blockMap: BlockMapping, mbm: G.MultiBlockMapping, altBlocks: AltBlockMapping): ConvertResult
{
  return blockmapToVTDmapCustom(blockMap, mbm, mbm, altBlocks);
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

export function blockmapToVTDmapCustom(
  blockMap: BlockMapping,
  inMbm: G.MultiBlockMapping,
  outMbm: G.MultiBlockMapping,
  altBlocks: AltBlockMapping): ConvertResult
{
  let res: ConvertResult = {
      inBlockMap: blockMap,
      inMbm: inMbm,
      outMbm: outMbm,
      outValid: true,
      outState: null,
      outMap: {},
      outOrder: {},
      outDistrictToSplit: {},
      nFeatures: 0,
      nSplitFromFeatures: 0,
      nSplitToFeatures: 0,
      nBlocks: 0,
      nSplitBlocks: 0,
    };

  let bmGather: { [geoid: string]: { [district: string]: { [blockid: string]: boolean } } } = {};

  let revBG: RevBlockMapping; // lazy create on demand

  function isBlockID(b: string): boolean { return b.length >= 15 && (!inMbm || !!inMbm.map(b)) }

  if (altBlocks)
  {
    // Create reverse of altBlocks if they exist   {altBlockid: {stdBlockid, pop}, ...}
    let revAltBlocks: {[altBlockid: string]: {blockid: string, pop: number}} = {};
    Object.keys(altBlocks).forEach(blockid =>
    {
      Object.keys(altBlocks[blockid]).forEach(altBlockid =>
      {
        revAltBlocks[altBlockid] = {blockid: blockid, pop: altBlocks[blockid][altBlockid]}
      })
    });
    // Now walk input and build new blockMap with altBlocks replaced with stdBlocks
    let blockMapP: BlockMapping = {};
    let bestAlt: {[blockid: string]: {dist: string, pop: number}} = {};
    for (var id in blockMap) if (blockMap.hasOwnProperty(id))
    {
      let n: number = id.length;
      if (isBlockID(id) && revAltBlocks[id])
      {
        if (!bestAlt[revAltBlocks[id].blockid] || bestAlt[revAltBlocks[id].blockid].pop < revAltBlocks[id].pop)
        {
          bestAlt[revAltBlocks[id].blockid] = {dist: blockMap[id], pop: revAltBlocks[id].pop};
          blockMapP[revAltBlocks[id].blockid] = blockMap[id];
        }
      }
      else
      {
        blockMapP[id] = blockMap[id];
      }
    }
    blockMap = blockMapP;
  }

  // First aggregate into features across all the blocks
  for (var id in blockMap) if (blockMap.hasOwnProperty(id))
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

    if (res.outOrder[districtID] === undefined)
      res.outOrder[districtID] = 0;

    let n: number = id.length;
    let geoids: string[];
    let ids: string[];
    res.nBlocks++;

    // Simple test for block id (vs. voting district or block group) id
    // Also skip longer custom precinct ids
    if (isBlockID(id))
    {
      ids = [id];
      if (outMbm && outMbm.map(id) !== undefined)
        geoids = [outMbm.map(id)];
      else
      {
        geoids = [id.substr(0, 12)];
        if (outMbm && !outMbm.rev(geoids[0]))
        {
          res.outValid = false;
          break;
        }
      }
    }
    else if (n == 12)
    {
      if (!revBG) revBG = reverseBlockgroupMapping(outMbm);
      if (revBG[id])
      {
        ids = revBG[id];
        geoids = ids.map(id => outMbm.map(id));
      }
      else
      {
        ids = [id];
        geoids = [id];
      }
    }
    else if (inMbm.rev(id))
    {
      // Map down to blockids and then back up to geoids to handle both custom and default geoids
      ids = inMbm.rev(id);
      geoids = ids.map(blockid => outMbm.map(blockid));
    }
    else
    {
      ids = [id];
      geoids = [id];
    }

    ids.forEach((id: string, i: number) => {
        let geoid = geoids[i];
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
    });
  }

  // Now determine actual mapping of blocks to features, looking for split features
  for (let geoid in bmGather) if (bmGather.hasOwnProperty(geoid))
  {
    let districtToBlocks = bmGather[geoid];
    let bWhole = false;
    if (Util.countKeys(districtToBlocks) == 1)
    {
      let blocks = Object.keys(districtToBlocks[Util.nthKey(districtToBlocks)]);
      if (blocks[0] === geoid || (outMbm.rev(geoid) && blocks.length === outMbm.rev(geoid).length))
        bWhole = true;
    }
    if (bWhole)
    {
      res.outMap[geoid] = Util.nthKey(districtToBlocks);
      res.nFeatures++;
    }
    else
    {
      for (let districtID in districtToBlocks) if (districtToBlocks.hasOwnProperty(districtID))
      {
        let split: VF.SplitBlock = { state: '', datasource: '', geoid: geoid, blocks: Object.keys(districtToBlocks[districtID]) };
        res.nSplitBlocks += split.blocks.length;
        let splits = res.outDistrictToSplit[districtID];
        if (splits === undefined)
        {
          splits = [];
          res.outDistrictToSplit[districtID] = splits;
        }
        splits.push(split);
        res.nFeatures++;
        res.nSplitToFeatures++;
      }
      res.nSplitFromFeatures++;
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

// StateCodes in state name alphabetically order
export const StateCodesOrdered: string[] = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "DC",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
  "PR",
];

export const StateNameMap : {[key: string] : string} = {
  "AL": "Alabama",
  "AK": "Alaska",
  "AZ": "Arizona",
  "AR": "Arkansas",
  "CA": "California",
  "CO": "Colorado",
  "CT": "Connecticut",
  "DE": "Delaware",
  "FL": "Florida",
  "GA": "Georgia",
  "HI": "Hawaii",
  "ID": "Idaho",
  "IL": "Illinois",
  "IN": "Indiana",
  "IA": "Iowa",
  "KS": "Kansas",
  "KY": "Kentucky",
  "LA": "Louisiana",
  "ME": "Maine",
  "MD": "Maryland",
  "MA": "Massachusetts",
  "MI": "Michigan",
  "MN": "Minnesota",
  "MS": "Mississippi",
  "MO": "Missouri",
  "MT": "Montana",
  "NE": "Nebraska",
  "NV": "Nevada",
  "NH": "New Hampshire",
  "NJ": "New Jersey",
  "NM": "New Mexico",
  "NY": "New York",
  "NC": "North Carolina",
  "ND": "North Dakota",
  "OH": "Ohio",
  "OK": "Oklahoma",
  "OR": "Oregon",
  "PA": "Pennsylvania",
  "RI": "Rhode Island",
  "SC": "South Carolina",
  "SD": "South Dakota",
  "TN": "Tennessee",
  "TX": "Texas",
  "UT": "Utah",
  "VT": "Vermont",
  "VA": "Virginia",
  "WA": "Washington",
  "WV": "West Virginia",
  "WI": "Wisconsin",
  "WY": "Wyoming",
  "DC": "District of Columbia",
  "PR": "Puerto Rico",
};
