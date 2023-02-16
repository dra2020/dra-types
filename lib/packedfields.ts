export type PackedFields = Float64Array;

export function allocPackedFields(length: number): PackedFields
{
  let ab = new ArrayBuffer(8 * length);
  let af = new Float64Array(ab);
  return af;
}

// The first entry in the PackedFields aggregate is the count of items aggregated.
// Treat a null instance as just a single entry with no aggregates.
let abZero = new ArrayBuffer(8);
let afZero = new Float64Array(abZero);
afZero[0] = 0;

export function zeroPackedCopy(pf: PackedFields): PackedFields
{
  if (pf == null) return afZero;
  let af = allocPackedFields(pf.length);
  for (let i = 0; i < af.length; i++)
    af[i] = 0;
  return af;
}

export function packedCopy(pf: PackedFields): PackedFields
{
  if (pf == null) return null;
  let af = allocPackedFields(pf.length);
  for (let i = 0; i < pf.length; i++)
    af[i] = pf[i];
  return af;
}

export function aggregatePackedFields(agg: PackedFields, pf: PackedFields): PackedFields
{
  if (agg == null || pf == null) return agg;
  if (agg.length != pf.length)
  {
    return agg; // bug, but don't crash
    //throw 'aggregatePackedFields: unexpected length mismatch';
  }
  let n = agg.length;
  for (let i = 1; i < n; i++)
    agg[i] += pf[i];
  agg[0]++; // count of number of aggregates
  return agg;
}
