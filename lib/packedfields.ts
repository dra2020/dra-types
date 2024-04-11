import { Util } from "@dra2020/baseclient";
import { PlanType } from './dra-types';

// **** Dataset Codes Explained ****
// Elections:
//  EYYGCC, where YY = year and CC = contest [PR, SE, GO, AG]
//  C16GCO = composite (spans number of years)
//  PYYGPR = PVI, where YY is year [16, 20]
// Census/ACS:
//  DYYF = Census/ACS Total Pop, where YY = year [10, 18, 19, 20]
//  DYYT = Census/ACS VAP/CVAP, where YY = year [10, 18, 19, 20]
//  D20FA = Census 2020 Total Prisoner-Adjusted Pop
//  D20TNH = Census 2020 VAP with Non-Hispanic Alone Race fields

// **** Dataset Fields Explained ****
// Elections:
//  D: Democratic
//  R: Republican
//  Tot (Total R + D + Other)
// Census/ACS/VAP/CVAP:
//  Tot: total
//  Wh: White alone, not Hispanic
//  His: All Hispanics
//  Bl: Black alone, not Hispanic;              BlC: Black combo, incl Hispanic
//  Asn: Asian alone, not Hispanic;             AsnC: Asian combo, incl Hispanic
//  Nat: Native alone, not Hispanic;            NatC: Native combo, incl Hispanic
//  Pac (also PI): Pacific alone, not Hispanic; PacC: Pacific combo, incl Hispanic
//  OthAl: Other alone, not Hispanic;           Oth: Other + Two or more races, incl Hispanic
//  Mix: Two or more races, not Hispanic
//  AsnPI: Asian + Pacific, not Hispanic


export const AGG_DEMOGRAPHIC = 'demographic';
export const AGG_DEMOGRAPHIC18 = 'demographic18';
export const AGG_pres2008 = 'pres2008';
export const AGG_pres2016 = 'pres2016';
export const AGG_pvi = 'pvi';

export const DATASET_TYPE_DEMOGRAPHIC = 'demographic';
export const DATASET_TYPE_ELECTION = 'election';
export const DATASET_TYPE_PVI = 'pvi';

export const DS_PVI2020 = 'P20GPR';
export const PVI2020_Title = 'PVI 2016/2020';
export const DS_PVI2016 = 'P16GPR';
export const DS_PRES2020 = 'E20GPR';
export const DS_PRES2016 = 'E16GPR';

export interface StateMeta
{
  state: string,
  pop: number,
  reps: number,
}

export interface StatesMetaIndex
{
  [key: string]: StateMeta;      // key is shortstate (2 letter) state name
}

export interface StatesMeta
{
  [key: string]: StatesMetaIndex;    // key is one of the datasource strings
}

export type FieldGetter = (f: string) => number;
export function fieldGetterNotLoaded(f: string): number { return undefined }
export type PackedFields = Float64Array;
export interface PackedFieldsIndex
{
  [field: string]: number; // offset into PackedFields
}

export interface PackedMetaIndex
{
  length: number;
  fields: { [dataset: string]: PackedFieldsIndex };
  getDatasetField: (f: any, dataset: string, field: string) => number;
}

export interface DatasetMeta
{
  type: string,
  year: number,
  title: string,
  fields: {
    [key: string]: any,
  },
  votingAge?: boolean,
  office?: string,
  subtype?: string,
  description?: string,
  nhAlone?: boolean,
  privateKey?: string,    // key for private data
  members?: {[key: number]: string},
}
export type DatasetsMeta = { [dataset: string]: DatasetMeta };

// This integregates the information associated with a specific state and datasource as
// well as user selections around which datasets to view. Used to propagate through UI.
export interface DatasetContext
{
  dsIndex: PackedMetaIndex;
  primeDDS: string;     // Demographic (Census)
  primeVDS: string;     // VAP/CVAP
  primeEDS: string;     // Election
  datasetMetaDDS: DatasetMeta;
  datasetMetaVDS: DatasetMeta;
  datasetMetaEDS: DatasetMeta;
}

// Dataset Lists
export type DSListItem = {
  key: string,
  title: string,
  order: number,
};

export type DSList = DSListItem[];

export type DSLists = {
  census: DSList,
  vap: DSList,
  election: DSList,
};

export type PlanTypePlus = PlanType | '';

export function fGetJoined(f: any): any[]
{
  return (f.properties && f.properties.joined) ? f.properties.joined : undefined;
}

export function fGet(f: any, p: string): any
{
  return fGetW(f, null, p);
}

// Note f is a direct GeoJSON feature
// Called when building packedFields; after that f.properties.datasets is deleted, so then it's only useful for non-dataset properties.
function fGetW(f: any, datasetKey: string, p: string): any
{
  // pBackup helps support 2016_BG, which don't have the 'C' fields
  const pBackup: string = (p === 'BlC') ? 'Bl' : (p === 'AsnC' || p === 'PacC') ? 'AsnPI' : (p === 'NatC') ? 'Nat' : null;
  
  // Direct property?
  if (f.properties && f.properties[p] !== undefined)
    return f.properties[p];
  else if (datasetKey && f.properties && f.properties.datasets && f.properties.datasets[datasetKey])
  {
    if (f.properties.datasets[datasetKey][p] != null)
      return f.properties.datasets[datasetKey][p];
    else if (pBackup && f.properties.datasets[datasetKey][pBackup] != null)
      return f.properties.datasets[datasetKey][pBackup];
  }

  // Joined property?
  let a: any[] = fGetJoined(f);
  if (a)
  {
    for (let i: number = 0; i < a.length; i++)
    {
      let o: any = a[i];
      if (!datasetKey)
      {
        if (o[p] !== undefined)
          return o[p];
      }
      else
      {
        if (o['datasets'] && o['datasets'][datasetKey] != null)
        {
          if (o['datasets'][datasetKey][p] != null)
            return o['datasets'][datasetKey][p];
          else if (pBackup && o['datasets'][datasetKey][pBackup] != null)
            return o['datasets'][datasetKey][pBackup];
        }
      }
    }
  }
  return undefined;
}

export function computeMetaIndex(meta: DatasetsMeta): PackedMetaIndex
{
  if (meta == null) return null;
  let offset = 1; // first entry is count of aggregates
  let index: PackedMetaIndex = { length: 0, fields: {}, getDatasetField: null };
  Object.keys(meta).forEach((datasetKey: string) => {
      let dataset = meta[datasetKey];
      let fieldsIndex: PackedFieldsIndex = {};
      Object.keys(dataset.fields).forEach((field: string) => {
          fieldsIndex[field] = offset++;
        });
      index.fields[datasetKey] = fieldsIndex;
    });
  index.length = offset;
  index.getDatasetField = (f: any, dataset: string, field: string): number => {
      let pf = retrievePackedFields(f);
      return getPackedField(index, pf, dataset, field);
    };
  return index;
}

let nAlloc = 0;
function allocPackedFields(length: number): PackedFields
{
  let ab = new ArrayBuffer(8 * length);
  let af = new Float64Array(ab);
  nAlloc++;
  //if ((nAlloc % 10000) == 0) console.log(`allocPackedFields: ${nAlloc} allocs`);
  return af;
}

export function computePackedFields(f: any, index: PackedMetaIndex): PackedFields
{
  if (f.properties.packedFields) return f.properties.packedFields as PackedFields;

  let af = allocPackedFields(index.length);
  af[0] = 0;  // count of number of aggregates
  Object.keys(index.fields).forEach((dataset: string) => {
      let fields = index.fields[dataset];
      Object.keys(fields).forEach((field: string) => {
          let n = fGetW(f, dataset, field);
          if (isNaN(n))
            n = 0;
          af[fields[field]] = n;
        });
    });
  f.properties.packedFields = af;  // cache here
  f.properties.getDatasetField = index.getDatasetField;

  // Major memory savings to delete this after packing
  delete f.properties.datasets;
  return af;
}

export function hasPackedFields(f: any): boolean
{
  return f.properties.packedFields !== undefined;
}

export function setPackedFields(f: any, pf: PackedFields, fIndex: any): void
{
  if (f.properties.packedFields !== undefined) throw 'Packed fields already set';
  f.properties.packedFields = pf;
  f.properties.getDatasetField = fIndex.properties.getDatasetField
}

export function retrievePackedFields(f: any): PackedFields
{
  if (f.properties.packedFields === undefined) throw 'Feature should have pre-computed packed fields';
  return f.properties.packedFields as PackedFields;
}

// The first entry in the PackedFields aggregate is the count of items aggregated.
// Treat a null instance as just a single entry with no aggregates.
let abZero = new ArrayBuffer(8);
let afZero = new Float64Array(abZero);
afZero[0] = 0;

export function zeroPackedFields(index: PackedMetaIndex): PackedFields
{
  if (index == null) return afZero;
  let af = allocPackedFields(index.length);
  for (let i = 0; i < af.length; i++)
    af[i] = 0;
  return af;
}

export function zeroPackedCopy(pf: PackedFields): PackedFields
{
  if (pf == null) return afZero;
  let af = allocPackedFields(pf.length);
  for (let i = 0; i < af.length; i++)
    af[i] = 0;
  return af;
}

export function packedCopy(pf: PackedFields): PackedFields
{
  if (pf == null) return null;
  let af = allocPackedFields(pf.length);
  for (let i = 0; i < pf.length; i++)
    af[i] = pf[i];
  return af;
}

export function aggregatePackedFields(agg: PackedFields, pf: PackedFields): PackedFields
{
  if (agg == null || pf == null) return agg;
  if (agg.length != pf.length)
  {
    return agg; // bug, but don't crash
    //throw 'aggregatePackedFields: unexpected length mismatch';
  }
  let n = agg.length;
  for (let i = 1; i < n; i++)
    agg[i] += pf[i];
  agg[0]++; // count of number of aggregates
  return agg;
}

export function diffPackedFields(main: any, parts: any[]): PackedFields
{
  main = packedCopy(retrievePackedFields(main));
  if (main == null || parts == null || parts.length == 0) return null;
  parts = parts.map(retrievePackedFields);
  parts.forEach((pf: PackedFields) => {
      for (let i = 0; i < main.length; i++)
        main[i] -= pf[i];
    });
  return main;
}

export function getPackedField(index: PackedMetaIndex, pf: PackedFields, dataset: string, field: string): number
{
  if (index == null || pf == null) return 0;
  let fields = index.fields[dataset];
  return fields ? (fields[field] !== undefined ? pf[fields[field]] : 0) : 0;
}

export function findPackedField(index: PackedMetaIndex, pf: PackedFields, dataset: string, field: string): number
{
  let fields = index.fields[dataset];
  return fields ? (fields[field] !== undefined ? fields[field] : -1) : -1;
}

export function ToGetter(agg: PackedFields, dc: DatasetContext, datasetKey: string): FieldGetter
{
  return (field: string) => { return getPackedField(dc.dsIndex, agg, datasetKey, field) };
}

export function ToGetterPvi16(agg: PackedFields, dc: DatasetContext, datasetKey: string): FieldGetter
{
  return (field: string) =>
  {
    if (field === 'R')
      return Math.round((getPackedField(dc.dsIndex, agg, datasetKey, 'R12') + getPackedField(dc.dsIndex, agg, datasetKey, 'R16')) / 2);
    if (field === 'D')
      return Math.round((getPackedField(dc.dsIndex, agg, datasetKey, 'D12') + getPackedField(dc.dsIndex, agg, datasetKey, 'D16')) / 2);
    if (field === 'Tot')
      return Math.round((
        getPackedField(dc.dsIndex, agg, datasetKey, 'R12') + getPackedField(dc.dsIndex, agg, datasetKey, 'R16') +
        getPackedField(dc.dsIndex, agg, datasetKey, 'D12') + getPackedField(dc.dsIndex, agg, datasetKey, 'D16')) / 2);
    return 0;
  };
}

export function ToGetterPvi20(agg: PackedFields, dc: DatasetContext): FieldGetter
{
  return (field: string) =>
  {
    if (field === 'R')
      return Math.round((getPackedField(dc.dsIndex, agg, DS_PRES2016, 'R') + getPackedField(dc.dsIndex, agg, DS_PRES2020, 'R')) / 2);
    if (field === 'D')
      return Math.round((getPackedField(dc.dsIndex, agg, DS_PRES2016, 'D') + getPackedField(dc.dsIndex, agg, DS_PRES2020, 'D')) / 2);
    if (field === 'Tot')
      return Math.round((
        getPackedField(dc.dsIndex, agg, DS_PRES2016, 'R') + getPackedField(dc.dsIndex, agg, DS_PRES2020, 'R') +
        getPackedField(dc.dsIndex, agg, DS_PRES2016, 'D') + getPackedField(dc.dsIndex, agg, DS_PRES2020, 'D')) / 2);
    return 0;
  };

}

export function calcShift(agg: PackedFields, dc: DatasetContext, datasetOld: string, datasetNew: string): number
{
  const getterOld = datasetOld === DS_PVI2016 ?
    ToGetterPvi16(agg, dc, datasetOld) :
    datasetOld === DS_PVI2020 ?
      ToGetterPvi20(agg, dc) :
      ToGetter(agg, dc, datasetOld);
  const getterNew = datasetNew === DS_PVI2016 ?
    ToGetterPvi16(agg, dc, datasetNew) :
    datasetNew === DS_PVI2020 ?
      ToGetterPvi20(agg, dc) :
      ToGetter(agg, dc, datasetNew);

  // Calc two-party Swing
  const repOld = getterOld('R');
  const demOld = getterOld('D');
  const repNew = getterNew('R');
  const demNew = getterNew('D');

  if (repOld === undefined || demOld === undefined || repNew === undefined || demNew === undefined)
    return null;

    const totOld = demOld + repOld;
    const totNew = demNew + repNew;
    if (totOld <= 0 || totNew <= 0)
      return null;

  const pctDemOld: number = demOld / totOld;
  const pctRepOld: number = repOld / totOld;
  const pctDemNew: number = demNew / totNew;
  const pctRepNew: number = repNew / totNew;
  const shift: number = Math.max(Math.min((pctDemNew - pctDemOld) - (pctRepNew - pctRepOld), 1.0), -1.0);
  return shift;
}

export function calcRawPvi(getter: FieldGetter): number
{
  // ((((sum(d_2016) / (sum(d_2016) + sum(r_2016))) * 100) +  ((sum(d_2012) / (sum(d_2012) + sum(r_2012))) * 100)) / 2) - 51.54
  // Fields hard coded
  let total2012 = getter('D12') + getter('R12');
  let total2016 = getter('D16') + getter('R16');
  let pct2012 = total2012 != 0 ? (getter('D12') / total2012) * 100 : 0;
  let pct2016 = total2016 != 0 ? (getter('D16') / total2016) * 100 : 0;
  return (pct2012 + pct2016) / ((total2012 != 0 && total2016 != 0) ? 2 : 1);
}

export function pviStr(getter: FieldGetter): string
{
  const pviRaw: number = calcRawPvi(getter);
  const pvi = Util.precisionRound(pviRaw != 0 ? pviRaw - 51.54 : 0, 2);
  return pvi >= 0 ? 'D+' + pvi : 'R+' + (-pvi);
}

export function calcRaw2020Pvi(getter16: FieldGetter, getter20: FieldGetter): number
{
  let total2016 = getter16('D') + getter16('R');
  let total2020 = getter20('D') + getter20('R');
  let pct2016 = total2016 != 0 ? (getter16('D') / total2016) * 100 : 0;
  let pct2020 = total2020 != 0 ? (getter20('D') / total2020) * 100 : 0;
  return (pct2020 + pct2016) / ((total2020 != 0 && total2016 != 0) ? 2 : 1);
}

export function pvi2020Str(getter16: FieldGetter, getter20: FieldGetter): string
{
  const pviRaw: number = calcRaw2020Pvi(getter16, getter20);
  const pvi = Util.precisionRound(pviRaw != 0 ? pviRaw - 51.54 : 0, 2);
  return pvi >= 0 ? 'D+' + pvi : 'R+' + (-pvi);
}
