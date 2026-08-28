import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";

const request = { headers: {}, socket: {} } as never;
const response = {
  clearCookie: () => undefined,
  setHeader: () => response,
} as never;

function caller(user: { openId: string; role: "admin" | "user" } | null) {
  return appRouter.createCaller({ req: request, res: response, user });
}

describe("tRPC authorization boundaries", () => {
  it("rejects anonymous access to admin project reads", async () => {
    await expect(caller(null).projects.adminList()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("rejects authenticated non-admin access to admin content reads", async () => {
    await expect(caller({ openId: "user-1", role: "user" }).knowledge.adminList()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("rejects authenticated non-admin access to admin upload endpoints", async () => {
    await expect(caller({ openId: "user-1", role: "user" }).projects.uploadImage({
      filename: "test.webp",
      contentType: "image/webp",
      base64: "aGVsbG8=",
    })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
