import { BuilderState } from '@/reducer/state/BuilderState';
import {
  setAvailableUnits,
  SetAvailableUnitsAction,
} from '@/reducer/actions/setAvailableUnits';

export const makeInitialState = (): BuilderState => {
  return {
    availableUnits: [],
  };
};

type BuilderAction = SetAvailableUnitsAction;

export const builderReducer = (state: BuilderState, action: BuilderAction) => {
  switch (action.type) {
    case 'SetAvailableUnitsAction':
      return setAvailableUnits(state, action);
  }

  return state;
};
