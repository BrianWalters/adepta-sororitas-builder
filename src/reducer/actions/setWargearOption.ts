import { BuilderState } from '@/reducer/state/BuilderState';
import { UnitDetail } from '@/domain/UnitDetail';

export interface SetWargearOptionAction {
  type: 'SetWargearOptionAction';
  selectedUnitId: string;
  wargearOptionId: string;
  wargearChoiceId: string;
  count?: number;
}

function computeCount(
  wargearOption: UnitDetail['wargearOptions'][0],
  action: SetWargearOptionAction,
): number {
  return action.count ? Math.min(action.count, wargearOption.limit) : 1;
}

function handleExistingOption(
  selectedUnit: BuilderState['selectedUnits'][0],
  baseUnitWargearOption: UnitDetail['wargearOptions'][0],
  action: SetWargearOptionAction,
): BuilderState['selectedUnits'][0]['wargearOptions'] {
  if (action.count === 0) {
    return selectedUnit.wargearOptions.filter(
      (selectedUnitWargearOption) =>
        selectedUnitWargearOption.optionId !== action.wargearOptionId,
    );
  }

  return selectedUnit.wargearOptions.map((selectedUnitWargearOption) => {
    if (selectedUnitWargearOption.optionId !== action.wargearOptionId)
      return selectedUnitWargearOption;

    return {
      ...selectedUnitWargearOption,
      choiceId: action.wargearChoiceId,
      count: computeCount(baseUnitWargearOption, action),
    };
  });
}

export const setWargearOption = (
  state: BuilderState,
  action: SetWargearOptionAction,
) => {
  return {
    ...state,
    selectedUnits: state.selectedUnits.map((selectedUnit) => {
      if (selectedUnit.id === action.selectedUnitId) {
        const baseUnit = state.availableUnits.find(
          (au) => au._id === selectedUnit.baseUnitId,
        );
        if (!baseUnit) return selectedUnit;

        const wargearOption = baseUnit.wargearOptions.find(
          (wargearOption) => wargearOption.id === action.wargearOptionId,
        );
        if (!wargearOption) return selectedUnit;

        const existingOptionInState = selectedUnit.wargearOptions.find(
          (wargearOption) => wargearOption.optionId === action.wargearOptionId,
        );

        const wargearOptions = existingOptionInState
          ? handleExistingOption(selectedUnit, wargearOption, action)
          : [
              ...selectedUnit.wargearOptions,
              {
                optionId: action.wargearOptionId,
                choiceId: action.wargearChoiceId,
                count: computeCount(wargearOption, action),
              },
            ];

        return {
          ...selectedUnit,
          wargearOptions,
        };
      }

      return selectedUnit;
    }),
  };
};
