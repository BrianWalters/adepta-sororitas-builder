import { CmsProviderInterface } from '@/cms/CmsProviderInterface';
import { UnitListing, UnitListingSchema } from '@/domain/UnitListing';
import { createClient, SanityClient } from '@sanity/client';
import { unitListings } from '@/cms/sanity/query/unitListings';
import imageUrlBuilder from '@sanity/image-url';
import { ImageUrlBuilder } from '@sanity/image-url/lib/types/builder';
import { UnitDetail, UnitDetailSchema } from '@/domain/UnitDetail';
import { unitDetails } from '@/cms/sanity/query/unitDetails';

export class SanityCmsProvider implements CmsProviderInterface {
  private client: SanityClient;
  private imageUrlBuilder: ImageUrlBuilder;

  constructor(projectId: string, dataset: string) {
    this.client = createClient({
      projectId,
      dataset,
      apiVersion: '2023-03-23',
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

  async getUnitDetails(): Promise<UnitDetail[]> {
    const units = await this.client.fetch(unitDetails);
    return units.map((unit: any): UnitDetail => {
      const { imageAsset, models, wargearOptions, ...rest } = unit;

      return UnitDetailSchema.parse({
        ...rest,
        imageUrl: this.imageUrlBuilder.image(imageAsset).width(300).url(),
        models: models.map((modelDetails: any) => {
          return {
            ...modelDetails,
            model: {
              ...modelDetails.model,
              imageUrl: this.imageUrlBuilder
                .image(modelDetails.model.imageAsset)
                .width(150)
                .url(),
            },
          };
        }),
        wargearOptions: wargearOptions.map((wg: any) => {
          return {
            ...wg,
            modelId: wg?.model?._id,
            wargearRemoved:
              wg?.wargearRemoved?.map((removed: any) => removed._id) || [],
          };
        }),
      });
    });
  }
}
