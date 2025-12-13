import PasswordStrengthLevel from "../model/PasswordStrengthLevel";

function getPasswordStrengthIcon(passwordStrengthLevel: PasswordStrengthLevel) {
  switch (passwordStrengthLevel) {
    case PasswordStrengthLevel.WEAK:
      return "close-circle-outline";
    case PasswordStrengthLevel.MEDIUM:
      return "minus-circle-outline";
    case PasswordStrengthLevel.STRONG:
      return "check-circle-outline";
    default:
      return "";
  }
}

export default getPasswordStrengthIcon
