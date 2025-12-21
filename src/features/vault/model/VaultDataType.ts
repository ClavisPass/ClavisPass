import { z } from "zod";
import { ValuesListTypeSchema } from "./ValuesType";
import { FolderSchema } from "./FolderType";

export const VaultDataTypeSchema = z
  .object({
    version: z.string(),
    folder: z.array(FolderSchema).default([]),
    values: ValuesListTypeSchema.default([]),
  })
  .passthrough()
  .nullable();

type VaultDataType = z.infer<typeof VaultDataTypeSchema>;

export default VaultDataType;
