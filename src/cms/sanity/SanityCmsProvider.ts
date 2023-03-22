import { CmsProviderInterface } from '@/cms/CmsProviderInterface';
import { UnitListing } from '@/domain/UnitListing';

export class SanityCmsProvider implements CmsProviderInterface {
  getUnitListings(): Promise<UnitListing[]> {
    return Promise.resolve([
      {
        name: 'Fake name',
        image: 'https://placehold.co/600x400',
      },
    ]);
  }
}
