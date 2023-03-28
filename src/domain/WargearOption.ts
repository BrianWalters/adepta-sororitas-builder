import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { WeaponSchema } from '@/domain/Weapon';
import { WargearSchema } from '@/domain/Wargear';

export const WargearOptionSchema = z.object({
  id: z.string().default(() => uuidv4()),
  limit: z.number().int(),
  modelId: z.string().nullish(),
  wargearRemoved: z.array(z.string()).default([]),
  wargearChoices: z.array(
    z.object({
      id: z.string().default(() => uuidv4()),
      wargearAdded: z.array(z.union([WeaponSchema, WargearSchema])),
    }),
  ),
});

export type WargearOption = z.infer<typeof WargearOptionSchema>;
