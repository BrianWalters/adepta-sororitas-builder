import { z } from 'zod';
import { WeaponSchema } from '@/domain/Weapon';
import { ModelSchema } from '@/domain/Model';
import { WargearSchema } from '@/domain/Wargear';
import { v4 as uuidv4 } from 'uuid';

export const UnitDetailSchema = z.object({
  _id: z.string(),
  name: z.string(),
  imageUrl: z.string(),
  power: z.number().int(),
  keywords: z.array(z.string()),
  abilities: z.array(
    z.object({
      name: z.string(),
      rules: z.array(z.object({}).passthrough()),
    }),
  ),
  defaultWeapons: z.array(WeaponSchema),
  models: z.array(
    z.object({
      id: z.string().default(uuidv4()),
      count: z.number().int(),
      additionalPowerCost: z.number().int(),
      model: ModelSchema,
    }),
  ),
  wargearOptions: z.array(
    z.object({
      limit: z.number().int(),
      modelId: z.string().nullish(),
      wargearRemoved: z.array(z.string()).default([]),
      wargearChoices: z.array(
        z.object({
          wargearAdded: z.array(z.union([WeaponSchema, WargearSchema])),
        }),
      ),
    }),
  ),
});

export type UnitDetail = z.infer<typeof UnitDetailSchema>;
