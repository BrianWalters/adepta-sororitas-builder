import { BuilderState, SelectedUnitState } from '@/reducer/state/BuilderState';
import { v4 as uuidv4 } from 'uuid';
import { UnitDetail } from '@/domain/UnitDetail';
import { BuilderViewModel, UnitViewModel } from '@/reducer/BuilderViewModel';
import { ModelWargearAdjuster } from '@/reducer/modelWargearAdjuster';

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
  baseUnit: BuilderState['availableUnits'][0],
): BuilderViewModel['units'][0]['models'] {
  const models: BuilderViewModel['units'][0]['models'] = [];

  for (let i = 0; i < modelSet.count; ++i) {
    models.push({
      ...modelSet.model,
      key: uuidv4(),
      wargear: structuredClone(baseUnit.defaultWeapons),
    });
  }

  return models;
}

function makeModelsForUnit(
  baseUnit: UnitDetail,
  selectedUnit: SelectedUnitState,
) {
  const defaultModelViewModels = baseUnit.models.reduce<
    BuilderViewModel['units'][0]['models']
  >((carry, next) => {
    if (
      next.additionalPowerCost === 0 ||
      selectedUnit.addedModels.includes(next.id)
    ) {
      return [...carry, ...makeModelsForModelSet(next, baseUnit)];
    }
    return carry;
  }, []);

  const modelWargearAdjuster = new ModelWargearAdjuster(
    baseUnit,
    selectedUnit,
    defaultModelViewModels,
  );

  return Array.from(modelWargearAdjuster.makeGenerator());
}

function computeUnits(state: BuilderState): BuilderViewModel['units'] {
  const unitViewModels: UnitViewModel[] = state.selectedUnits
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
        models: makeModelsForUnit(baseUnit, selectedUnit),
        attachedUnits: [],
        canAttachTo: [],
      };
    });

  const hostUnitsOptions = unitViewModels
    .filter(
      (unitViewModel) =>
        unitViewModel.keywords.includes('Infantry') &&
        !unitViewModel.keywords.includes('Character'),
    )
    .map((unitViewModel) => {
      return {
        id: unitViewModel.id,
        name: unitViewModel.name,
      };
    });

  unitViewModels.forEach((unitViewModel) => {
    if (unitViewModel.keywords.includes('Character'))
      unitViewModel.canAttachTo = hostUnitsOptions;
  });

  state.selectedUnits.forEach((unit, index, array) => {
    const unitId = unit.id;
    const hostUnit = array.find((unit) => unit.attachedUnits.includes(unitId));
    if (hostUnit) {
      const hostUnitViewModel = unitViewModels.find(
        (unitViewModel) => unitViewModel.id === hostUnit.id,
      );
      const attachedViewModel = unitViewModels.splice(
        unitViewModels.findIndex(
          (unitViewModel) => unitViewModel.id === unitId,
        ),
        1,
      );
      if (!hostUnitViewModel || !attachedViewModel) return;
      hostUnitViewModel.attachedUnits.push(attachedViewModel[0]);
    }
  });

  return unitViewModels;
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
