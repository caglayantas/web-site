const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function isIpAddress(host: string) {
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return true;
  return host.includes(":");
}

export function getSessionCookieOptions(req: any): any {
  const protocol = String(req?.protocol || "");
  const forwarded = req?.headers?.["x-forwarded-proto"];
  const protoList: string[] = Array.isArray(forwarded) ? forwarded.map(String) : String(forwarded || "").split(",");
  const secure = protocol === "https" || protoList.some((proto: string) => proto.trim().toLowerCase() === "https");
  const hostname = String(req?.hostname || req?.headers?.host || "").split(":")[0];
  const shouldSetDomain = !!hostname && !LOCAL_HOSTS.has(hostname) && !isIpAddress(hostname);
  const domain = shouldSetDomain ? `.${hostname}` : undefined;

  return {
    ...(domain ? { domain } : {}),
    httpOnly: true,
    path: "/",
    sameSite: secure ? "none" : "lax",
    secure,
  };
}
