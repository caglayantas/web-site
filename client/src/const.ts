```typescript
import { OAUTH_STATE_COOKIE, encodeOAuthState } from "@shared/const";

export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Start the Manus OAuth login.
export const startLogin = () => {
  console.log("=== OAUTH LOGIN TEST ===");

  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;

  console.log("VITE_OAUTH_PORTAL_URL:", oauthPortalUrl);
  console.log("VITE_APP_ID:", appId);

  const redirectUri = `${window.location.origin}/api/oauth/callback`;

  console.log("Redirect URI:", redirectUri);

  try {
    const nonce = crypto.randomUUID();

    document.cookie = `${OAUTH_STATE_COOKIE}=${nonce}; Path=/; Max-Age=600; SameSite=None; Secure`;

    const state = encodeOAuthState({
      redirectUri,
      nonce,
    });

    console.log("OAuth state oluşturuldu.");

    if (!oauthPortalUrl) {
      console.error("HATA: VITE_OAUTH_PORTAL_URL boş veya tanımsız.");
      alert("OAuth adresi tanımlı değil.");
      return;
    }

    if (!appId) {
      console.error("HATA: VITE_APP_ID boş veya tanımsız.");
      alert("VITE_APP_ID tanımlı değil.");
      return;
    }

    const url = new URL(`${oauthPortalUrl}/app-auth`);

    url.searchParams.set("appId", appId);
    url.searchParams.set("redirectUri", redirectUri);
    url.searchParams.set("state", state);
    url.searchParams.set("type", "signIn");

    console.log("OAuth URL:", url.toString());
    console.log("OAuth sayfasına yönlendiriliyor...");

    window.location.href = url.toString();
  } catch (error) {
    console.error("OAuth başlatılırken hata oluştu:", error);
    alert("Giriş sistemi başlatılamadı. F12 Console'u kontrol edin.");
  }
};
```
