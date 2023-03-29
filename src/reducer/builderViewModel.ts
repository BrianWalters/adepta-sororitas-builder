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
import { WargearOption } from '@/domain/WargearOption';

type WargearViewModel = (Wargear | Weapon) & { addedFromOption?: boolean };

export type ModelViewModel = Model & {
  key: string;
  wargear: Array<WargearViewModel>;
};

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
    [key: string]: WargearOption;
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
    for (let modelIndex = 0; modelIndex < this.models.length; ++modelIndex) {
      const wargearOptionStates =
        this.getWargearOptionSelectionsFor(modelIndex);
      if (wargearOptionStates.length === 0) {
        yield this.models[modelIndex];
        continue;
      }

      for (
        let wargearOptionStateIndex = 0;
        wargearOptionStateIndex < wargearOptionStates.length;
        ++wargearOptionStateIndex
      ) {
        const wargearOptionState = wargearOptionStates[wargearOptionStateIndex];

        if (
          this.doesWargearOptionApplyToModel(modelIndex, wargearOptionState)
        ) {
          this.applyWargearOptionToModel(modelIndex, wargearOptionState);
        }
      }

      yield this.models[modelIndex];
    }
  }

  private doesWargearOptionApplyToModel(
    index: number,
    wargearOptionState: WargearOptionState,
  ): boolean {
    const wargearOptionDefinition =
      this.wargearDefinitions[wargearOptionState.optionId];
    return this.doesModelHaveValidWargearToRemoveForOption(
      wargearOptionDefinition,
      index,
    );
  }

  private applyWargearOptionToModel(
    modelIndex: number,
    wargearOptionState: WargearOptionState,
  ): void {
    wargearOptionState.count--;
    const wargearOptionDefinition =
      this.wargearDefinitions[wargearOptionState.optionId];
    wargearOptionDefinition.wargearRemoved.forEach((wargearIdToRemove) => {
      this.models[modelIndex].wargear.splice(
        this.models[modelIndex].wargear.findIndex(
          (wg) => wg._id === wargearIdToRemove,
        ),
        1,
      );
    });

    this.models[modelIndex] = {
      ...this.models[modelIndex],
      wargear: [
        ...this.models[modelIndex].wargear,
        ...this.getWargearToAddFor(wargearOptionState),
      ],
    };
  }

  private getWargearOptionSelectionsFor(modelIndex: number) {
    return this.wargearOptionSelections.filter(
      (wargearOption) =>
        wargearOption.count > 0 &&
        this.wargearDefinitions[wargearOption.optionId].modelId ===
          this.models[modelIndex]._id,
    );
  }

  private doesModelHaveValidWargearToRemoveForOption(
    wargearOptionDefinition: WargearOption,
    modelIndex: number,
  ) {
    return wargearOptionDefinition.wargearRemoved.every((wargearId) =>
      this.models[modelIndex].wargear.find((wg) => wg._id === wargearId),
    );
  }

  private getWargearToAddFor(
    wargearOptionState: WargearOptionState,
  ): WargearViewModel[] {
    const wargearOptionDefinition =
      this.wargearDefinitions[wargearOptionState.optionId];
    const choice = wargearOptionDefinition.wargearChoices.find(
      (choice) => choice.id === wargearOptionState.choiceId,
    );

    if (!choice) return [];

    return choice.wargearAdded.map((wargear) => {
      return {
        ...wargear,
        addedFromOption: true,
      };
    });
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
