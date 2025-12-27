import PasswordStrengthLevel from "../model/PasswordStrengthLevel";

function getPasswordStrengthIcon(passwordStrengthLevel: PasswordStrengthLevel) {
  switch (passwordStrengthLevel) {
    case PasswordStrengthLevel.WEAK:
      return "close-circle";
    case PasswordStrengthLevel.MEDIUM:
      return "minus-circle";
    case PasswordStrengthLevel.STRONG:
      return "check-circle";
    default:
      return "";
  }
}

export default getPasswordStrengthIcon
