import { BuilderState } from '@/reducer/state/BuilderState';
import {
  setAvailableUnits,
  SetAvailableUnitsAction,
} from '@/reducer/actions/setAvailableUnits';
import { addUnit, AddUnitAction } from '@/reducer/actions/addUnit';
import { addModels, AddModelsAction } from '@/reducer/actions/addModels';
import {
  removeModels,
  RemoveModelsAction,
} from '@/reducer/actions/removeModels';
import {
  setWargearOption,
  SetWargearOptionAction,
} from '@/reducer/actions/setWargearOption';
import { attachUnit, AttachUnitAction } from '@/reducer/actions/attachUnit';
import { detachUnit, DetachUnitAction } from '@/reducer/actions/detachUnit';

export const makeInitialState = (): BuilderState => {
  return {
    availableUnits: [],
    selectedUnits: [],
  };
};

type BuilderAction =
  | SetAvailableUnitsAction
  | AddUnitAction
  | AddModelsAction
  | RemoveModelsAction
  | SetWargearOptionAction
  | AttachUnitAction
  | DetachUnitAction;

export const builderReducer = (state: BuilderState, action: BuilderAction) => {
  switch (action.type) {
    case 'SetAvailableUnitsAction':
      return setAvailableUnits(state, action);
    case 'AddUnitAction':
      return addUnit(state, action);
    case 'AddModelsAction':
      return addModels(state, action);
    case 'RemoveModelsAction':
      return removeModels(state, action);
    case 'SetWargearOptionAction':
      return setWargearOption(state, action);
    case 'AttachUnitAction':
      return attachUnit(state, action);
    case 'DetachUnitAction':
      return detachUnit(state, action);
  }

  return state;
};
