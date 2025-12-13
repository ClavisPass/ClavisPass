interface TokenRefreshResult {
  accessToken: string;
  expiresIn?: number;
  scope?: string;
  tokenType?: string;
}

export default TokenRefreshResult;