import { BuilderState } from '@/reducer/state/BuilderState';

export interface BuilderViewModel {
  totalPower: number;
  units: {
    id: string;
    name: string;
    imageUrl: string;
    power: number;
    keywords: string[];
  }[];
}

function computeTotalPower(
  availableUnits: BuilderState['availableUnits'],
  selectedUnits: BuilderState['selectedUnits'],
): number {
  return selectedUnits.reduce((carry, selectedUnit) => {
    const unit = availableUnits.find(
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
  }, 0);
}

function computerUnitNumber(
  allSelectedUnits: BuilderState['selectedUnits'],
  selectedUnit: BuilderState['selectedUnits'][0],
) {
  return (
    allSelectedUnits
      .filter((su) => su.baseUnitId === selectedUnit.baseUnitId)
      .findIndex((su) => su === selectedUnit) + 1
  );
}

function computeUnits(state: BuilderState): BuilderViewModel['units'] {
  return state.selectedUnits
    .filter((selectedUnit) =>
      state.availableUnits.find((au) => au._id === selectedUnit.baseUnitId),
    )
    .map((selectedUnit, index, array) => {
      const baseUnit = state.availableUnits.find(
        (au) => au._id === selectedUnit.baseUnitId,
      ) as BuilderState['availableUnits'][0];

      return {
        id: selectedUnit.id,
        name: `${baseUnit.name} #${computerUnitNumber(array, selectedUnit)}`,
        imageUrl: baseUnit.imageUrl,
        keywords: baseUnit.keywords,
        power: computeTotalPower(state.availableUnits, [selectedUnit]),
      };
    });
}

function compareUnitNameAlphabetically(
  a: BuilderViewModel['units'][0],
  b: BuilderViewModel['units'][0],
): number {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
}

export const makeBuilderViewModel = (state: BuilderState): BuilderViewModel => {
  return {
    totalPower: computeTotalPower(state.availableUnits, state.selectedUnits),
    units: computeUnits(state).sort(compareUnitNameAlphabetically),
  };
};
