import { z } from 'zod';

export const env = z.object({}).parse(import.meta.env);
