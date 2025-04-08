import { Schema, model, models } from 'mongoose';
import { z } from 'zod';

const ConfigSchema = new Schema({
  youtubeEmbedUrl: { type: String },
  youtubeStreamLink: { type: String },
  youtubeStreamKey: { type: String },
  createdAt: { type: Date, require: true },
  guestSigninable: { type: Boolean, default: false },
  ceremonyRSVPLink: { type: String },
  cocktailRSVPLink: { type: String },
  banquetRSVPLink: { type: String },
  emailjsAPIKey: { type: String },
  emailjsServiceId: { type: String },
  emailjsTemplateId: { type: String },
  emailjsBroadcastTemplateId: { type: String },
  weddingWebsiteUrl: { type: String },
});

export default models?.Config || model('Config', ConfigSchema);

export const ZodConfigSchema = z.object({
  youtubeEmbedUrl: z.string().optional(),
  youtubeStreamLink: z.string().optional(),
  youtubeStreamKey: z.string().optional(),
  createdAt: z.date(),
  guestSigninable: z.boolean(),
  ceremonyRSVPLink: z.string().optional(),
  cocktailRSVPLink: z.string().optional(),
  banquetRSVPLink: z.string().optional(),
  emailjsAPIKey: z.string().optional(),
  emailjsServiceId: z.string().optional(),
  emailjsTemplateId: z.string().optional(),
  emailjsBroadcastTemplateId: z.string().optional(),
  weddingWebsiteUrl: z.string().optional(),
});
export type TZodConfigSchema = z.infer<typeof ZodConfigSchema>;
