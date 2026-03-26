interface TokenRefreshResult {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  scope?: string;
  tokenType?: string;
}

export default TokenRefreshResult;
