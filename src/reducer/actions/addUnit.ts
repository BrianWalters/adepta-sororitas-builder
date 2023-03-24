import { BuilderState } from '@/reducer/state/BuilderState';
import { v4 as uuidv4 } from 'uuid';

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
    selectedUnits: [
      ...state.selectedUnits,
      {
        baseUnitId: unit._id,
        id: uuidv4(),
        addedModels: [],
        addedWargearChoices: [],
      },
    ],
  };
};
