import { UnitDetail } from '@/domain/UnitDetail';

interface SelectedUnit {
  id: string;
  baseUnitId: string;
  addedModels: string[];
  addedWargearChoices: string[];
}

export interface BuilderState {
  availableUnits: UnitDetail[];
  selectedUnits: SelectedUnit[];
}
