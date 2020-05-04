export interface SplitBlock {
    id?: string;
    chunkKey?: string;
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
