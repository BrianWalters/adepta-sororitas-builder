import { BuilderState, SelectedUnitState } from '@/reducer/state/BuilderState';
import { UnitDetail } from '@/domain/UnitDetail';

export interface SetWargearOptionAction {
  type: 'SetWargearOptionAction';
  selectedUnitId: string;
  wargearOptionId: string;
  wargearChoiceId?: string;
  count?: number;
}

function handleExistingOption(
  selectedUnit: BuilderState['selectedUnits'][0],
  baseUnitWargearOption: UnitDetail['wargearOptions'][0],
  action: SetWargearOptionAction,
): BuilderState['selectedUnits'][0]['wargearOptions'] {
  return selectedUnit.wargearOptions.map((selectedUnitWargearOption) => {
    if (selectedUnitWargearOption.optionId !== action.wargearOptionId)
      return selectedUnitWargearOption;

    return {
      ...selectedUnitWargearOption,
      choiceId: action.wargearChoiceId ?? selectedUnitWargearOption.choiceId,
      count:
        typeof action.count === 'number'
          ? Math.min(action.count, baseUnitWargearOption.limit)
          : selectedUnitWargearOption.count,
    };
  });
}

function updateSelectedUnit(
  state: BuilderState,
  selectedUnit: SelectedUnitState,
  action: SetWargearOptionAction,
) {
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
          choiceId:
            action.wargearChoiceId ?? wargearOption.wargearChoices[0].id,
          count:
            typeof action.count === 'number'
              ? Math.min(action.count, wargearOption.limit)
              : 1,
        },
      ];

  return {
    ...selectedUnit,
    wargearOptions,
  };
}

export const setWargearOption = (
  state: BuilderState,
  action: SetWargearOptionAction,
) => {
  return {
    ...state,
    selectedUnits: state.selectedUnits.map((selectedUnit) => {
      if (selectedUnit.id === action.selectedUnitId) {
        return updateSelectedUnit(state, selectedUnit, action);
      }

      return selectedUnit;
    }),
  };
};
