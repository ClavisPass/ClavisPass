type AnalysisFlags = {
  isShort: boolean;
  hasSequential: boolean;
  hasRepeatedChars: boolean;
  reuseGroupSize: number;
  variantGroupSize: number;
  pwnedCount: number | null;
  isCompromised: boolean;
};

export default AnalysisFlags;
