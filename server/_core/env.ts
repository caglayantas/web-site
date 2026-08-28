const readEnv = (key: string) => process.env[key]?.trim() ?? "";

export const ENV = {
  appId: readEnv("VITE_APP_ID"),
  cookieSecret: readEnv("JWT_SECRET"),
  databaseUrl: readEnv("DATABASE_URL"),
  oAuthServerUrl: readEnv("OAUTH_SERVER_URL"),
  ownerOpenId: readEnv("OWNER_OPEN_ID"),
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: readEnv("BUILT_IN_FORGE_API_URL"),
  forgeApiKey: readEnv("BUILT_IN_FORGE_API_KEY"),
};

const requiredProductionEnv = [
  ["DATABASE_URL", ENV.databaseUrl],
  ["JWT_SECRET", ENV.cookieSecret],
  ["VITE_APP_ID", ENV.appId],
  ["OAUTH_SERVER_URL", ENV.oAuthServerUrl],
  ["BUILT_IN_FORGE_API_URL", ENV.forgeApiUrl],
  ["BUILT_IN_FORGE_API_KEY", ENV.forgeApiKey],
] as const;

export function assertProductionEnv() {
  if (!ENV.isProduction) return;
  const missing = requiredProductionEnv.filter(([, value]) => !value).map(([key]) => key);
  if (missing.length > 0) {
    throw new Error(`Missing required production environment configuration: ${missing.join(", ")}`);
  }
}
