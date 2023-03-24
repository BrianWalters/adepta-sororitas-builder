import { BuilderState } from '@/reducer/state/BuilderState';
import { Model } from '@/domain/Model';
import { v4 as uuidv4 } from 'uuid';

export interface BuilderViewModel {
  totalPower: number;
  units: Array<{
    id: string;
    baseUnitId: string;
    name: string;
    imageUrl: string;
    power: number;
    keywords: string[];
    models: Array<Model & { key: string }>;
  }>;
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

function makeModelsForModelSet(
  modelSet: BuilderState['availableUnits'][0]['models'][0],
): BuilderViewModel['units'][0]['models'] {
  const models: BuilderViewModel['units'][0]['models'] = [];

  for (let i = 0; i < modelSet.count; ++i) {
    models.push({
      ...modelSet.model,
      key: uuidv4(),
    });
  }

  return models;
}

function computeModels(
  baseUnit: BuilderState['availableUnits'][0],
  selectedUnit: BuilderState['selectedUnits'][0],
) {
  return baseUnit.models.reduce<BuilderViewModel['units'][0]['models']>(
    (carry, next) => {
      if (
        next.additionalPowerCost === 0 ||
        selectedUnit.addedModels.includes(next.id)
      ) {
        return [...carry, ...makeModelsForModelSet(next)];
      }
      return carry;
    },
    [],
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
        baseUnitId: selectedUnit.baseUnitId,
        name: `${baseUnit.name} #${computerUnitNumber(array, selectedUnit)}`,
        imageUrl: baseUnit.imageUrl,
        keywords: baseUnit.keywords,
        power: computeTotalPower(state.availableUnits, [selectedUnit]),
        models: computeModels(baseUnit, selectedUnit),
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
