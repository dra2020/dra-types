import * as G from './groups';

// For use in UI. Keys are used in JSON.
export interface DatasetField
{
  shortCaption: string,  // Typically 2-4 letters
  longCaption: string,   // Can be longer descriptive phrase, especially for combinations
  order?: number,        // For ordering fields in UI
  isCombo?: boolean,     // Built-in, for census combos
  colorBy?: boolean,     // For extended datasets, display in UI
  sumOf?: string[],      // Only for import processing
  key?: string,          // Only for import processing, reset field key away from import data
}
export function sortFields(f1: DatasetField, f2: DatasetField): number
{
  return (f1.order || 0) - (f2.order || 0);
}

export function formColorBy(datasetid: string, field: string): string
{
  return `${datasetid}:${field}`
}

export function parseColorBy(colorby: string): { datasetid: string, field: string }
{
  if (colorby)
  {
    let a = colorby.split(':');
    if (a?.length == 2)
      return { datasetid: a[0], field: a[1] };
  }
  return { datasetid: '', field: '' };
}

export function isColorBy(colorby: string): boolean
{
  let {datasetid, field} = parseColorBy(colorby);
  return !!datasetid && !!field;
}

// For Partisan fields, expect keys of 'D', 'R' and 'Tot'
// For Demographic Fields, expect keys of 'Tot', 'Wh', 'Bl', 'His', 'AsnPI', 'Nat', 'Oth',
//  'Asn', 'Pac', 'OthAl', 'Mix', 'BlC', 'NatC', 'AsnC', 'PacC', 
export type DatasetFields = { [key: string]: DatasetField };

export interface DatasetColor {
  shortCaption: string,
  longCaption: string,
  expr: string,
  colors: string,
  stops: string,
  };
export type DatasetColors = DatasetColor[];

export interface DatasetFormat {
  shortCaption: string,
  longCaption: string,
  expr: string,
  numberFormat?: string,  // (locale|integer|general|currency).precision
  };
export type DatasetFormats = DatasetFormat[];

export interface DatasetMeta
{
  type: string,                         // demographic | election | pvi | other
  year: number,                         // 4 digit year
  title: string,                        // title displayed in UI
  builtin?: string,                     // builtin key for builtin datasets
  description?: string,                 // longer description
  office?: string,                      // pres | comp | sc | sen | con | tre | sos | ltgov | gov | ag and more
  subtype?: string,                     // always general?
  votingAge?: boolean,                  // true => VAP or CVAP; false => Total population (from Census or ACS or Adjusted)
  nhAlone?: boolean,                    // Non-Hispanic Alone demographic variant
  privateKey?: string,                  // Old-style semi-private datasets
  restrict?: { [key: string]: boolean },  // export, display, duplicate (true => function is not allowed)
  members?: { [key: number]: string },  // For composites, specifies 
  fields?: DatasetFields,
  colors?: DatasetColors,               // Optional colorby expressions
  formats?: DatasetFormats,             // Optional format expressions
  displayPercent?: boolean,             // True if details should auto include percent
  hideHeading?: boolean,                // True if details should hide heading row
}

export type DatasetsMeta = { [dataset: string]: DatasetMeta };

// Database Record
export interface Dataset
{
  id: string,
  name?: string,
  description?: string,
  createdBy?: string,
  createTime?: string,
  modifyTime?: string,
  deleted?: boolean,
  expunged?: boolean,
  expungeDate?: string,
  published?: string,
  official?: boolean,
  builtin?: string,
  state?: string,
  datasource?: string,
  dotmap?: boolean,
  blobid?: string,
  dataid?: string,
  meta?: DatasetsMeta,
  groups?: G.GroupMapIndex,
  labels?: string[],
  labelupdate?: { [name: string]: boolean|null }, // just for update purposes, not stored
}

export function datasetRestrict(ds: Dataset): { [key: string]: boolean }
{
   if (ds && ds.id && ds.meta && ds.meta[ds.id] && ds.meta[ds.id].restrict)
    return ds.meta[ds.id].restrict;
  return null;
}

// Index of database records
export type DatasetIndex = { [id: string]: Dataset };

export interface PrimaryKeys { CENSUS: string, VAP: string, ELECTION: string };
export function defaultBuiltinKeys(state: string, datasource: string, planType: string, builtins: Set<string>): PrimaryKeys
{
  function bestOf(a: string[]): string { return a.find(s => builtins.has(s)) }

  return (datasource === '2020_VD')
    ? {
        CENSUS:   bestOf((usesPrisonerAdjust(state, datasource, planType)
                          ? ['D20FA', 'D20F', 'D19F', 'D18F']
                          : ['D20F', 'D19F', 'D18F'])),
        VAP:      bestOf(['D20T', 'D19T', 'D18T']),
        ELECTION: bestOf(['C16GCO', 'E20GPR', 'E16GPR'])
      }
    :
      {
        CENSUS:   bestOf(['D10F', 'D16F']),
        VAP:      bestOf(['D10T', 'D16T']),
        ELECTION: bestOf(['C16GCO', 'E20GPR', 'E16GPR', 'E08GPR'])
      }
}

// Hard-coded based on both the existence of the dataset and the legal requirements of that particular state
// (e.g. NY uses for state house maps but not congressional maps). So that is why we hard-code rather than
// derive from dataset metadata.
//
export function usesPrisonerAdjust(state: string, datasource: string, planType: string): boolean
{
  if (datasource !== '2020_VD') return false;
  switch (state)
  {
    case 'CA':
    case 'DE':
    case 'MD':
    case 'NJ':
    case 'NV':
    case 'PA':
    case 'VA':
    case 'WA':
      return (planType === 'congress' || planType === 'upper' || planType === 'lower' || planType === 'coi');
    case 'CO':
    case 'CT':
    case 'NY':
      return (planType === 'upper' || planType === 'lower' || planType === 'coi');
  }
  return false;
}
