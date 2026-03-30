import PasswordStrengthLevel from "../model/PasswordStrengthLevel";
import { AppColors } from "../../../shared/ui/appTheme";

function getPasswordStrengthColor(
  passwordStrengthLevel: PasswordStrengthLevel,
  colors?: Pick<AppColors, "error" | "warning" | "success">
) {
  switch (passwordStrengthLevel) {
    case PasswordStrengthLevel.WEAK:
      return colors?.error ?? "#D2222D";
    case PasswordStrengthLevel.MEDIUM:
      return colors?.warning ?? "#FFBF00";
    case PasswordStrengthLevel.STRONG:
      return colors?.success ?? "#238823";
    default:
      return "";
  }
}

export default getPasswordStrengthColor
