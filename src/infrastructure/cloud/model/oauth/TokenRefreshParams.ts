import Provider from "../../model/Provider";

interface TokenRefreshParams {
  provider: Provider;
  refreshToken: string;
}

export default TokenRefreshParams;