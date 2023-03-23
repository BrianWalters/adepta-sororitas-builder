import { BuilderState } from '@/reducer/state/BuilderState';
import {
  setAvailableUnits,
  SetAvailableUnitsAction,
} from '@/reducer/actions/setAvailableUnits';
import { addUnit, AddUnitAction } from '@/reducer/actions/addUnit';

export const makeInitialState = (): BuilderState => {
  return {
    availableUnits: [],
    selectedUnits: [],
  };
};

type BuilderAction = SetAvailableUnitsAction | AddUnitAction;

export const builderReducer = (state: BuilderState, action: BuilderAction) => {
  switch (action.type) {
    case 'SetAvailableUnitsAction':
      return setAvailableUnits(state, action);
    case 'AddUnitAction':
      return addUnit(state, action);
  }

  return state;
};
