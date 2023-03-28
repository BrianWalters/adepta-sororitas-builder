import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export const WargearSchema = z.object({
  _id: z.string(),
  key: z.string().default(() => uuidv4()),
  name: z.string(),
  abilities: z.array(z.object({}).passthrough()).nullish(),
});

export type Wargear = z.infer<typeof WargearSchema>;
