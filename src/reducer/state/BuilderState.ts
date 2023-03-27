import { UnitDetail } from '@/domain/UnitDetail';

interface SelectedUnit {
  id: string;
  baseUnitId: string;
  addedModels: string[];
  wargearOptions: {
    optionId: string;
    choiceId: string;
    count: number;
  }[];
}

export interface BuilderState {
  availableUnits: UnitDetail[];
  selectedUnits: SelectedUnit[];
}
