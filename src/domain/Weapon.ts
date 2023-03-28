import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export const WeaponSchema = z.object({
  _id: z.string(),
  key: z.string().default(() => uuidv4()),
  name: z.string(),
  range: z.number().int(),
  type: z.string(),
  strength: z.string(),
  armorPiercing: z.number().int(),
  damage: z.string(),
  abilities: z.array(z.object({}).passthrough()).nullish(),
});

export type Weapon = z.infer<typeof WeaponSchema>;
