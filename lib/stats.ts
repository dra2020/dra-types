// In constrast to logging, the stats manager is responsible for tracking live server status.
// The results are stored in a compact database record which can be easily queried for current
// status. Each server instance maintains its own field in the overall "values" record in the
// stats database. The reporting tool aggregates all instances to report overall server activity.
//
// There are basically three kinds of values:
//  Sum - we want to sum the value across all server instances (e.g. number of connnected clients)
//  Avg - we just take average across all server instances (e.g. memory heap size)
//  Rate - we want to track the rate of some activity over some time period
//

export type ValType = number;
export const ValTypeSum = 0;
export const ValTypeAvg = 1;
export const ValTypeRate = 2;

const ExpiryAge = 1000 * 60 * 60 * 24;  // throw away instance record after this time period

export function statExpiryTime(): string
{
  let time = new Date();
  time.setTime(time.getTime() + ExpiryAge);
  return time.toJSON();
}

export interface StatRecord
{
  id: string;
  production: boolean;
  expires: string;
  time: string;
  index: StatEntryIndex;
}

export type StatEntry = StatValue | StatRate;

export type StatEntryIndex = { [name: string]: StatEntry };

export interface StatValue
{
  valType?: ValType;
  cur?: number;
  min?: number;
  max?: number;
  tot?: number;
  cnt?: number;
}

export interface StatRate
{
  valType?: ValType;
  thisMin?: number;
  lastMin?: number;
  thisHour?: number;
  lastHour?: number;
  thisDay?: number;
  lastDay?: number;
}

// Aggregate running value. This applies both in memory (logging multiple times before
// saving to database) as well as aggregating into an instance structure in the DB.

export function statValueRecord(sv: StatValue, cur: number, valType: ValType): StatValue
{
  if (sv === undefined) sv = {};
  if (sv.min === undefined || cur < sv.min)
    sv.min = cur;
  if (sv.max === undefined || cur > sv.max)
    sv.max = cur;
  sv.cur = cur;
  sv.valType = valType;
  return sv;
}

export function statRateIncr(sr: StatRate, incr: number = 1): StatRate
{
  if (sr == null) sr = {};
  sr.valType = ValTypeRate;
  sr.thisMin = sr.thisMin === undefined ? incr : sr.thisMin+incr;
  sr.thisHour = sr.thisHour === undefined ? incr : sr.thisHour+incr;
  sr.thisDay = sr.thisDay === undefined ? incr : sr.thisDay+incr;
  return sr;
}

export const OneMinute = 1000 * 60;
export const OneHour = OneMinute * 60;
export const OneDay = OneHour * 24;

export function statRateRollover(sr: StatRate, period: number): void
{
  if ((period % OneMinute) == 0)
  {
    sr.lastMin = sr.thisMin;
    sr.thisMin = 0;
  }
  if ((period % OneHour) == 0)
  {
    sr.lastHour = sr.thisHour;
    sr.thisHour = 0;
  }
  if ((period % OneDay) == 0)
  {
    sr.lastDay = sr.thisDay;
    sr.thisDay = 0;
  }
}

export function statEntryIndexMerge(accum: StatEntryIndex, si: StatEntryIndex): StatEntryIndex
{
  if (accum == null) accum = {};

  // We just discard and replace old rate information
  Object.keys(accum).forEach((p: string) => { if (accum[p].valType == ValTypeRate) delete accum[p] });

  // But merge in all the other values
  Object.keys(si).forEach((p: string) => {
      let se = si[p];
      if (se.valType == ValTypeRate)
        accum[p] = se;
      else
      {
        let sv = se as StatValue;
        accum[p] = statValueRecord(se as StatValue, sv.cur, sv.valType);
      }
    });
  return accum;
}

export function statEntryIndexRollover(si: StatEntryIndex, period: number): void
{
  Object.keys(si).forEach((p: string) => {
      let se = si[p];
      if (se.valType == ValTypeRate)
        statRateRollover(se as StatRate, period);
    });
}

export function statRecordMerge(accum: StatRecord, si: StatRecord): StatRecord
{
  if (accum == null)
    accum = { id: si.id, production: si.production, time: si.time, expires: si.expires, index: {} };
  accum.expires = si.expires;
  accum.time = si.time;
  statEntryIndexMerge(accum.index, si.index);
  return accum;
}

// Accumulate a set of values together (e.g. from multiple running instances)
// for reporting current state.
//

export function statValueAccum(accum: StatValue, sv: StatValue): StatEntry
{
  if (accum == null)
  {
    accum = {};
    accum.valType = sv.valType;
  }
  if (accum.min === undefined || sv.min < accum.min)
    accum.min = sv.min;
  if (accum.max === undefined || sv.max > accum.max)
    accum.max = sv.max;
  if (accum.valType === undefined)
    accum.valType = sv.valType;
  if (accum.valType == ValTypeSum)
    accum.cur = (accum.cur === undefined ? sv.cur : accum.cur+sv.cur);
  else if (accum.valType == ValTypeAvg)
  {
    accum.tot = (accum.tot === undefined ? 0 : accum.tot) + sv.cur;
    accum.cnt = (accum.cnt === undefined ? 0 : accum.cnt) + 1;
    accum.cur = accum.tot / accum.cnt;
  }
  return accum;
}

export function statRateAccum(accum: StatRate, sr: StatRate): StatRate
{
  if (accum == null)
  {
    accum = {};
    accum.valType = sr.valType;
  }
  accum.thisMin = accum.thisMin === undefined ? sr.thisMin : (accum.thisMin + (sr.thisMin === undefined ? 0 : sr.thisMin));
  accum.lastMin = accum.lastMin === undefined ? sr.lastMin : (accum.lastMin + (sr.lastMin === undefined ? 0 : sr.lastMin));
  accum.thisHour = accum.thisHour === undefined ? sr.thisHour : (accum.thisHour + (sr.thisHour === undefined ? 0 : sr.thisHour));
  accum.lastHour = accum.lastHour === undefined ? sr.lastHour : (accum.lastHour + (sr.lastHour === undefined ? 0 : sr.lastHour));
  accum.thisDay = accum.thisDay === undefined ? sr.thisDay : (accum.thisDay + (sr.thisDay === undefined ? 0 : sr.thisDay));
  accum.lastDay = accum.lastDay === undefined ? sr.lastDay : (accum.lastDay + (sr.lastDay === undefined ? 0 : sr.lastDay));
  return accum;
}

export function statIndexAccum(accum: StatEntryIndex, si: StatEntryIndex): StatEntryIndex
{
  if (accum == null) accum = {};
  Object.keys(si).forEach((p: string) => {
      let se = si[p];
      if (se.valType == ValTypeRate)
        accum[p] = statRateAccum(accum[p] as StatRate, se as StatRate);
      else
        accum[p] = statValueAccum(accum[p] as StatValue, se as StatValue);
    });
  return accum;
}
