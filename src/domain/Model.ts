import { z } from 'zod';

export const ModelSchema = z.object({
  _id: z.string(),
  imageUrl: z.string(),
  name: z.string(),
  movement: z.number().int(),
  weaponsSkill: z.number().int(),
  ballisticsSkill: z.number().int(),
  strength: z.number().int(),
  toughness: z.number().int(),
  wounds: z.number().int(),
  attacks: z.number().int(),
  leadership: z.number().int(),
  save: z.number().int(),
});

export type Model = z.infer<typeof ModelSchema>;
