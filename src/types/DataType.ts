import { z } from "zod";
import { ValuesListTypeSchema } from "./ValuesType";

export const DataTypeSchema = z.object({
  version: z.string(),
  lastUpdated: z.string().datetime(),
  master: z.string(),
  folder: z.array(z.string()),
  values: ValuesListTypeSchema,
}).nullable();

type DataType = z.infer<typeof DataTypeSchema>;

export default DataType;
