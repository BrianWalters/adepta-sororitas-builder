import { z } from 'zod';

export const UnitDetailSchema = z.object({
  name: z.string(),
  imageUrl: z.string(),
});

export type UnitDetail = z.infer<typeof UnitDetailSchema>;
