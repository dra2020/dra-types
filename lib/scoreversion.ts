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
// Shapes are re-scored on demand when a consumer finds them below the version it needs; nothing
// sweeps the fleet on a bump.
export const ScoreVersion = '5';

/**
 * The version at which per-district dataset aggregates appeared - NOT the current version.
 *
 * This is what a client asks the server to rescore to when it finds shapes lacking district data. It
 * is deliberately a separate constant that does not move when ScoreVersion does: a later bump for an
 * unrelated schema change should not make every layer map force a fresh rescore of every map it
 * displays. A rescore always produces the current ScoreVersion, which satisfies this minimum.
 */
export const ScoreVersionDistrictData = '5';

/** True if a district-shape collection carries the per-district dataset aggregates. */
export function scoreHasDistrictData(col: any): boolean
{
  // Compared numerically: a lexical compare would put '10' below '5' the first time the version
  // reaches two digits.
  return !!col && col.scoreVersion !== undefined && Number(col.scoreVersion) >= Number(ScoreVersionDistrictData);
}
