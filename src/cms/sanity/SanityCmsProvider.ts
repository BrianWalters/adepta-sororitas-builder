import { CmsProviderInterface } from '@/cms/CmsProviderInterface';
import { UnitListing, UnitListingSchema } from '@/domain/UnitListing';
import { createClient, SanityClient } from '@sanity/client';
import { unitListings } from '@/cms/sanity/query/unitListings';
import imageUrlBuilder from '@sanity/image-url';
import { ImageUrlBuilder } from '@sanity/image-url/lib/types/builder';

export class SanityCmsProvider implements CmsProviderInterface {
  private client: SanityClient;
  private imageUrlBuilder: ImageUrlBuilder;

  constructor(projectId: string, dataset: string) {
    this.client = createClient({
      projectId,
      dataset,
    });

    this.imageUrlBuilder = imageUrlBuilder(this.client);
  }

  async getUnitListings(): Promise<UnitListing[]> {
    const units = await this.client.fetch(unitListings);

    return units.map((unit: any): UnitListing => {
      const { imageAsset, ...rest } = unit;

      return UnitListingSchema.parse({
        ...rest,
        imageUrl: this.imageUrlBuilder.image(imageAsset).width(100).url(),
      });
    });
  }
}
