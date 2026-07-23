import { z } from "zod";

import ModulesEnum from "../ModulesEnum";

const regex = new RegExp(ModulesEnum.ADDRESS);

export const AddressModuleTypeSchema = z.object({
  id: z.string(),
  module: z.string().regex(regex),
  street1: z.string().optional(),
  street2: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
});

type AddressModuleType = z.infer<typeof AddressModuleTypeSchema>;

export default AddressModuleType;
