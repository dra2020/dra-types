// Public libraries
import * as Hash from 'object-hash';

export interface SplitBlock
{
  id?: string;
  chunkKey?: string;
  chunkList?: string[];
  chunk?: string;
  state: string;
  datasource: string;
  geoid: string;
  blocks: string[];
}

export interface SplitChunk
{
  id?: string;
  recompute?: boolean;
  splits?: string[];
}

export type DistrictToSplitBlock = { [districtID: string]: SplitBlock[] };

// Canonical hashing of splitblock data
function hash(o: any): string
{
  return Hash(o,
    { respectType: false,
      unorderedArrays: true,
      unorderedObjects: true,
      // basically, include (state,datasource,geoid,blocks[])
      excludeKeys: (k: string) => (k === 'id' || k === 'chunk' || k === 'chunkList' || k === 'chunkKey')
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

export function cacheKeyToSplit(s: string): SplitBlock
{
  let re = /^_(..)_(.*)_vfeature_([^_]+)_([^_]+)_([^_]+).geojson$/
  let a = re.exec(s);
  if (a == null) return null;
  // 0: whole string, 1: statecode, 2: datasource, 3: geoid, 4: chunk, 5: id hash
  return { id: a[5], state: a[1], datasource: a[2], geoid: a[3], chunk: a[4], blocks: null };
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
