import PasswordStrengthLevel from "../enums/PasswordStrengthLevel";

function getPasswordStrengthColor(passwordStrengthLevel: PasswordStrengthLevel) {
  switch (passwordStrengthLevel) {
    case PasswordStrengthLevel.WEAK:
      return "#D2222D";
    case PasswordStrengthLevel.MEDIUM:
      return "#FFBF00";
    case PasswordStrengthLevel.STRONG:
      return "#238823";
    default:
      return "";
  }
}

export default getPasswordStrengthColor
