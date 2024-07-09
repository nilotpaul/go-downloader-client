import { z } from 'zod';

export const downloadSchema = z.object({
  links: z.string().url(),
  path: z.string().optional(),
});

export type DownloadSchema = z.infer<typeof downloadSchema>;
