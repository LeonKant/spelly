import { z } from "zod";

export const AudioSettingsSchema = z.object({
  mainMusicVolume: z.number().min(0).max(100),
  sfxVolume: z.number().min(0).max(100),
});

export type AudioSettingsSchemaT = z.infer<typeof AudioSettingsSchema>;
