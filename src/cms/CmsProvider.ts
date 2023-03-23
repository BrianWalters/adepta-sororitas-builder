import { SanityCmsProvider } from '@/cms/sanity/SanityCmsProvider';
import * as process from 'process';

export const cmsProvider = new SanityCmsProvider(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  process.env.NEXT_PUBLIC_SANITY_DATASET || '',
);
