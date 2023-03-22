import { z } from 'zod';

export const UnitListingSchema = z.object({
  name: z.string(),
  abilities: z.array(z.string()),
  power: z.number(),
  keywords: z.array(z.string()),
  imageUrl: z.string(),
});

export type UnitListing = z.infer<typeof UnitListingSchema>;
