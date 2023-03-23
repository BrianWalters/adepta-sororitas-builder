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
  console.log(action.units);
  return {
    ...state,
    availableUnits: action.units,
  };
};
