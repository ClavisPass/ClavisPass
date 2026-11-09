import AnalysisFlags from "./AnalysisFlags";
import AnalysisRef from "./AnalysisRef";
import PasswordStrengthLevel from "./PasswordStrengthLevel";

type CachedAnalysisItem = {
  ref: AnalysisRef;
  title: string;
  secondaryTitle?: string;
  normalizedTitle: string;
  entropyBits: number;
  strength: PasswordStrengthLevel;
  flags: AnalysisFlags;
};

export default CachedAnalysisItem;
