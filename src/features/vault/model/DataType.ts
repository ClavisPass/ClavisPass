import { z } from "zod";
import { ValuesListTypeSchema } from "./ValuesType";
import { FolderSchema } from "./FolderType";

export const DataTypeSchema = z
  .object({
    version: z.string(),
    folder: z.array(FolderSchema).default([]),
    values: ValuesListTypeSchema.default([]),
  })
  .passthrough()
  .nullable();

type DataType = z.infer<typeof DataTypeSchema>;

export default DataType;
