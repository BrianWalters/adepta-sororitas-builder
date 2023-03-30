import {
  SelectedUnitState,
  WargearOptionState,
} from '@/reducer/state/BuilderState';
import { WargearOption } from '@/domain/WargearOption';
import { UnitDetail } from '@/domain/UnitDetail';
import { ModelViewModel, WargearViewModel } from '@/reducer/BuilderViewModel';

export class ModelWargearAdjuster {
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
    modelIndex: number,
    wargearOptionState: WargearOptionState,
  ): boolean {
    const wargearOptionDefinition =
      this.wargearDefinitions[wargearOptionState.optionId];
    return (
      this.doesModelHaveValidWargearToRemoveForOption(
        wargearOptionDefinition,
        modelIndex,
      ) &&
      this.doesModelHaveRequirementsForOption(
        wargearOptionDefinition,
        modelIndex,
      )
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

    this.lockRequiredWargearFor(modelIndex, wargearOptionState);
  }

  private lockRequiredWargearFor(
    modelIndex: number,
    wargearOptionState: WargearOptionState,
  ): void {
    const wargearOptionDefinition =
      this.wargearDefinitions[wargearOptionState.optionId];

    this.models[modelIndex].wargear.forEach((wargear) => {
      if (wargearOptionDefinition.wargearRequirements.includes(wargear._id))
        wargear.isLocked = true;
    });
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
  ): boolean {
    return wargearOptionDefinition.wargearRemoved.every((wargearId) => {
      const foundWargear = this.models[modelIndex].wargear.find(
        (wg) => wg._id === wargearId,
      );
      return foundWargear && !foundWargear.isLocked;
    });
  }

  private doesModelHaveRequirementsForOption(
    wargearOptionDefinition: WargearOption,
    modelIndex: number,
  ): boolean {
    if (wargearOptionDefinition.wargearRequirements.length === 0) return true;

    return wargearOptionDefinition.wargearRequirements.every((wargearId) =>
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
