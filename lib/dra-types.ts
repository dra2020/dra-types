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

export type DistrictToSplitBlock = { [nDistrict: number]: SplitBlock[] };

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
