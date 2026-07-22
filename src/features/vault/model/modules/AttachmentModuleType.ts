import { z } from "zod";
import ModulesEnum from "../ModulesEnum";

export const AttachmentFileSchema = z.object({
  id: z.string(),
  name: z.string(),
  mimeType: z.string().optional(),
  size: z.number().nonnegative(),
  dataBase64: z.string(),
  protected: z.boolean().optional(),
  importedFrom: z.literal("kdbx").optional(),
  keepassRef: z
    .object({
      binaryKey: z.string().optional(),
      protected: z.boolean().optional(),
    })
    .optional(),
});

export const AttachmentModuleTypeSchema = z.object({
  id: z.string(),
  module: z.literal(ModulesEnum.ATTACHMENT),
  files: z.array(AttachmentFileSchema).default([]),
});

export type AttachmentFile = z.infer<typeof AttachmentFileSchema>;

type AttachmentModuleType = z.infer<typeof AttachmentModuleTypeSchema>;

export default AttachmentModuleType;
