import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";

const placeholderProjectText = /(bvnmv|cnbv|asdasd|jhjh|mnbv|ngch|vngch)/i;
const validProjectText = (value: string, min: number) => value.trim().length >= min && !placeholderProjectText.test(value);

import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createFaq, createKnowledgePost, createProject, deleteFaq, deleteKnowledgePost, deleteProject, getAllFaqs, getAllKnowledgePosts, getAllProjects, getLatestPublishedProjects, getProjectBySlug, getProjectPreviewBySlug, getPublishedFaqs, getPublishedKnowledgePosts, getPublishedKnowledgePostBySlug, getPublishedProjects, isProjectPublishable, updateFaq, updateKnowledgePost, updateProject } from "./db";
import { storagePut } from "./storage";
import { notifyOwner } from "./_core/notification";

const sanitizeRichText = (html: string) => html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/\son\w+\s*=\s*(["']).*?\1/gi, "").replace(/javascript:/gi, "").replace(/<(?!\/?(?:p|br|strong|b|em|i|u|h2|h3|ul|ol|li|a)(?:\s|>))/gi, "&lt;");
const uploadImageInput = z.object({ fileName: z.string().min(1).max(180), contentType: z.string().regex(/^image\/(jpeg|png|webp|avif|gif)$/), data: z.string().min(1).max(12_000_000) });
const uploadForAdmin = async (openId: string, folder: string, input: z.infer<typeof uploadImageInput>) => { const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-"); return storagePut(`${folder}/${openId}/${Date.now()}-${safeName}`, Buffer.from(input.data, "base64"), input.contentType); };
const contactAttempts = new Map<string, { count: number; resetAt: number }>();
const CONTACT_WINDOW_MS = 10 * 60 * 1000;
const CONTACT_MAX_ATTEMPTS = 5;
const allowContactAttempt = (key: string) => {
  const now = Date.now();
  contactAttempts.forEach((value, storedKey) => {
    if (value.resetAt <= now) contactAttempts.delete(storedKey);
  });
  const current = contactAttempts.get(key);
  if (!current || current.resetAt <= now) {
    contactAttempts.set(key, { count: 1, resetAt: now + CONTACT_WINDOW_MS });
    return true;
  }
  if (current.count >= CONTACT_MAX_ATTEMPTS) return false;
  current.count += 1;
  return true;
};

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  contact: router({
    submit: publicProcedure.input(z.object({
      name: z.string().trim().min(2).max(120),
      email: z.string().trim().email().max(180),
      service: z.string().trim().min(2).max(120),
      message: z.string().trim().min(10).max(4000),
      website: z.string().max(0).optional().default(""),
    })).mutation(async ({ ctx, input }) => {
      if (input.website) throw new TRPCError({ code: "BAD_REQUEST", message: "Talep doğrulanamadı." });
      const ip = ctx.req.ip || ctx.req.socket.remoteAddress || "unknown";
      if (!allowContactAttempt(ip)) throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Kısa sürede çok fazla talep gönderildi. Lütfen daha sonra tekrar deneyin." });
      const delivered = await notifyOwner({
        title: `Yeni tekne check-up talebi: ${input.name}`,
        content: `Ad soyad: ${input.name}\nE-posta: ${input.email}\nİhtiyaç kategorisi: ${input.service}\n\nMesaj:\n${input.message}`,
      });
      if (!delivered) throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "Talep şu anda iletilemedi. Lütfen WhatsApp veya e-posta üzerinden ulaşın." });
      return { success: true } as const;
    }),
  }),

  projects: router({
    published: publicProcedure.query(() => getPublishedProjects()),
    latestPublished: publicProcedure.query(() => getLatestPublishedProjects()),
    bySlug: publicProcedure.input(z.object({ slug: z.string().min(2).max(160) })).query(async ({ input }) => { const project = await getProjectBySlug(input.slug); if (!project || project.status !== "published" || !isProjectPublishable(project)) throw new TRPCError({ code: "NOT_FOUND", message: "Yayınlanmış proje bulunamadı." }); return project; }),
    adminList: adminProcedure.query(() => getAllProjects()),
    preview: adminProcedure.input(z.object({ slug: z.string().min(2).max(160) })).query(async ({ input }) => {
      const project = await getProjectPreviewBySlug(input.slug);
      if (!project) throw new TRPCError({ code: "NOT_FOUND", message: "Taslak proje bulunamadı." });
      return project;
    }),
    uploadImage: adminProcedure.input(uploadImageInput).mutation(({ ctx, input }) => uploadForAdmin(ctx.user.openId, "projects", input)),
    create: adminProcedure.input(z.object({
      slug: z.string().min(2).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "URL anahtarı yalnızca küçük harf, rakam ve tire içermelidir."), label: z.string().min(2).max(120), title: z.string().min(2).max(220), detail: z.string().min(10), scope: z.string().optional().default(""), systems: z.string().optional().default(""), results: z.string().optional().default(""), beforeImage: z.string().min(1), afterImage: z.string().min(1), status: z.enum(["draft", "published"]).default("draft"), sortOrder: z.number().int().default(0),
    }).superRefine((input, ctx) => {
      if (input.status !== "published") return;
      const checks: Array<[keyof typeof input, string, number]> = [["label", input.label, 3], ["title", input.title, 6], ["detail", input.detail, 30]];
      checks.forEach(([path, value, min]) => { if (!validProjectText(value, min)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: [path], message: "Yayın için anlamlı ve yeterince açıklayıcı içerik girin." }); });
    })).mutation(async ({ input }) => {
      const existing = await getProjectBySlug(input.slug);
      if (existing) throw new TRPCError({ code: "CONFLICT", message: "Bu URL anahtarı zaten kullanılıyor. Başlık değiştiyse yeni bir URL anahtarı deneyin." });
      try { return await createProject(input); } catch (error) { console.error("[Projects] create failed", error); throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Proje kaydedilemedi. Alanları ve görsel yüklemelerini kontrol edip tekrar deneyin." }); }
    }),
    update: adminProcedure.input(z.object({
      id: z.number().int(), slug: z.string().min(2).max(160).optional(), label: z.string().min(2).max(120).optional(), title: z.string().min(2).max(220).optional(), detail: z.string().min(10).optional(), scope: z.string().optional(), systems: z.string().optional(), results: z.string().optional(), beforeImage: z.string().min(1).optional(), afterImage: z.string().min(1).optional(), status: z.enum(["draft", "published"]).optional(), sortOrder: z.number().int().optional(),
    })).mutation(async ({ input }) => {
      if (input.slug) { const existing = await getProjectBySlug(input.slug); if (existing && existing.id !== input.id) throw new TRPCError({ code: "CONFLICT", message: "Bu URL anahtarı başka bir projede kullanılıyor." }); }
      const { id, ...changes } = input;
      try { return await updateProject(id, changes); } catch (error) { console.error("[Projects] update failed", error); throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Proje güncellenemedi. Alanları kontrol edip tekrar deneyin." }); }
    }),
    remove: adminProcedure.input(z.object({ id: z.number().int() })).mutation(({ input }) => deleteProject(input.id)),
  }),

  faq: router({
    published: publicProcedure.query(() => getPublishedFaqs()),
    adminList: adminProcedure.query(() => getAllFaqs()),
    create: adminProcedure.input(z.object({ question: z.string().trim().min(10).max(320), answer: z.string().trim().min(20).max(4000), status: z.enum(["draft", "published"]).default("published"), sortOrder: z.number().int().default(0) })).mutation(({ input }) => createFaq(input)),
    update: adminProcedure.input(z.object({ id: z.number().int(), question: z.string().trim().min(10).max(320).optional(), answer: z.string().trim().min(20).max(4000).optional(), status: z.enum(["draft", "published"]).optional(), sortOrder: z.number().int().optional() })).mutation(({ input }) => { const { id, ...changes } = input; return updateFaq(id, changes); }),
    remove: adminProcedure.input(z.object({ id: z.number().int() })).mutation(({ input }) => deleteFaq(input.id)),
  }),

  knowledge: router({
    published: publicProcedure.query(() => getPublishedKnowledgePosts()),
    bySlug: publicProcedure.input(z.object({ slug: z.string().min(2).max(160) })).query(({ input }) => getPublishedKnowledgePostBySlug(input.slug)),
    adminList: adminProcedure.query(() => getAllKnowledgePosts()),
    uploadImage: adminProcedure.input(uploadImageInput).mutation(({ ctx, input }) => uploadForAdmin(ctx.user.openId, "knowledge", input)),
    create: adminProcedure.input(z.object({ slug: z.string().min(2).max(160), category: z.string().min(2).max(120), title: z.string().min(2).max(240), excerpt: z.string().min(10), coverImage: z.string().optional().default(""), body: z.string().min(20), seoTitle: z.string().max(240).optional().default(""), seoDescription: z.string().max(320).optional().default(""), publishedAt: z.coerce.date().optional(), status: z.enum(["draft", "published"]).default("draft"), featured: z.boolean().default(false), sortOrder: z.number().int().default(0) })).mutation(({ input }) => createKnowledgePost({ ...input, body: sanitizeRichText(input.body) })),
    update: adminProcedure.input(z.object({ id: z.number().int(), slug: z.string().min(2).max(160).optional(), category: z.string().min(2).max(120).optional(), title: z.string().min(2).max(240).optional(), excerpt: z.string().min(10).optional(), coverImage: z.string().optional(), body: z.string().min(20).optional(), seoTitle: z.string().max(240).optional(), seoDescription: z.string().max(320).optional(), publishedAt: z.coerce.date().optional().nullable(), status: z.enum(["draft", "published"]).optional(), featured: z.boolean().optional(), sortOrder: z.number().int().optional() })).mutation(({ input }) => { const { id, body, ...changes } = input; return updateKnowledgePost(id, body === undefined ? changes : { ...changes, body: sanitizeRichText(body) }); }),
    remove: adminProcedure.input(z.object({ id: z.number().int() })).mutation(({ input }) => deleteKnowledgePost(input.id)),
  }),
});

export type AppRouter = typeof appRouter;
