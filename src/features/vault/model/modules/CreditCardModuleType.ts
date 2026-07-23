import { z } from "zod";

import ModulesEnum from "../ModulesEnum";

const regex = new RegExp(ModulesEnum.CREDIT_CARD);

export const CreditCardModuleTypeSchema = z.object({
  id: z.string(),
  module: z.string().regex(regex),
  cardholderName: z.string().optional(),
  number: z.string().optional(),
  brand: z.string().optional(),
  expiryMonth: z.string().optional(),
  expiryYear: z.string().optional(),
  securityCode: z.string().optional(),
  bankName: z.string().optional(),
  note: z.string().optional(),
});

type CreditCardModuleType = z.infer<typeof CreditCardModuleTypeSchema>;

export default CreditCardModuleType;
