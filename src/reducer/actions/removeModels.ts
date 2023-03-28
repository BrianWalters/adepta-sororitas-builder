import { BuilderState } from '@/reducer/state/BuilderState';

export interface RemoveModelsAction {
  type: 'RemoveModelsAction';
  selectedUnitId: string;
  modelSetId: string;
}

export const removeModels = (
  state: BuilderState,
  action: RemoveModelsAction,
): BuilderState => {
  return {
    ...state,
    selectedUnits: state.selectedUnits.map((selectedUnit) => {
      if (selectedUnit.id === action.selectedUnitId) {
        return {
          ...selectedUnit,
          addedModels: selectedUnit.addedModels.filter(
            (modelSetId) => modelSetId !== action.modelSetId,
          ),
        };
      }

      return selectedUnit;
    }),
  };
};
