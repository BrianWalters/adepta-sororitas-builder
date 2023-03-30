import { Wargear } from '@/domain/Wargear';
import { Weapon } from '@/domain/Weapon';
import { Model } from '@/domain/Model';

export type WargearViewModel = (Wargear | Weapon) & {
  addedFromOption?: boolean;
  isLocked?: boolean;
};

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
  attachedUnits: UnitViewModel[];
};

export interface BuilderViewModel {
  totalPower: number;
  units: UnitViewModel[];
}
