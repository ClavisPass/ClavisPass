import { z } from "zod";

export const VaultDeviceSchema = z.object({
  id: z.string().min(8),
  name: z.string().min(1),
  platform: z.string().min(1),
  firstSeenAt: z.string(),
  lastSeenAt: z.string(),
});

type VaultDeviceType = z.infer<typeof VaultDeviceSchema>;

export default VaultDeviceType;
