import { DROPBOX_CLIENT_ID } from '@env';

async function generateNewToken(refreshToken: string) {
    const tokenEndpoint = "https://api.dropboxapi.com/oauth2/token";
  
    try {
      const response = await fetch(tokenEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id: DROPBOX_CLIENT_ID,
        }).toString(),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        return {
          accessToken: data.access_token,
          expiresIn: data.expires_in,
          scope: data.scope,
        };
      } else {
        console.error("Error refreshing token:", data);
        throw new Error(data.error_description || "Failed to refresh token");
      }
    } catch (error) {
      console.error("Error during token refresh:", error);
      throw error;
    }
  }

  export default generateNewToken;