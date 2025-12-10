import Provider from "../Provider";

interface TokenRefreshParams {
  provider: Provider;
  refreshToken: string;
}

export default TokenRefreshParams;