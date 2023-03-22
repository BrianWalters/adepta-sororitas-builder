import { UnitListing } from "@/domain/UnitListing";

export interface CmsProviderInterface {
  getUnitListings: () => Promise<UnitListing[]>;
}
