export interface Comment {
    userid: string;
    text: string;
    date: string;
    recommend: number;
}
export interface CommentList {
    id?: string;
    [commentid: string]: Comment | string;
}
export declare type LikeKind = 'like' | 'love' | 'wow' | 'angry' | 'funny';
export interface Like {
    date: string;
    kind: LikeKind;
}
export interface LikeList {
    id?: string;
    [userid: string]: Like | string;
}
export interface UserLikes {
    id?: string;
    [aid: string]: Like | string;
}
export interface SplitBlock {
    id?: string;
    chunk?: string;
    state: string;
    datasource: string;
    geoid: string;
    blocks: string[];
}
export declare type DistrictToSplitBlock = {
    [districtID: string]: SplitBlock[];
};
export declare function vgeoidToGeoid(vgeoid: string): string;
export declare function vgeoidToChunk(vgeoid: string): string;
export declare function vgeoidToHash(vgeoid: string): string;
export declare function isVfeature(geoid: string): boolean;
export declare function splitToCacheKey(s: SplitBlock): string;
export declare function splitToChunkKey(s: SplitBlock): string;
export declare function splitToPrefix(s: SplitBlock): string;
export declare function cacheKeysToChunkHash(keys: string[]): string;
export declare function canonicalDistrictID(districtID: string): string;
export declare function canonicalSortingDistrictID(districtID: string): string;
export declare function canonicalNumericFromDistrictID(districtID: string): number;
export declare function canonicalDistrictIDFromNumber(districtID: string, n: number): string;
export declare type DistrictOrder = {
    [districtID: string]: number;
};
export declare function canonicalDistrictIDOrdering(order: DistrictOrder): DistrictOrder;
