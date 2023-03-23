import { UnitDetail } from '@/domain/UnitDetail';
import { BuilderState } from '@/reducer/state/BuilderState';

export interface SetAvailableUnitsAction {
  type: 'SetAvailableUnitsAction';
  units: UnitDetail[];
}

export const setAvailableUnits = (
  state: BuilderState,
  action: SetAvailableUnitsAction,
): BuilderState => {
  return {
    ...state,
    availableUnits: action.units,
  };
};
