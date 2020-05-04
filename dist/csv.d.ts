import * as VF from './vfeature';
export declare type BlockMap = {
    [id: string]: number;
};
export declare type BlockMapping = {
    [id: string]: string;
};
export declare function canonicalDistrictID(districtID: string): string;
export declare function canonicalSortingDistrictID(districtID: string): string;
export declare function canonicalNumericFromDistrictID(districtID: string): number;
export declare function canonicalDistrictIDFromNumber(districtID: string, n: number): string;
export declare type DistrictOrder = {
    [districtID: string]: number;
};
export declare function canonicalDistrictIDGapFill(keys: string[]): string[];
export declare function canonicalDistrictIDOrdering(order: DistrictOrder): DistrictOrder;
export interface OneCSVLine {
    geoid: string;
    districtID: string;
}
export declare function parseCSVLine(line: string): OneCSVLine;
export interface ConvertResult {
    inBlockMap: BlockMapping;
    inStateMap: BlockMapping;
    outValid: boolean;
    outState: string;
    outMap: BlockMapping;
    outOrder: DistrictOrder;
    outDistrictToSplit: VF.DistrictToSplitBlock;
}
export declare function blockmapToState(blockMap: BlockMapping): string;
export declare function blockmapToVTDmap(blockMap: BlockMapping, stateMap: BlockMapping): ConvertResult;
export declare const GEOIDToState: any;
export declare const StateToGEOID: any;
export declare function geoidToState(geoid: string): string;
export declare type StateUrls = ('alabama' | 'alaska' | 'arizona' | 'arkansas' | 'california' | 'colorado' | 'connecticut' | 'delaware' | 'florida' | 'georgia' | 'hawaii' | 'idaho' | 'illinois' | 'indiana' | 'iowa' | 'kansas' | 'kentucky' | 'louisiana' | 'maine' | 'maryland' | 'massachusetts' | 'michigan' | 'minnesota' | 'mississippi' | 'missouri' | 'montana' | 'nebraska' | 'nevada' | 'new-hampshire' | 'new-jersey' | 'new-mexico' | 'new-york' | 'north-carolina' | 'north-dakota' | 'ohio' | 'oklahoma' | 'oregon' | 'pennsylvania' | 'rhode-island' | 'south-carolina' | 'south-dakota' | 'tennessee' | 'texas' | 'utah' | 'vermont' | 'virginia' | 'washington' | 'west-virginia' | 'wisconsin' | 'wyoming');
export declare type ValidStateUrlsType = {
    readonly [stateUrl in StateUrls]: boolean;
};
export declare function isStateUrl(s: any): s is StateUrls;
