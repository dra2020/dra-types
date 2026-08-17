// Static adjacency for the contiguous 48 states + DC, used to constrain multi-state selection (a
// multi-state map is 2..6 mutually contiguous states from this set). Dependency-light (only imports
// the sibling multistate encoding) so it can be used from both client and server. Four Corners
// point-contacts are intentionally NOT adjacencies (AZ-CO and UT-NM share only a point, not a border).

import { makeMultiState } from "./multistate";

// Per-state neighbor lists. Symmetrized at load, so an edge present in one direction is enough.
const ADJACENCY_SOURCE: { [state: string]: string[] } = {
  AL: ["FL", "GA", "MS", "TN"],
  AR: ["LA", "MO", "MS", "OK", "TN", "TX"],
  AZ: ["CA", "NV", "NM", "UT"],
  CA: ["AZ", "NV", "OR"],
  CO: ["KS", "NE", "NM", "OK", "UT", "WY"],
  CT: ["MA", "NY", "RI"],
  DC: ["MD", "VA"],
  DE: ["MD", "NJ", "PA"],
  FL: ["AL", "GA"],
  GA: ["AL", "FL", "NC", "SC", "TN"],
  IA: ["IL", "MN", "MO", "NE", "SD", "WI"],
  ID: ["MT", "NV", "OR", "UT", "WA", "WY"],
  IL: ["IA", "IN", "KY", "MO", "WI"],
  IN: ["IL", "KY", "MI", "OH"],
  KS: ["CO", "MO", "NE", "OK"],
  KY: ["IL", "IN", "MO", "OH", "TN", "VA", "WV"],
  LA: ["AR", "MS", "TX"],
  MA: ["CT", "NH", "NY", "RI", "VT"],
  MD: ["DC", "DE", "PA", "VA", "WV"],
  ME: ["NH"],
  MI: ["IN", "OH", "WI"],
  MN: ["IA", "ND", "SD", "WI"],
  MO: ["AR", "IA", "IL", "KS", "KY", "NE", "OK", "TN"],
  MS: ["AL", "AR", "LA", "TN"],
  MT: ["ID", "ND", "SD", "WY"],
  NC: ["GA", "SC", "TN", "VA"],
  ND: ["MN", "MT", "SD"],
  NE: ["CO", "IA", "KS", "MO", "SD", "WY"],
  NH: ["MA", "ME", "VT"],
  NJ: ["DE", "NY", "PA"],
  NM: ["AZ", "CO", "OK", "TX"],
  NV: ["AZ", "CA", "ID", "OR", "UT"],
  NY: ["CT", "MA", "NJ", "PA", "VT"],
  OH: ["IN", "KY", "MI", "PA", "WV"],
  OK: ["AR", "CO", "KS", "MO", "NM", "TX"],
  OR: ["CA", "ID", "NV", "WA"],
  PA: ["DE", "MD", "NJ", "NY", "OH", "WV"],
  RI: ["CT", "MA"],
  SC: ["GA", "NC"],
  SD: ["IA", "MN", "MT", "ND", "NE", "WY"],
  TN: ["AL", "AR", "GA", "KY", "MO", "MS", "NC", "VA"],
  TX: ["AR", "LA", "NM", "OK"],
  UT: ["AZ", "CO", "ID", "NV", "WY"],
  VA: ["DC", "KY", "MD", "NC", "TN", "WV"],
  VT: ["MA", "NH", "NY"],
  WA: ["ID", "OR"],
  WI: ["IA", "IL", "MI", "MN"],
  WV: ["KY", "MD", "OH", "PA", "VA"],
  WY: ["CO", "ID", "MT", "NE", "SD", "UT"],
};

function buildAdjacency(): { [state: string]: Set<string> } {
  const adj: { [state: string]: Set<string> } = {};
  Object.keys(ADJACENCY_SOURCE).forEach((s) => { adj[s] = adj[s] || new Set<string>(); });
  Object.keys(ADJACENCY_SOURCE).forEach((s) => {
    ADJACENCY_SOURCE[s].forEach((n) => {
      adj[s].add(n);
      (adj[n] = adj[n] || new Set<string>()).add(s);   // symmetrize
    });
  });
  return adj;
}

const ADJACENCY = buildAdjacency();

/** The contiguous-48 + DC state codes, sorted. */
export const CONTIGUOUS_STATES: string[] = Object.keys(ADJACENCY).sort();

/** Neighbors of a state (contiguous-48 + DC only). */
export function neighborsOf(state: string): string[] {
  return ADJACENCY[state] ? Array.from(ADJACENCY[state]).sort() : [];
}

/** True if `state` is one of the contiguous-48 + DC. */
export function isContiguousState(state: string): boolean {
  return !!ADJACENCY[state];
}

export const MULTISTATE_MIN = 2;
export const MULTISTATE_MAX = 6;

/** True if every state is contiguous-48/DC and the set forms one connected region (edge-adjacent). */
export function areStatesContiguous(states: string[]): boolean {
  const set = new Set(states);
  if (set.size < 1) return false;
  for (const s of set) if (!isContiguousState(s)) return false;
  const start = set.values().next().value as string;
  const seen = new Set<string>([start]);
  const stack = [start];
  while (stack.length) {
    const cur = stack.pop() as string;
    ADJACENCY[cur].forEach((n) => { if (set.has(n) && !seen.has(n)) { seen.add(n); stack.push(n); } });
  }
  return seen.size === set.size;
}

/** A valid multi-state selection: 2..6 distinct contiguous-48/DC states forming a connected region. */
export function isValidMultiStateSelection(states: string[]): boolean {
  const set = new Set(states);
  if (set.size !== states.length) return false;                       // no duplicates
  if (set.size < MULTISTATE_MIN || set.size > MULTISTATE_MAX) return false;
  return areStatesContiguous(states);
}

/** The canonical multi-state code ("+NJ+NY") for a valid selection; throws if the selection is
 *  invalid. States are sorted so the encoding is canonical regardless of pick order. */
export function canonicalMultiStateCode(states: string[]): string {
  if (!isValidMultiStateSelection(states)) throw new Error(`Invalid multi-state selection: ${states.join(",")}`);
  return makeMultiState(Array.from(new Set(states)).sort());
}
