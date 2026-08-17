// Human-readable name for a state code that may be a "+NJ+NY" multi-state code. Kept separate from
// multistate.ts (which is dependency-free) because it reaches into StateNameMap.

import { StateNameMap } from './csv';
import { isMultiState, baseStatesOf } from './multistate';

// Full display name: member state names joined ("New Jersey + New York"), or the single-state name.
export function stateDisplayName(stateCode: string): string {
  if (isMultiState(stateCode))
    return baseStatesOf(stateCode).map(s => StateNameMap[s] || s).join(' + ');
  return StateNameMap[stateCode] || stateCode;
}
