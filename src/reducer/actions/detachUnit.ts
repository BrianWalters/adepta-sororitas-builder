import { BuilderState } from '@/reducer/state/BuilderState';

export interface DetachUnitAction {
  type: 'DetachUnitAction';
  attachedUnitId: string;
}

export const detachUnit = (
  state: BuilderState,
  action: DetachUnitAction,
): BuilderState => {
  return {
    ...state,
    selectedUnits: state.selectedUnits.map((selectedUnit) => {
      if (selectedUnit.attachedUnits.includes(action.attachedUnitId)) {
        return {
          ...selectedUnit,
          attachedUnits: selectedUnit.attachedUnits.filter(
            (attachedUnitId) => attachedUnitId !== action.attachedUnitId,
          ),
        };
      }

      return selectedUnit;
    }),
  };
};
