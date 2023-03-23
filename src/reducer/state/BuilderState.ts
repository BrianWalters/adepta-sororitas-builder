import { UnitDetail } from '@/domain/UnitDetail';

export interface BuilderState {
  availableUnits: UnitDetail[];
  selectedUnits: UnitDetail[];
}
