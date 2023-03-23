import { BuilderState } from '@/reducer/state/BuilderState';

export interface AddUnitAction {
  type: 'AddUnitAction';
  id: string | undefined;
}

export const addUnit = (
  state: BuilderState,
  action: AddUnitAction,
): BuilderState => {
  const unit = state.availableUnits.find((unit) => unit._id === action.id);
  if (!unit) return state;

  return {
    ...state,
    selectedUnits: [...state.selectedUnits, JSON.parse(JSON.stringify(unit))],
  };
};
