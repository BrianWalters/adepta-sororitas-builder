import { z } from 'zod';

export const WargearSchema = z.object({
  _id: z.string(),
  name: z.string(),
  abilities: z.array(z.object({}).passthrough()),
});

export type Wargear = z.infer<typeof WargearSchema>;
