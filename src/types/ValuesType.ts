import { z } from "zod";
import { CustomFieldModuleSchema } from "./modules/CustomFieldModule";
import { EmnailModuleSchema } from "./modules/EmailModule";
import { KeyModuleSchema } from "./modules/KeyModule";
import { NoteModuleSchema } from "./modules/NoteModule";
import { PasswordModuleSchema } from "./modules/PasswordModule";
import { TitleModuleSchema } from "./modules/TitleModule";
import { URLModuleSchema } from "./modules/URLModule";
import { UsernameModuleSchema } from "./modules/UsernameModule";
import { WifiModuleSchema } from "./modules/WifiModule";

export const ValuesTypeSchema = z.object({
  modules: z
    .array(CustomFieldModuleSchema)
    .or(z.array(EmnailModuleSchema))
    .or(z.array(KeyModuleSchema))
    .or(z.array(NoteModuleSchema))
    .or(z.array(PasswordModuleSchema))
    .or(z.array(TitleModuleSchema))
    .or(z.array(URLModuleSchema))
    .or(z.array(UsernameModuleSchema))
    .or(z.array(WifiModuleSchema)),
  fav: z.boolean(),
  created: z.string(),
  lastUpdated: z.string(),
  folder: z.string(),
  icon: z.string(),
});

type ValuesType = z.infer<typeof ValuesTypeSchema>;

export default ValuesType;
