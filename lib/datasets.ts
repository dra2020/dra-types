// For use in UI. Keys are used in JSON.
export interface DatasetField
{
  shortCaption: string,  // Typically 2-4 letters
  longCaption: string,   // Can be longer descriptive phrase, especially for combinations
  order?: number,        // For ordering fields in UI
  isCombo?: boolean,     // Built-in, for census combos
  colorBy?: boolean,     // For extended datasets
  invert?: boolean,      // For extended datasets, colorby inverted
  sumOf?: string[],      // Only for import processing
}
export function sortFields(f1: DatasetField, f2: DatasetField): number
{
  return (f1.order || 0) - (f2.order || 0);
}

// For Partisan fields, expect keys of 'D', 'R' and 'Tot'
// For Demographic Fields, expect keys of 'Tot', 'Wh', 'Bl', 'His', 'AsnPI', 'Nat', 'Oth',
//  'Asn', 'Pac', 'OthAl', 'Mix', 'BlC', 'NatC', 'AsnC', 'PacC', 
export type DatasetFields = { [key: string]: DatasetField };

export interface DatasetMeta
{
  type: string,                         // demographic | election | pvi | other
  year: number,                         // 4 digit year
  title: string,                        // title displayed in UI
  description?: string,                 // longer description
  office?: string,                      // pres | comp | sc | sen | con | tre | sos | ltgov | gov | ag
  subtype?: string,                     // always general?
  votingAge?: boolean,                  // Filtered demographic variant
  nhAlone?: boolean,                    // Demographic variant
  privateKey?: string,                  // Old-style semi-private datasets
  members?: { [key: number]: string },  // For composites, specifies 
  fields?: DatasetFields,
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
  published?: string,
  official?: boolean,
  state?: string,
  datasource?: string,
  dotmap?: boolean,
  meta?: DatasetsMeta,
}

// Index of database records
export type DatasetIndex = { [id: string]: Dataset };
