import * as DT from './dra-types';

export interface StateYearInfo
{
  population: number,
  congress: {nDistricts: number},  
  upper: {nDistricts: number},  
  lower?: {nDistricts: number},  
}

export interface StateInfo
{
  '2010_VD': StateYearInfo,
  '2020_VD': StateYearInfo,
}

export const StatePlanInfoMap: {[key: string]: StateInfo} = {
  "AL": {"2010_VD": {population: 4779736, congress: {nDistricts: 7}, upper: {nDistricts: 35}, lower: {nDistricts: 105}}, "2020_VD": { population: 0, congress: {nDistricts: 7}, upper: {nDistricts: 35}, lower: {nDistricts: 105}}},
  "AK": {"2010_VD": {population: 710231, congress: {nDistricts: 1}, upper: {nDistricts: 20}, lower: {nDistricts: 40}}, "2020_VD": {population: 0, congress: {nDistricts: 1}, upper: {nDistricts: 20}, lower: {nDistricts: 40}}},
  "AZ": {"2010_VD": {population: 6392017, congress: {nDistricts: 9}, upper: {nDistricts: 30}}, "2020_VD": {population: 6, congress: {nDistricts: 9}, upper: {nDistricts: 30}}},
  "AR": {"2010_VD": {population: 2915918, congress: {nDistricts: 4}, upper: {nDistricts: 35}, lower: {nDistricts: 100}}, "2020_VD": {population: 6, congress: {nDistricts: 4}, upper: {nDistricts: 35}, lower: {nDistricts: 100}}},
  "CA": {"2010_VD": {population: 37253956, congress: {nDistricts: 53}, upper: {nDistricts: 40}, lower: {nDistricts: 80}}, "2020_VD": {population: 6, congress: {nDistricts: 52}, upper: {nDistricts: 40}, lower: {nDistricts: 80}}},
  "CO": {"2010_VD": {population: 5029196, congress: {nDistricts: 7}, upper: {nDistricts: 35}, lower: {nDistricts: 65}}, "2020_VD": {population: 6, congress: {nDistricts: 8}, upper: {nDistricts: 35}, lower: {nDistricts: 65}}},
  "CT": {"2010_VD": {population: 3574097, congress: {nDistricts: 5}, upper: {nDistricts: 36}, lower: {nDistricts: 151}}, "2020_VD": {population: 6, congress: {nDistricts: 5}, upper: {nDistricts: 36}, lower: {nDistricts: 151}}},
  "DE": {"2010_VD": {population: 897934, congress: {nDistricts: 1}, upper: {nDistricts: 21}, lower: {nDistricts: 41}}, "2020_VD": {population: 6, congress: {nDistricts: 1}, upper: {nDistricts: 21}, lower: {nDistricts: 41}}},
  "FL": {"2010_VD": {population: 18801310, congress: {nDistricts: 27}, upper: {nDistricts: 40}, lower: {nDistricts: 120}}, "2020_VD": {population: 6, congress: {nDistricts: 28}, upper: {nDistricts: 40}, lower: {nDistricts: 120}}},
  "GA": {"2010_VD": {population: 9687653, congress: {nDistricts: 14}, upper: {nDistricts: 56}, lower: {nDistricts: 180}}, "2020_VD": {population: 6, congress: {nDistricts: 14}, upper: {nDistricts: 56}, lower: {nDistricts: 180}}},
  "HI": {"2010_VD": {population: 1360301, congress: {nDistricts: 2}, upper: {nDistricts: 25}, lower: {nDistricts: 51}}, "2020_VD": {population: 6, congress: {nDistricts: 2}, upper: {nDistricts: 25}, lower: {nDistricts: 51}}},
  "ID": {"2010_VD": {population: 1567582, congress: {nDistricts: 2}, upper: {nDistricts: 35}}, "2020_VD": {population: 6, congress: {nDistricts: 2}, upper: {nDistricts: 35}}},
  "IL": {"2010_VD": {population: 12830632, congress: {nDistricts: 18}, upper: {nDistricts: 59}, lower: {nDistricts: 118}}, "2020_VD": {population: 6, congress: {nDistricts: 17}, upper: {nDistricts: 59}, lower: {nDistricts: 118}}},
  "IN": {"2010_VD": {population: 6483802, congress: {nDistricts: 9}, upper: {nDistricts: 50}, lower: {nDistricts: 100}}, "2020_VD": {population: 6, congress: {nDistricts: 9}, upper: {nDistricts: 50}, lower: {nDistricts: 100}}},
  "IA": {"2010_VD": {population: 3046355, congress: {nDistricts: 4}, upper: {nDistricts: 50}, lower: {nDistricts: 100}}, "2020_VD": {population: 6, congress: {nDistricts: 4}, upper: {nDistricts: 50}, lower: {nDistricts: 100}}},
  "KS": {"2010_VD": {population: 2853118, congress: {nDistricts: 4}, upper: {nDistricts: 40}, lower: {nDistricts: 125}}, "2020_VD": {population: 6, congress: {nDistricts: 4}, upper: {nDistricts: 40}, lower: {nDistricts: 125}}},
  "KY": {"2010_VD": {population: 4339367, congress: {nDistricts: 6}, upper: {nDistricts: 38}, lower: {nDistricts: 100}}, "2020_VD": {population: 6, congress: {nDistricts: 6}, upper: {nDistricts: 38}, lower: {nDistricts: 100}}},
  "LA": {"2010_VD": {population: 4533372, congress: {nDistricts: 6}, upper: {nDistricts: 39}, lower: {nDistricts: 105}}, "2020_VD": {population: 6, congress: {nDistricts: 6}, upper: {nDistricts: 39}, lower: {nDistricts: 105}}},
  "ME": {"2010_VD": {population: 1328361, congress: {nDistricts: 2}, upper: {nDistricts: 35}, lower: {nDistricts: 151}}, "2020_VD": {population: 6, congress: {nDistricts: 2}, upper: {nDistricts: 35}, lower: {nDistricts: 151}}},
  "MD": {"2010_VD": {population: 5773552, congress: {nDistricts: 8}, upper: {nDistricts: 47}, lower: {nDistricts: 67}}, "2020_VD": {population: 6, congress: {nDistricts: 8}, upper: {nDistricts: 47}, lower: {nDistricts: 67}}},
  "MA": {"2010_VD": {population: 6547629, congress: {nDistricts: 9}, upper: {nDistricts: 40}, lower: {nDistricts: 160}}, "2020_VD": {population: 6, congress: {nDistricts: 9}, upper: {nDistricts: 40}, lower: {nDistricts: 160}}},
  "MI": {"2010_VD": {population: 9883640, congress: {nDistricts: 14}, upper: {nDistricts: 38}, lower: {nDistricts: 110}}, "2020_VD": {population: 6, congress: {nDistricts: 13}, upper: {nDistricts: 38}, lower: {nDistricts: 110}}},
  "MN": {"2010_VD": {population: 5303925, congress: {nDistricts: 8}, upper: {nDistricts: 67}, lower: {nDistricts: 134}}, "2020_VD": {population: 6, congress: {nDistricts: 8}, upper: {nDistricts: 67}, lower: {nDistricts: 134}}},
  "MS": {"2010_VD": {population: 2967297, congress: {nDistricts: 4}, upper: {nDistricts: 52}, lower: {nDistricts: 122}}, "2020_VD": {population: 6, congress: {nDistricts: 4}, upper: {nDistricts: 52}, lower: {nDistricts: 122}}},
  "MO": {"2010_VD": {population: 5988927, congress: {nDistricts: 8}, upper: {nDistricts: 34}, lower: {nDistricts: 163}}, "2020_VD": {population: 6, congress: {nDistricts: 8}, upper: {nDistricts: 34}, lower: {nDistricts: 163}}},
  "MT": {"2010_VD": {population: 989415, congress: {nDistricts: 1}, upper: {nDistricts: 50}, lower: {nDistricts: 100}}, "2020_VD": {population: 6, congress: {nDistricts: 2}, upper: {nDistricts: 50}, lower: {nDistricts: 100}}},
  "NE": {"2010_VD": {population: 1826341, congress: {nDistricts: 3}, upper: {nDistricts: 49}}, "2020_VD": {population: 6, congress: {nDistricts: 3}, upper: {nDistricts: 49}}},
  "NV": {"2010_VD": {population: 2700551, congress: {nDistricts: 4}, upper: {nDistricts: 21}, lower: {nDistricts: 42}}, "2020_VD": {population: 6, congress: {nDistricts: 4}, upper: {nDistricts: 21}, lower: {nDistricts: 42}}},
  "NH": {"2010_VD": {population: 1316470, congress: {nDistricts: 2}, upper: {nDistricts: 24}, lower: {nDistricts: 161}}, "2020_VD": {population: 6, congress: {nDistricts: 2}, upper: {nDistricts: 24}, lower: {nDistricts: 164}}},
  "NJ": {"2010_VD": {population: 8791894, congress: {nDistricts: 12}, upper: {nDistricts: 40}}, "2020_VD": {population: 6, congress: {nDistricts: 12}, upper: {nDistricts: 40}}},
  "NM": {"2010_VD": {population: 2059179, congress: {nDistricts: 3}, upper: {nDistricts: 42}, lower: {nDistricts: 70}}, "2020_VD": {population: 6, congress: {nDistricts: 3}, upper: {nDistricts: 42}, lower: {nDistricts: 70}}},
  "NY": {"2010_VD": {population: 19378102, congress: {nDistricts: 27}, upper: {nDistricts: 63}, lower: {nDistricts: 150}}, "2020_VD": {population: 6, congress: {nDistricts: 26}, upper: {nDistricts: 63}, lower: {nDistricts: 150}}},
  "NC": {"2010_VD": {population: 9535483, congress: {nDistricts: 13}, upper: {nDistricts: 50}, lower: {nDistricts: 120}}, "2020_VD": {population: 6, congress: {nDistricts: 14}, upper: {nDistricts: 50}, lower: {nDistricts: 120}}},
  "ND": {"2010_VD": {population: 672591, congress: {nDistricts: 1}, upper: {nDistricts: 47}}, "2020_VD": {population: 6, congress: {nDistricts: 1}, upper: {nDistricts: 47}, lower: {nDistricts: 49}}},
  "OH": {"2010_VD": {population: 11536504, congress: {nDistricts: 16}, upper: {nDistricts: 33}, lower: {nDistricts: 99}}, "2020_VD": {population: 6, congress: {nDistricts: 15}, upper: {nDistricts: 33}, lower: {nDistricts: 99}}},
  "OK": {"2010_VD": {population: 3751351, congress: {nDistricts: 5}, upper: {nDistricts: 48}, lower: {nDistricts: 101}}, "2020_VD": {population: 6, congress: {nDistricts: 5}, upper: {nDistricts: 48}, lower: {nDistricts: 101}}},
  "OR": {"2010_VD": {population: 3831074, congress: {nDistricts: 5}, upper: {nDistricts: 30}, lower: {nDistricts: 60}}, "2020_VD": {population: 6, congress: {nDistricts: 6}, upper: {nDistricts: 30}, lower: {nDistricts: 60}}},
  "PA": {"2010_VD": {population: 12702379, congress: {nDistricts: 18}, upper: {nDistricts: 50}, lower: {nDistricts: 203}}, "2020_VD": {population: 6, congress: {nDistricts: 17}, upper: {nDistricts: 50}, lower: {nDistricts: 203}}},
  "RI": {"2010_VD": {population: 1052567, congress: {nDistricts: 2}, upper: {nDistricts: 38}, lower: {nDistricts: 75}}, "2020_VD": {population: 6, congress: {nDistricts: 2}, upper: {nDistricts: 38}, lower: {nDistricts: 75}}},
  "SC": {"2010_VD": {population: 4625364, congress: {nDistricts: 7}, upper: {nDistricts: 46}, lower: {nDistricts: 124}}, "2020_VD": {population: 6, congress: {nDistricts: 7}, upper: {nDistricts: 46}, lower: {nDistricts: 124}}},
  "SD": {"2010_VD": {population: 814180, congress: {nDistricts: 1}, upper: {nDistricts: 35}, lower: {nDistricts: 37}}, "2020_VD": {population: 6, congress: {nDistricts: 1}, upper: {nDistricts: 35}, lower: {nDistricts: 37}}},
  "TN": {"2010_VD": {population: 6346105, congress: {nDistricts: 9}, upper: {nDistricts: 33}, lower: {nDistricts: 99}}, "2020_VD": {population: 6, congress: {nDistricts: 9}, upper: {nDistricts: 33}, lower: {nDistricts: 99}}},
  "TX": {"2010_VD": {population: 25145561, congress: {nDistricts: 36}, upper: {nDistricts: 31}, lower: {nDistricts: 150}}, "2020_VD": {population: 6, congress: {nDistricts: 38}, upper: {nDistricts: 31}, lower: {nDistricts: 150}}},
  "UT": {"2010_VD": {population: 2763885, congress: {nDistricts: 4}, upper: {nDistricts: 29}, lower: {nDistricts: 75}}, "2020_VD": {population: 6, congress: {nDistricts: 4}, upper: {nDistricts: 29}, lower: {nDistricts: 75}}},
  "VT": {"2010_VD": {population: 625741, congress: {nDistricts: 1}, upper: {nDistricts: 13}, lower: {nDistricts: 104}}, "2020_VD": {population: 6, congress: {nDistricts: 1}, upper: {nDistricts: 13}, lower: {nDistricts: 104}}},
  "VA": {"2010_VD": {population: 8001024, congress: {nDistricts: 11}, upper: {nDistricts: 40}, lower: {nDistricts: 100}}, "2020_VD": {population: 6, congress: {nDistricts: 11}, upper: {nDistricts: 40}, lower: {nDistricts: 100}}},
  "WA": {"2010_VD": {population: 6724540, congress: {nDistricts: 10}, upper: {nDistricts: 49}}, "2020_VD": {population: 6, congress: {nDistricts: 10}, upper: {nDistricts: 49}}},
  "WV": {"2010_VD": {population: 1852994, congress: {nDistricts: 3}, upper: {nDistricts: 17}, lower: {nDistricts: 67}}, "2020_VD": {population: 6, congress: {nDistricts: 2}, upper: {nDistricts: 17}, lower: {nDistricts: 100}}},
  "WI": {"2010_VD": {population: 5686986, congress: {nDistricts: 8}, upper: {nDistricts: 33}, lower: {nDistricts: 99}}, "2020_VD": {population: 6, congress: {nDistricts: 8}, upper: {nDistricts: 33}, lower: {nDistricts: 99}}},
  "WY": {"2010_VD": {population: 563626, congress: {nDistricts: 1}, upper: {nDistricts: 30}, lower: {nDistricts: 60}}, "2020_VD": {population: 6, congress: {nDistricts: 1}, upper: {nDistricts: 31}, lower: {nDistricts: 62}}},
  "DC": {"2010_VD": {population: 601723, congress: {nDistricts: 1}, upper: {nDistricts: 8}}, "2020_VD": {population: 6, congress: {nDistricts: 1}, upper: {nDistricts: 8}}},
  "PR": {"2010_VD": {population: 0, congress: {nDistricts: 1}, upper: {nDistricts: 1}}, "2020_VD": {population: 0, congress: {nDistricts: 1}, upper: {nDistricts: 1}}},
};

export function hasPlanType(stateCode: string, planType: DT.PlanType, is2020?: boolean): boolean
{
  // handle unicameral states (hence no lower house districts)
  if ((stateCode === 'NE' || stateCode === 'DC') && planType === 'lower')
    return false;

  // handle states with only 1 congressional district (hence no plan)
  if (planType === 'congress' &&
    (stateCode === 'AK' || stateCode === 'DE' || stateCode === 'ND' || stateCode === 'SD' || stateCode === 'VT' || stateCode === 'WY' || stateCode === 'DC' ||
    (stateCode === 'MT' && !is2020)))
  {
    return false;
  }

  if (planType === 'county' || planType === 'city')
    return false;

  return true;
}

export function hasOneLegislativePlanBothHouses(stateCode: string): boolean
{
  return stateCode === 'AZ' || stateCode === 'ID' || stateCode === 'NJ' || stateCode === 'WA';
}

export function getPlanDistrictCount(stateCode: string, planType: DT.PlanType, datasource: string): number
{
  if (planType === 'coi')
    return 1;
  if (datasource === '2016_BG')
    datasource = '2010_VD';
  if ((datasource !== '2010_VD' && datasource !== '2020_VD') || (planType !== 'congress' && planType !== 'upper' && planType !== 'lower'))
    return 0;
  
  const stateYearInfo: StateYearInfo = StatePlanInfoMap[stateCode][datasource as ('2010_VD' | '2020_VD')];
  return stateYearInfo && stateYearInfo[planType] ? stateYearInfo[planType]['nDistricts'] : 0;
}

// TODO: This is not currently used (3/2/21). 2020_VD population numbers are not set; update them when apportionment happens 
export function getStateYearTotalPop(stateCode: string, datasource: string): number
{
  if (datasource === '2016_BG')
    datasource = '2010_VD';
  if ((datasource !== '2010_VD' && datasource !== '2020_VD'))
    return 0;

  const stateYearInfo: StateYearInfo = StatePlanInfoMap[stateCode][datasource as ('2010_VD' | '2020_VD')];
  return stateYearInfo ? stateYearInfo['population'] : 0;
}

export function inferPlanType(stateCode: string, datasource: string, nDistricts: number, flex?: boolean): DT.PlanType
{
  // Intended for datasource === '2020_VD'
  const congressCount: number = getPlanDistrictCount(stateCode, 'congress', datasource);
  const upperCount: number = getPlanDistrictCount(stateCode, 'upper', datasource);
  const lowerCount: number = getPlanDistrictCount(stateCode, 'lower', datasource);
  return (
    ((flex && nDistricts <= congressCount + 2 && nDistricts >= congressCount - 3) || nDistricts == congressCount) ? 'congress' :
    (nDistricts == upperCount) ? 'upper' :
    (nDistricts == lowerCount) ? 'lower' :
    'other');
}
