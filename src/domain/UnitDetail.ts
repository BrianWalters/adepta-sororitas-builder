import { z } from 'zod';
import { WeaponSchema } from '@/domain/Weapon';
import { ModelSchema } from '@/domain/Model';
import { v4 as uuidv4 } from 'uuid';
import { WargearOptionSchema } from '@/domain/WargearOption';

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
      id: z.string().default(() => uuidv4()),
      count: z.number().int(),
      additionalPowerCost: z.number().int(),
      model: ModelSchema,
    }),
  ),
  wargearOptions: z.array(WargearOptionSchema),
});

export type UnitDetail = z.infer<typeof UnitDetailSchema>;
