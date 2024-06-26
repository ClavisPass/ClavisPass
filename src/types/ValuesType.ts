import { z } from "zod";
import { ModulesTypeSchema } from "./ModulesType";

export const ValuesTypeSchema = z.object({
  id: z.string(),
  modules: ModulesTypeSchema,
  title: z.string(),
  fav: z.boolean(),
  created: z.string().datetime(),
  lastUpdated: z.string().datetime(),
  folder: z.string(),
});

export const ValuesListTypeSchema = z.array(ValuesTypeSchema);

export type ValuesListType = z.infer<typeof ValuesListTypeSchema>;

type ValuesType = z.infer<typeof ValuesTypeSchema>;

export default ValuesType;
