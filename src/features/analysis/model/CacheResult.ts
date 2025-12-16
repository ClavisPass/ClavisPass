import CachedAnalysisItem from "./CachedAnalysisItem";

type CacheResult = {
  list: CachedAnalysisItem[];
  counts: {
    weak: number;
    medium: number;
    strong: number;
    reused: number;
    variants: number;
    short: number;
    sequential: number;
  };
  findings: Array<{ key: string; count: number }>;
};

export default CacheResult;
