import { SanityCmsProvider } from '@/cms/sanity/SanityCmsProvider';
import * as process from 'process';

export const cmsProvider = new SanityCmsProvider(
  process.env.SANITY_PROJECT_ID || '',
  process.env.SANITY_DATASET || '',
);
