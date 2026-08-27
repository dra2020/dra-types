// Version of the district-shape blob schema.
//
// The blob at sessionProps.xprops.geojsonName is written by BOTH fn-all/src/buildscore.ts (server
// scoring) and dra-client/src/mapmodel.ts districtShapesForExport (client scoring), to the same key.
// They must therefore agree on its schema, which is why this constant lives here rather than being
// declared separately in each - a duplicate that drifted is what left fullscorescan.ts stuck on an
// older value than buildscore.ts.
//
// '5' added, for multi-state layer maps:
//   - per-district dataset aggregates, as [name]_[field] properties
//   - `mapcolor`, the assigned district color (vs `color`, which may be the evaluated color-by-data)
//   - `contiguous`, authoritative per-district contiguity from real precinct contiguity
//   - a collection-level `datasets` descriptor and this `scoreVersion`
//
// '6' widened and labelled that dataset set:
//   - EVERY dataset the map carries is aggregated and flattened, not just the primary CENSUS / VAP /
//     ELECTION keys. At '5' the server wrote only the primary keys while the client wrote everything
//     it had fetched, so the same map scored on the two sides produced different blobs.
//   - a collection-level `primaryDatasets` header naming which of them the map treats as primary
//
// Shapes are re-scored on demand when a consumer finds them below the version it needs; nothing
// sweeps the fleet on a bump.
export const ScoreVersion = '6';

/**
 * The version at which per-district dataset aggregates appeared - NOT the current version.
 *
 * This is what a client asks the server to rescore to when it finds shapes lacking district data. It
 * is deliberately a separate constant that does not move when ScoreVersion does: a later bump for an
 * unrelated schema change should not make every layer map force a fresh rescore of every map it
 * displays. A rescore always produces the current ScoreVersion, which satisfies this minimum.
 */
export const ScoreVersionDistrictData = '5';

/**
 * The version at which the aggregates cover every dataset and `primaryDatasets` appeared.
 *
 * Separate from ScoreVersionDistrictData for the same reason that one is separate from ScoreVersion:
 * a consumer that only needs district aggregates must not be made to force a rescore because a later
 * version carries more of them. Ask for this one only when a non-primary dataset, or knowing which
 * datasets a map treats as primary, is actually required.
 */
export const ScoreVersionAllDatasets = '6';

/** Names, within a collection's `datasets` descriptor, of the datasets a map treats as primary. */
export interface ShapePrimaryDatasets
{
  CENSUS: string;
  VAP: string;
  ELECTION: string;
}

// Compared numerically: a lexical compare would put '10' below '5' the first time the version reaches
// two digits.
function scoreAtLeast(col: any, version: string): boolean
{
  return !!col && col.scoreVersion !== undefined && Number(col.scoreVersion) >= Number(version);
}

/** True if a district-shape collection carries the per-district dataset aggregates. */
export function scoreHasDistrictData(col: any): boolean
{
  return scoreAtLeast(col, ScoreVersionDistrictData);
}

/**
 * True if a district-shape collection's aggregates cover every dataset its map carries, rather than
 * only the primary keys, and it names those primary keys.
 */
export function scoreHasAllDatasets(col: any): boolean
{
  return scoreAtLeast(col, ScoreVersionAllDatasets);
}

/**
 * The primary dataset names a collection declares, or null if it predates the header.
 *
 * The names are keys into the collection's `datasets` descriptor and the prefixes of its flattened
 * `[name]_[field]` properties - the builtin key for a builtin dataset, the dataset id for a custom
 * one - so they mean the same thing across states without any per-state metadata.
 */
export function scorePrimaryDatasets(col: any): ShapePrimaryDatasets
{
  let p = col ? (col as any).primaryDatasets : null;
  return p ? p as ShapePrimaryDatasets : null;
}
