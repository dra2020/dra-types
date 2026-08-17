// Encoding utilities for multi-state identifiers.
//
// A multi-state code is a leading "+" followed by 2..6 tokens joined by "+". The same structure is
// used for three kinds of identifier, which differ only in what the tokens are:
//   - a multi-state STATE code:   "+NJ+NY"        tokens are USPS state codes, in canonical (sorted) order
//   - a multi-state DATASET id:   "+<id>+<id>"    tokens are single-state dataset ids, aligned by position
//                                                 to the states of the map's state code
//   - a multi-state BUILTIN key:  "+D20F+D20F"    tokens are single-state builtin keys, aligned the same way
//
// Tokens never contain "+", so a plain split on "+" is unambiguous. These routines are deliberately
// dependency-light (no other dra-types imports) so they can be used from both client and server.

export const MULTI_PREFIX = "+";

/** True for any multi-state identifier (state code, dataset id, or builtin key). */
export function isMultiState(code: string): boolean {
  return !!code && code[0] === MULTI_PREFIX;
}

/** Split a multi-state identifier into its tokens (["NJ","NY"] for "+NJ+NY"). For a non-multi (single)
 *  identifier, returns a one-element array with the identifier unchanged. */
export function multiStateParts(code: string): string[] {
  return isMultiState(code) ? code.slice(MULTI_PREFIX.length).split(MULTI_PREFIX) : [code];
}

/** Join tokens into a multi-state identifier ("+NJ+NY"). Order is preserved (callers that need
 *  canonical ordering — state codes — must sort first; dataset/builtin ids are positional). */
export function makeMultiState(tokens: string[]): string {
  return MULTI_PREFIX + tokens.join(MULTI_PREFIX);
}

/** The base state codes a (single- or multi-) state code refers to: ["NJ","NY"] for "+NJ+NY",
 *  ["TX"] for "TX". */
export function baseStatesOf(stateCode: string): string[] {
  return multiStateParts(stateCode);
}

/**
 * Build a multi-state identifier aligned to `stateCode` by applying `fn` per position. Used to map a
 * multi-state builtin/aligned value against its states — e.g. mapping "+D20F+D20F" over "+NJ+NY" to
 * the per-state dataset uids "+<njUid>+<nyUid>". `aligned` must have the same number of tokens as
 * `stateCode` (both are multi-state) — otherwise the extra/missing positions are undefined.
 */
export function mapMultiAligned(stateCode: string, aligned: string, fn: (state: string, token: string) => string): string {
  const states = multiStateParts(stateCode);
  const tokens = multiStateParts(aligned);
  return makeMultiState(states.map((s, i) => fn(s, tokens[i])));
}
