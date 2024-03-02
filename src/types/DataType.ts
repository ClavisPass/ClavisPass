import { z } from "zod";
import { ValuesTypeSchema } from "./ValuesType";

export const DataTypeSchema = z.object({
  lastUpdated: z.string(),
  master: z.string(),
  folder: z.array(z.string()),
  values: z.array(ValuesTypeSchema),
});

type ValuesType = z.infer<typeof DataTypeSchema>;

export default ValuesType;
