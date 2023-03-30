import { BuilderState } from '@/reducer/state/BuilderState';

export interface AttachUnitAction {
  type: 'AttachUnitAction';
  hostUnitId: string;
  unitToAttachId: string;
}

export const attachUnit = (
  state: BuilderState,
  action: AttachUnitAction,
): BuilderState => {
  const selectedHostUnit = state.selectedUnits.find(
    (unit) => unit.id === action.hostUnitId,
  );
  if (!selectedHostUnit) return state;

  const unitToAttach = state.selectedUnits.find(
    (unit) => unit.id === action.unitToAttachId,
  );
  if (!unitToAttach) return state;

  const attachedUnitsKeywords =
    state.availableUnits.find((unit) => unit._id === unitToAttach.baseUnitId)
      ?.keywords || [];
  if (!attachedUnitsKeywords.includes('Character')) return state;

  const isUnitAlreadyAttached = state.selectedUnits.some((selectedUnit) =>
    selectedUnit.attachedUnits.includes(action.unitToAttachId),
  );
  if (isUnitAlreadyAttached) return state;

  return {
    ...state,
    selectedUnits: state.selectedUnits.map((selectedUnit) => {
      if (selectedUnit.id === action.hostUnitId) {
        return {
          ...selectedUnit,
          attachedUnits: [...selectedUnit.attachedUnits, action.unitToAttachId],
        };
      }

      return selectedUnit;
    }),
  };
};
