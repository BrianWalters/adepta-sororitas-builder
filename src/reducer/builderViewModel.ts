import {
  BuilderState,
  SelectedUnitState,
  WargearOptionState,
} from '@/reducer/state/BuilderState';
import { Model } from '@/domain/Model';
import { v4 as uuidv4 } from 'uuid';
import { Wargear } from '@/domain/Wargear';
import { Weapon } from '@/domain/Weapon';
import { UnitDetail } from '@/domain/UnitDetail';

type ModelViewModel = Model & { key: string; wargear: Array<Wargear | Weapon> };

type UnitViewModel = {
  id: string;
  baseUnitId: string;
  name: string;
  imageUrl: string;
  power: number;
  keywords: string[];
  models: ModelViewModel[];
};

export interface BuilderViewModel {
  totalPower: number;
  units: UnitViewModel[];
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
  baseUnit: BuilderState['availableUnits'][0],
): BuilderViewModel['units'][0]['models'] {
  const models: BuilderViewModel['units'][0]['models'] = [];

  for (let i = 0; i < modelSet.count; ++i) {
    models.push({
      ...modelSet.model,
      key: uuidv4(),
      wargear: [...baseUnit.defaultWeapons],
    });
  }

  return models;
}

class ModelWargearAdjuster {
  private wargearOptionSelections: WargearOptionState[];
  private wargearDefinitions: {
    [key: string]: UnitDetail['wargearOptions'][0];
  } = {};

  constructor(
    private baseUnit: UnitDetail,
    private selectedUnit: SelectedUnitState,
    private models: ModelViewModel[],
  ) {
    this.wargearOptionSelections = structuredClone(selectedUnit.wargearOptions);
    baseUnit.wargearOptions.forEach((wargearOption) => {
      this.wargearDefinitions[wargearOption.id] = wargearOption;
    });
  }

  public *makeGenerator(): Generator<ModelViewModel> {
    for (let i = 0; i < this.models.length; ++i) {
      const wargearOptionState = this.wargearOptionSelections.find(
        (wargearOption) =>
          wargearOption.count > 0 &&
          this.wargearDefinitions[wargearOption.optionId].modelId ===
            this.models[i]._id,
      );
      if (!wargearOptionState) {
        yield this.models[i];
        continue;
      }
      wargearOptionState.count--;

      const wargearOptionDefinition =
        this.wargearDefinitions[wargearOptionState.optionId];

      const wargearRemoved = this.models[i].wargear.filter(
        (wargear) =>
          !wargearOptionDefinition.wargearRemoved.includes(wargear._id),
      );

      const wargearToAdd = wargearOptionDefinition.wargearChoices.find(
        (choice) => choice.id === wargearOptionState.choiceId,
      );
      if (!wargearToAdd) {
        yield this.models[i];
        continue;
      }

      yield {
        ...this.models[i],
        wargear: [...wargearRemoved, ...wargearToAdd.wargearAdded],
      };
    }
  }
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
        models: makeModelsForUnit(baseUnit, selectedUnit),
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
