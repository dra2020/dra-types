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

// Type of redistricting plan (Note: 'upper' is used when there is only 1 legislative map or body)
// congress, upper, lower and other => the plan is for entire state
// county and city => plan is for a single county or city within a state
export type PlanType = 'congress' | 'upper' | 'lower' | 'county' | 'city' | 'coi' | 'other';
