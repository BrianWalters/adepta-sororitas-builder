import { UnitListing } from '@/domain/UnitListing';
import { UnitDetail } from '@/domain/UnitDetail';

export interface CmsProviderInterface {
  getUnitListings: () => Promise<UnitListing[]>;
  getUnitDetails: () => Promise<UnitDetail[]>;
}
