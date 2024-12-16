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

import { DatasetMeta, DatasetsMeta } from './datasets';


export const AGG_DEMOGRAPHIC = 'demographic';
export const AGG_DEMOGRAPHIC18 = 'demographic18';
export const AGG_pres2008 = 'pres2008';
export const AGG_pres2016 = 'pres2016';
export const AGG_pvi = 'pvi';

export const DATASET_TYPE_DEMOGRAPHIC = 'demographic';
export const DATASET_TYPE_ELECTION = 'election';
export const DATASET_TYPE_PVI = 'pvi';
export const DATASET_TYPE_OTHER = 'other';

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

export interface PackedFieldsIndex
{
  [field: string]: number; // offset into PackedFields
}

export interface PackedMetaIndex
{
  length: number;
  fields: { [dataset: string]: PackedFieldsIndex };
}

export type GroupPackedMetaIndex = { [did: string]: PackedMetaIndex };

export interface PrimaryDatasetKeys
{
  SHAPES?: string,
  CENSUS: string,
  VAP: string,
  ELECTION: string,
}

export type PackedFieldsArray = Float64Array;
export interface PackedFields {
  dsGroup: GroupPackedMetaIndex,
  data: { [did: string]: PackedFieldsArray }
}

// This integregates the information associated with a specific state and datasource as
// well as user selections around which datasets to view. Used to propagate through UI.
export interface DatasetContext
{
  dsGroup: GroupPackedMetaIndex;
  dsMeta: DatasetsMeta;
  primeDDS: string;     // Demographic (Census)
  primeVDS: string;     // VAP/CVAP
  primeEDS: string;     // Election
  //datasetMetaDDS: DatasetMeta;
  //datasetMetaVDS: DatasetMeta;
  //datasetMetaEDS: DatasetMeta;
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

  return undefined;
}

export function sortedFieldList(ds: DatasetMeta): string[]
{
  let keys = Object.keys(ds.fields);
  let kv = keys.map(k => { return { k, v: ds.fields[k] } }).sort((a: any, b: any) => { return (a.v.order || 0) - (b.v.order || 0) });
  return kv.map(kv => kv.k);
}

export function getDatasetField(f: any, did: string, field: string): number
{
  let pf = retrievePackedFields(f);
  return getPackedField(pf, did, field);
}

export function computeMetaIndex(did: string, meta: DatasetsMeta): PackedMetaIndex
{
  if (meta == null) return null;
  let offset = 1; // first entry is count of aggregates
  let index: PackedMetaIndex = { length: 0, fields: {} };
  Object.keys(meta).forEach((datasetKey: string) => {
      let dataset = meta[datasetKey];
      let fieldsIndex: PackedFieldsIndex = {};
      sortedFieldList(dataset).forEach((field: string) => {
          fieldsIndex[field] = offset++;
        });
      index.fields[datasetKey] = fieldsIndex;
    });
  index.length = offset;
  return index;
}

export function computeOnePackedFields(f: any, dsGroup: GroupPackedMetaIndex, index: PackedMetaIndex, did: string, datasetKey: string): PackedFields
{
  let af = allocPackedFieldsArray(index.length);
  af[0] = 0;  // count of number of aggregates
  let fields = index.fields[did];
  Object.keys(fields).forEach((field: string) => {
      let n = fGetW(f, datasetKey, field);
      if (isNaN(n))
        n = 0;
      af[fields[field]] = n;
    });

  if (! f.properties.packedFields)
    initPackedFields(f, dsGroup);
  f.properties.packedFields.data[did] = af;

  return f.properties.packedFields;
}

let nAlloc = 0;
function allocPackedFieldsArray(length: number): PackedFieldsArray
{
  let ab = new ArrayBuffer(8 * length);
  let af = new Float64Array(ab);
  nAlloc++;
  //if ((nAlloc % 10000) == 0) console.log(`allocPackedFieldsArray: ${nAlloc} allocs`);
  return af;
}

export function initPackedFields(f: any, dsGroup: GroupPackedMetaIndex): void
{
  if (f.properties.packedFields !== undefined) throw 'Packed fields already set';

  f.properties.packedFields = { dsGroup, data: {} };
}

export function clearPackedFields(f: any): void
{
  delete f.properties.packedFields;
}

export function hasPackedFields(f: any): boolean
{
  return f.properties.packedFields !== undefined;
}

export function setPackedFields(f: any, pf: PackedFields): void
{
  if (f.properties.packedFields !== undefined) throw 'Packed fields already set';
  f.properties.packedFields = pf;
}

const reExtDataset = /^.*\.ds$/;
export function isExtDataset(did: string): boolean
{
  return did && reExtDataset.test(did);
}

export type ExtPackedFields = Uint32Array; // [nblocks][nfields][fields]...
export type ExtBlockCardinality = Map<string, number>;

export function pushExtPackedFields(blocks: string[], pf: PackedFields, did: string, index: PackedMetaIndex, data: ExtPackedFields, card: ExtBlockCardinality): void
{
  if (!blocks)
    return;
  if (! pf)
    throw('pushExtPackedFields: packed fields should be initialized before push');
  if (card.size != data[0])
    throw('pushExtPackedFields: packed fields and block cardinality do not match');
  if (pf.data[did])
    return; // already pushed
  let nfields = data[1];
  let pfa = allocPackedFieldsArray(nfields+1);  // field count
  pfa[0] = 0;
  for (let j = 0; j < nfields; j++) pfa[j] = 0;
    blocks.forEach((blockid: string) => {
        if (! card.has(blockid))
          throw(`pushExtPackedFields: missing blockid ${blockid} in cardinality set`);
        let x = 2 + (nfields * card.get(blockid));
        for (let i = 1; i <= nfields; i++)
          pfa[i] += (data[x++] << 0); // left shift by 0 to force unsigned to be interpreted as signed (used by prisoner-adjusted)
      });
  pf.data[did] = pfa;
}

export function featurePushExtPackedFields(f: any, did: string, index: PackedMetaIndex, data: ExtPackedFields, card: ExtBlockCardinality): void
{
  let blocks = f?.properties?.blocks || (card.has(f.properties.id) ? [ f.properties.id ] : null);
  pushExtPackedFields(blocks, f.properties.packedFields, did, index, data, card);
}

export function featurePushedExtPackedFields(f: any, did: string, card: ExtBlockCardinality): boolean
{
  if (! f) return true;
  if (f.features) return featurePushedExtPackedFields(f.features[0], did, card);
  if (!f?.properties?.blocks && !card.has(f.properties.id))
    return true;
  if (!f.properties.packedFields)
    return true;
  return !!f.properties.packedFields.data[did];
}

export function pushedExtPackedFields(pf: PackedFields, datasetids: string[]): boolean
{
  if (pf && datasetids)
    for (let i = 0; i < datasetids.length; i++)
      if (! pf.data[datasetids[i]])
        return false;
  return !!pf;
}

export function retrievePackedFields(f: any): PackedFields
{
  if (f.properties.packedFields === undefined) throw 'Feature should have pre-computed packed fields';
  return f.properties.packedFields as PackedFields;
}

// The first entry in the PackedFieldsArray aggregate is the count of items aggregated.
// Treat a null instance as just a single entry with no aggregates.
let abZero = new ArrayBuffer(8);
let afZero = new Float64Array(abZero);
afZero[0] = 0;
let pfZero = { dsGroup: {}, data: { ['']: afZero } };

export function zeroPackedFields(dsGroup: GroupPackedMetaIndex): PackedFields
{
  if (dsGroup == null) return pfZero;
  let pf: PackedFields = { dsGroup, data: {} };
  Object.keys(dsGroup).forEach(did => {
      let af = allocPackedFieldsArray(dsGroup[did].length);
      for (let i = 0; i < af.length; i++)
        af[i] = 0;
      pf.data[did] = af;
    });
  return pf;
}

export function zeroPackedCopy(pf: PackedFields): PackedFields
{
  if (pf == null) return pfZero;
  let copy: PackedFields = { dsGroup: pf.dsGroup, data: {} };
  Object.keys(pf.data).forEach(did => {
      let cf = allocPackedFieldsArray(pf.data[did].length);
      for (let i = 0; i < cf.length; i++)
        cf[i] = 0;
      copy.data[did] = cf;
    });
  return copy;
}

export function packedCopy(pf: PackedFields): PackedFields
{
  if (pf == null) return null;
  let copy: PackedFields = { dsGroup: pf.dsGroup, data: {} };
  Object.keys(pf.data).forEach(did => {
      let af = pf.data[did];
      let cf = allocPackedFieldsArray(af.length);
      for (let i = 0; i < af.length; i++)
        cf[i] = af[i];
      copy.data[did] = cf;
    });
  return copy;
}

export function aggregatePackedFields(agg: PackedFields, pf: PackedFields): PackedFields
{
  if (agg == null || pf == null) return agg;
  Object.keys(pf.data).forEach(did => {
      let af = agg.data[did];
      let sf = pf.data[did];
      if (sf && (!af || sf.length == af.length))
      {
        if (! af)
        {
          af = allocPackedFieldsArray(sf.length);
          af[0] = 0;
          for (let i = 1; i < sf.length; i++)
            af[i] = sf[i];
          agg.data[did] = af;
        }
        else
        {
          let n = af.length;
          for (let i = 1; i < n; i++)
            af[i] += sf[i];
        }
        af[0]++;  // count of aggregates
      }
    });
  return agg;
}

export function aggregateCount(agg: PackedFields): number
{
  // If we have multiple packedfieldarrays, all of them track the aggregate in zero spot.
  // So we just pick the one that happens to be come up first.
  if (!agg) return 0;
  let pfa = Util.nthProperty(agg.data) as PackedFieldsArray;
  return pfa ? pfa[0] : 0;
}

export function decrementPackedFields(agg: PackedFields, pf: PackedFields): PackedFields
{
  if (agg == null || pf == null) return agg;
  Object.keys(agg.data).forEach(did => {
      let af = agg.data[did];
      let sf = pf.data[did];
      if (sf && sf.length == af.length)
      {
        let n = af.length;
        for (let i = 1; i < n; i++)
          af[i] -= sf[i];
        af[0]++;  // count of aggregates
      }
    });
  return agg;
}

export function diffPackedFields(main: any, parts: any[]): PackedFields
{
  main = packedCopy(retrievePackedFields(main));
  if (main == null || parts == null || parts.length == 0) return null;
  parts = parts.map(retrievePackedFields);
  parts.forEach((pf: PackedFields) => decrementPackedFields(main, pf));
  return main;
}

export function getPackedField(pf: PackedFields, did: string, field: string): number
{
  if (!pf || !pf.dsGroup || !pf.dsGroup[did] || !pf.data[did]) return 0;
  let fields = pf.dsGroup[did].fields[did];
  return fields ? (fields[field] !== undefined ? pf.data[did][fields[field]] : 0) : 0;
}

export function findPackedField(pf: PackedFields, did: string, field: string): number
{
  let fields = pf.dsGroup[did].fields[did];
  return fields ? (fields[field] !== undefined ? fields[field] : -1) : -1;
}

// Utility type to simplify code that pulls from same dataset to compute some composite
export type FieldGetter = (f: string) => number;
export function fieldGetterNotLoaded(f: string): number { return undefined }

export function ToGetter(agg: PackedFields, dc: DatasetContext, did: string): FieldGetter
{
  return (field: string) => { return getPackedField(agg, did, field) };
}

export function calcShift(agg: PackedFields, dc: DatasetContext, didOld: string, didNew: string): number
{
  const getterOld = ToGetter(agg, dc, didOld);
  const getterNew = ToGetter(agg, dc, didNew);

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
