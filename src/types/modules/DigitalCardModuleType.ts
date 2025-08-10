import { z } from "zod";

import ModulesEnum from "../../enums/ModulesEnum";

const regex = new RegExp(ModulesEnum.DIGITAL_CARD);

export const DigitalCardModuleTypeSchema = z.object({
  id: z.string(),
  module: z.string().regex(regex),
  value: z.string(),
  type: z.enum([
    "QR-Code",
    "CODE39",
    "CODE128",
    "CODE128A",
    "CODE128B",
    "CODE128C",
    "EAN13",
    "EAN8",
    "EAN5",
    "EAN2",
    "UPC",
    "UPCE",
    "ITF14",
    "ITF",
    "MSI",
    "MSI10",
    "MSI11",
    "MSI1010",
    "MSI1110",
    "pharmacode",
    "codabar",
  ]),
});

type DigitalCardModuleType = z.infer<typeof DigitalCardModuleTypeSchema>;

export default DigitalCardModuleType;
