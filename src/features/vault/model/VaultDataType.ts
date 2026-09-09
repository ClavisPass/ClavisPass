import { z } from "zod";
import { ValuesListTypeSchema } from "./ValuesType";
import { FolderSchema } from "./FolderType";
import { VaultDeviceSchema } from "./VaultDeviceType";

export const VaultEntryTombstoneSchema = z.object({
  id: z.string(),
  deletedAt: z.string().datetime(),
  deletedByDeviceId: z.string().optional(),
});

export type VaultEntryTombstone = z.infer<typeof VaultEntryTombstoneSchema>;

export const VaultDataTypeSchema = z
  .object({
    version: z.string().default("1"),
    folder: z.array(FolderSchema).default([]),
    values: ValuesListTypeSchema.default([]),
    devices: z.array(VaultDeviceSchema).default([]),
    deletedEntries: z.array(VaultEntryTombstoneSchema).default([]),
  })
  .passthrough();

type VaultDataType = z.infer<typeof VaultDataTypeSchema>;

export default VaultDataType;
