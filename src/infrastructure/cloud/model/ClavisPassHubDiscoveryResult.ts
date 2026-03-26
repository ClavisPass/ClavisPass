export type ClavisPassHubDiscoveryStatus =
  | "idle"
  | "checking"
  | "success"
  | "error";

type DiscoverySuccessResult = {
  status: "success";
  normalizedHostUrl: string;
};

type DiscoveryIdleResult = {
  status: "idle";
};

type DiscoveryCheckingResult = {
  status: "checking";
};

type DiscoveryErrorResult = {
  status: "error";
  message: string;
};

type ClavisPassHubDiscoveryResult =
  | DiscoveryIdleResult
  | DiscoveryCheckingResult
  | DiscoverySuccessResult
  | DiscoveryErrorResult;

export default ClavisPassHubDiscoveryResult;
