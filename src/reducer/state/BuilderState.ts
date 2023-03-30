import { UnitDetail } from '@/domain/UnitDetail';

export type WargearOptionState = {
  optionId: string;
  choiceId: string;
  count: number;
};

export interface SelectedUnitState {
  id: string;
  baseUnitId: string;
  addedModels: string[];
  wargearOptions: WargearOptionState[];
  attachedUnits: string[];
}

export interface BuilderState {
  availableUnits: UnitDetail[];
  selectedUnits: SelectedUnitState[];
}
