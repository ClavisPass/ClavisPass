import { z } from "zod";
import { ValuesListTypeSchema } from "./ValuesType";
import { FolderSchema } from "./FolderType";
import { VaultDeviceSchema } from "./VaultDeviceType";

export const VaultDataTypeSchema = z
  .object({
    version: z.string().default("1"),
    folder: z.array(FolderSchema).default([]),
    values: ValuesListTypeSchema.default([]),
    devices: z.array(VaultDeviceSchema).default([]),
  })
  .passthrough();

type VaultDataType = z.infer<typeof VaultDataTypeSchema>;

export default VaultDataType;
