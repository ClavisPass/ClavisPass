import Provider from "./Provider";

type SessionQrPayload = {
  kind: "clavispass:session";
  version: 1;
  provider: Provider;
  refreshToken: string;
  hostUrl?: string;
};

export default SessionQrPayload;
