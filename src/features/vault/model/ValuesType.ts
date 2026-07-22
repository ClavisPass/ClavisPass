import { z } from "zod";
import { ModulesTypeSchema } from "./ModulesType";
import { FolderSchema } from "./FolderType";

export const EntryExternalRefsSchema = z.object({
  keepass: z
    .object({
      uuid: z.string().optional(),
      originalGroupPath: z.array(z.string()).optional(),
      originalIconId: z.string().nullable().optional(),
    })
    .optional(),
});

export const ValuesTypeSchema = z.object({
  id: z.string(),
  modules: ModulesTypeSchema.default([]),
  title: z.string(),
  fav: z.boolean(),
  pinnedAt: z.string().datetime().nullable().optional(),
  tags: z.array(z.string()).optional(),
  created: z.string().datetime(),
  lastUpdated: z.string().datetime(),
  folder: FolderSchema.nullable().default(null),
  externalRefs: EntryExternalRefsSchema.optional(),
});

export const ValuesListTypeSchema = z.array(ValuesTypeSchema);

export type ValuesListType = z.infer<typeof ValuesListTypeSchema>;

type ValuesType = z.infer<typeof ValuesTypeSchema>;

export default ValuesType;
