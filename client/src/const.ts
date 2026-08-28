import { OAUTH_STATE_COOKIE, encodeOAuthState } from "@shared/const";

export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const startLogin = () => {
  console.log("OAUTH LOGIN BASLADI");

  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;

  console.log("OAUTH PORTAL:", oauthPortalUrl);
  console.log("APP ID:", appId);

  const redirectUri = window.location.origin + "/api/oauth/callback";

  console.log("REDIRECT URI:", redirectUri);

  if (!oauthPortalUrl) {
    alert("VITE_OAUTH_PORTAL_URL tanimli degil");
    console.error("VITE_OAUTH_PORTAL_URL tanimli degil");
    return;
  }

  if (!appId) {
    alert("VITE_APP_ID tanimli degil");
    console.error("VITE_APP_ID tanimli degil");
    return;
  }

  try {
    const nonce = crypto.randomUUID();

    document.cookie =
      OAUTH_STATE_COOKIE +
      "=" +
      nonce +
      "; Path=/; Max-Age=600; SameSite=None; Secure";

    const state = encodeOAuthState({
      redirectUri: redirectUri,
      nonce: nonce,
    });

    const url = new URL(oauthPortalUrl + "/app-auth");

    url.searchParams.set("appId", appId);
    url.searchParams.set("redirectUri", redirectUri);
    url.searchParams.set("state", state);
    url.searchParams.set("type", "signIn");

    console.log("LOGIN URL:", url.toString());

    window.location.href = url.toString();
  } catch (error) {
    console.error("OAUTH HATASI:", error);
    alert("Giris sistemi baslatilamadi");
  }
};
