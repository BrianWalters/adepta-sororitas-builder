import { BuilderState } from '@/reducer/state/BuilderState';

export interface BuilderViewModel {
  totalPower: number;
}

export const makeBuilderViewModel = (state: BuilderState): BuilderViewModel => {
  return {
    totalPower: state.selectedUnits.reduce((carry, selectedUnit) => {
      const unit = state.availableUnits.find(
        (au) => au._id === selectedUnit.baseUnitId,
      );
      const additionalPower = unit
        ? selectedUnit.addedModels.reduce((carry, modelSetId) => {
            const modelSet = unit.models.find(
              (modelSet) => modelSet.id === modelSetId,
            );
            return carry + (modelSet ? modelSet.additionalPowerCost : 0);
          }, 0)
        : 0;
      return carry + additionalPower + (unit ? unit.power : 0);
    }, 0),
  };
};
