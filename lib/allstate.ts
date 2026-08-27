// The "AA" pseudo-state: a multi-state layer map.
//
// A map with state code "AA" owns no geography. Its districts are the districts of the maps added to
// it as user layers, merged into a single collection (see dra-client/src/dflayerdistricts.ts). Its
// datasource is an ordinary one - typically 2020_VD - and says which maps may be layered onto it,
// since only plans on the same datasource can be aggregated together.
//
// "AA" is deliberately absent from StateCodesOrdered and StateNameMap so it can never appear in an
// ordinary state picker; it is reachable only through the New Multi-State Layer Map command.
//
// Kept dependency-free so both client and server can use it.

export const ALL_STATES = 'AA';

/** Shown where a state name would be. */
export const ALL_STATES_NAME = 'All States';

/** Short form, for the locked state field in the settings dialog. */
export const ALL_STATES_LABEL = 'All';

export function isAllStates(stateCode: string): boolean
{
  return stateCode === ALL_STATES;
}

// The continental US, used to frame a layer map before (or instead of) fitting its layers' own
// bounds. Deliberately excludes AK, HI and PR: including them yields a view in which the lower 48 is
// too small to work with, and a layer map is nearly always mostly continental.
export const CONTINENTAL_US_BOUNDS = { left: -124.8, right: -66.9, top: 49.4, bottom: 24.4 };
