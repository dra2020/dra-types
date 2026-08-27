// Human-readable name for a state code that may be a "+NJ+NY" multi-state code. Kept separate from
// multistate.ts (which is dependency-free) because it reaches into StateNameMap.

import { StateNameMap } from './csv';
import { isMultiState, baseStatesOf } from './multistate';
import { isAllStates, ALL_STATES_NAME } from './allstate';

// Full display name: member state names joined ("New Jersey + New York"), or the single-state name.
export function stateDisplayName(stateCode: string): string {
  if (isAllStates(stateCode))
    return ALL_STATES_NAME;
  if (isMultiState(stateCode))
    return baseStatesOf(stateCode).map(s => StateNameMap[s] || s).join(' + ');
  return StateNameMap[stateCode] || stateCode;
}
