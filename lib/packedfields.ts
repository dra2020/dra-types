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

export type PackedFieldsArray = Float64Array;
export type PackedFields = { [datasetid: string]: PackedFieldsArray };
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

export type GroupPackedMetaIndex = { [datasetid: string]: PackedMetaIndex };

export interface PrimaryDatasetKeys
{
  SHAPES?: string,
  CENSUS: string,
  VAP: string,
  ELECTION: string,
}

// This integregates the information associated with a specific state and datasource as
// well as user selections around which datasets to view. Used to propagate through UI.
export interface DatasetContext
{
  dsIndex: GroupPackedMetaIndex;
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

export function computeMetaIndex(datasetid: string, meta: DatasetsMeta): PackedMetaIndex
{
  if (meta == null) return null;
  let offset = 1; // first entry is count of aggregates
  let index: PackedMetaIndex = { length: 0, fields: {}, getDatasetField: null };
  Object.keys(meta).forEach((datasetKey: string) => {
      let dataset = meta[datasetKey];
      let fieldsIndex: PackedFieldsIndex = {};
      sortedFieldList(dataset).forEach((field: string) => {
          fieldsIndex[field] = offset++;
        });
      index.fields[datasetKey] = fieldsIndex;
    });
  index.length = offset;
  index.getDatasetField = (f: any, dataset: string, field: string): number => {
      let pf = retrievePackedFields(f);
      let groupindex = retrievePackedIndex(f);
      let datasetid = toDatasetID(dataset);
      return getPackedField(groupindex, pf, datasetid, dataset, field);
    };
  return index;
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

export function computePackedFields(f: any, index: PackedMetaIndex): PackedFields
{
  if (f.properties.packedFields) return f.properties.packedFields as PackedFields;

  let af = allocPackedFieldsArray(index.length);
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
  f.properties.packedIndex = { ['']: index };
  f.properties.packedFields = { ['']: af };  // cache here
  f.properties.getDatasetField = index.getDatasetField;

  // Major memory savings to delete this after packing
  delete f.properties.datasets;
  return f.properties.packedFields;
}

export function hasPackedFields(f: any): boolean
{
  return f.properties.packedFields !== undefined;
}

export function setPackedFields(f: any, pf: PackedFields, fIndex: any): void
{
  if (f.properties.packedFields !== undefined) throw 'Packed fields already set';
  f.properties.packedIndex = fIndex.properties.packedIndex;
  f.properties.packedFields = pf;
  f.properties.getDatasetField = fIndex.properties.getDatasetField
}

const reExtDataset = /^.*\.ds$/;
export function isExtDataset(did: string): boolean
{
  return did && reExtDataset.test(did);
}

export function toDatasetID(datasetKey: string): string
{
  return isExtDataset(datasetKey) ? datasetKey : '';
}

export type ExtPackedFields = Uint32Array; // [nblocks][nfields][fields]...
export type ExtBlockCardinality = Map<string, number>;

export function featurePushExtPackedFields(f: any, datasetid: string, index: PackedMetaIndex, data: ExtPackedFields, card: ExtBlockCardinality): void
{
  let blocks = f?.properties?.blocks || (card.has(f.properties.id) ? [ f.properties.id ] : null);
  if (!blocks)
    return;
  if (!f.properties.packedFields)
    throw('pushExtPackedFields: base datasets should be pushed first');
  if (card.size != data[0])
    throw('pushExtPackedFields: packed fields and block cardinality do not match');
  if (f.properties.packedFields[datasetid])
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
          pfa[i] += data[x++];
      });
  f.properties.packedFields[datasetid] = pfa;
  f.properties.packedIndex[datasetid] = index;
}

export function featurePushedExtPackedFields(f: any, datasetid: string, card: ExtBlockCardinality): boolean
{
  if (! f) return true;
  if (f.features) return featurePushedExtPackedFields(f.features[0], datasetid, card);
  if (!f?.properties?.blocks && !card.has(f.properties.id))
    return true;
  if (!f.properties.packedFields)
    return true;
  return !!f.properties.packedFields[datasetid];
}

export function pushedExtPackedFields(pf: PackedFields, datasetids: string[]): boolean
{
  if (pf && datasetids)
    for (let i = 0; i < datasetids.length; i++)
      if (! pf[datasetids[i]])
        return false;
  return !!pf;
}

export function retrievePackedFields(f: any): PackedFields
{
  if (f.properties.packedFields === undefined) throw 'Feature should have pre-computed packed fields';
  return f.properties.packedFields as PackedFields;
}

export function retrievePackedIndex(f: any): GroupPackedMetaIndex
{
  if (f.properties.packedIndex === undefined) throw 'Feature should have pre-computed packed index';
  return f.properties.packedIndex as GroupPackedMetaIndex;
}

// The first entry in the PackedFields aggregate is the count of items aggregated.
// Treat a null instance as just a single entry with no aggregates.
let abZero = new ArrayBuffer(8);
let afZero = new Float64Array(abZero);
afZero[0] = 0;
let pfZero = { ['']: afZero };

export function zeroPackedFields(index: GroupPackedMetaIndex): PackedFields
{
  if (index == null) return pfZero;
  let pf: PackedFields = {};
  Object.keys(index).forEach(datasetid => {
      let af = allocPackedFieldsArray(index[datasetid].length);
      for (let i = 0; i < af.length; i++)
        af[i] = 0;
      pf[datasetid] = af;
    });
  return pf;
}

export function zeroPackedCopy(pf: PackedFields): PackedFields
{
  if (pf == null) return pfZero;
  let copy: PackedFields = {};
  Object.keys(pf).forEach(datasetid => {
      let cf = allocPackedFieldsArray(pf[datasetid].length);
      for (let i = 0; i < cf.length; i++)
        cf[i] = 0;
      copy[datasetid] = cf;
    });
  return copy;
}

export function packedCopy(pf: PackedFields): PackedFields
{
  if (pf == null) return null;
  let copy: PackedFields = {};
  Object.keys(pf).forEach(datasetid => {
      let af = pf[datasetid];
      let cf = allocPackedFieldsArray(af.length);
      for (let i = 0; i < af.length; i++)
        cf[i] = af[i];
      copy[datasetid] = cf;
    });
  return copy;
}

export function aggregatePackedFields(agg: PackedFields, pf: PackedFields): PackedFields
{
  if (agg == null || pf == null) return agg;
  Object.keys(agg).forEach(datasetid => {
      let af = agg[datasetid];
      let sf = pf[datasetid];
      if (sf && sf.length == af.length)
      {
        let n = af.length;
        for (let i = 1; i < n; i++)
          af[i] += sf[i];
        af[0]++;  // count of aggregates
      }
    });
  return agg;
}

export function aggregateCount(agg: PackedFields): number
{
  if (!agg || !agg['']) return 0;
  return agg[''][0];
}

export function decrementPackedFields(agg: PackedFields, pf: PackedFields): PackedFields
{
  if (agg == null || pf == null) return agg;
  Object.keys(agg).forEach(datasetid => {
      let af = agg[datasetid];
      let sf = pf[datasetid];
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

export function getPackedField(index: GroupPackedMetaIndex, pf: PackedFields, datasetid: string, dataset: string, field: string): number
{
  if (!index || !pf || !index[datasetid] || !pf[datasetid]) return 0;
  let fields = index[datasetid].fields[dataset];
  return fields ? (fields[field] !== undefined ? pf[datasetid][fields[field]] : 0) : 0;
}

export function findPackedField(index: GroupPackedMetaIndex, pf: PackedFields, datasetid: string, dataset: string, field: string): number
{
  let fields = index[datasetid].fields[dataset];
  return fields ? (fields[field] !== undefined ? fields[field] : -1) : -1;
}

// Utility type to simplify code that pulls from same dataset to compute some composite
export type FieldGetter = (f: string) => number;
export function fieldGetterNotLoaded(f: string): number { return undefined }

export function ToGetter(agg: PackedFields, dc: DatasetContext, datasetid: string, datasetKey: string): FieldGetter
{
  return (field: string) => { return getPackedField(dc.dsIndex, agg, datasetid, datasetKey, field) };
}

export function ToGetterPvi16(agg: PackedFields, dc: DatasetContext, datasetKey: string): FieldGetter
{
  return (field: string) =>
  {
    if (field === 'R')
      return Math.round((getPackedField(dc.dsIndex, agg, '', datasetKey, 'R12') + getPackedField(dc.dsIndex, agg, '', datasetKey, 'R16')) / 2);
    if (field === 'D')
      return Math.round((getPackedField(dc.dsIndex, agg, '', datasetKey, 'D12') + getPackedField(dc.dsIndex, agg, '', datasetKey, 'D16')) / 2);
    if (field === 'Tot')
      return Math.round((
        getPackedField(dc.dsIndex, agg, '', datasetKey, 'R12') + getPackedField(dc.dsIndex, agg, '', datasetKey, 'R16') +
        getPackedField(dc.dsIndex, agg, '', datasetKey, 'D12') + getPackedField(dc.dsIndex, agg, '', datasetKey, 'D16')) / 2);
    return 0;
  };
}

export function ToGetterPvi20(agg: PackedFields, dc: DatasetContext): FieldGetter
{
  return (field: string) =>
  {
    if (field === 'R')
      return Math.round((getPackedField(dc.dsIndex, agg, '', DS_PRES2016, 'R') + getPackedField(dc.dsIndex, agg, '', DS_PRES2020, 'R')) / 2);
    if (field === 'D')
      return Math.round((getPackedField(dc.dsIndex, agg, '', DS_PRES2016, 'D') + getPackedField(dc.dsIndex, agg, '', DS_PRES2020, 'D')) / 2);
    if (field === 'Tot')
      return Math.round((
        getPackedField(dc.dsIndex, agg, '', DS_PRES2016, 'R') + getPackedField(dc.dsIndex, agg, '', DS_PRES2020, 'R') +
        getPackedField(dc.dsIndex, agg, '', DS_PRES2016, 'D') + getPackedField(dc.dsIndex, agg, '', DS_PRES2020, 'D')) / 2);
    return 0;
  };

}

export function calcShift(agg: PackedFields, dc: DatasetContext, datasetOld: string, datasetNew: string): number
{
  const didOld = toDatasetID(datasetOld);
  const didNew = toDatasetID(datasetNew);
  const getterOld = datasetOld === DS_PVI2016 ?
    ToGetterPvi16(agg, dc, datasetOld) :
    datasetOld === DS_PVI2020 ?
      ToGetterPvi20(agg, dc) :
      ToGetter(agg, dc, didOld, datasetOld);
  const getterNew = datasetNew === DS_PVI2016 ?
    ToGetterPvi16(agg, dc, datasetNew) :
    datasetNew === DS_PVI2020 ?
      ToGetterPvi20(agg, dc) :
      ToGetter(agg, dc, didNew, datasetNew);

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
