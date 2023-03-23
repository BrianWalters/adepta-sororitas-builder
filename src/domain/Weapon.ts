import { z } from 'zod';

export const WeaponSchema = z.object({
  _id: z.string(),
  name: z.string(),
  range: z.number().int(),
  type: z.string(),
  strength: z.string(),
  armorPiercing: z.number().int(),
  damage: z.string(),
});

export type Weapon = z.infer<typeof WeaponSchema>;
