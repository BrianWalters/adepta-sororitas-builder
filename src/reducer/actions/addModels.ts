import { BuilderState } from '@/reducer/state/BuilderState';

export interface AddModelsAction {
  type: 'AddModelsAction';
  selectedUnitId: string;
  modelSetId: string;
}

export const addModels = (
  state: BuilderState,
  action: AddModelsAction,
): BuilderState => {
  const unitId = state.selectedUnits.find(
    (su) => su.id === action.selectedUnitId,
  )?.baseUnitId;
  const baseUnit = state.availableUnits.find((au) => au._id === unitId);
  if (
    baseUnit &&
    baseUnit.models.find((modelSet) => modelSet.id === action.modelSetId)
      ?.additionalPowerCost === 0
  )
    return state;

  return {
    ...state,
    selectedUnits: state.selectedUnits.map((selectedUnit) => {
      if (selectedUnit.id === action.selectedUnitId) {
        return {
          ...selectedUnit,
          addedModels: selectedUnit.addedModels.includes(action.modelSetId)
            ? selectedUnit.addedModels
            : [...selectedUnit.addedModels, action.modelSetId],
        };
      }

      return selectedUnit;
    }),
  };
};
