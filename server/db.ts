import { and, asc, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { Faq, InsertFaq, InsertKnowledgePost, InsertProject, InsertUser, Project, faqs, knowledgePosts, projects, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

const PLACEHOLDER_CONTENT = /(bvnmv|cnbv|asdasd|jhjh|mnbv|ngch|vngch)/i;

export function isProjectPublishable(project: Pick<Project, "slug" | "label" | "title" | "detail" | "beforeImage" | "afterImage">) {
  const fields = [project.slug, project.label, project.title, project.detail, project.beforeImage, project.afterImage].map((value) => String(value ?? "").trim());
  const [slug, label, title, detail, beforeImage, afterImage] = fields;
  return slug.length >= 3 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
    && label.length >= 3 && title.length >= 6 && detail.length >= 30
    && beforeImage.length > 0 && afterImage.length > 0
    && !fields.some((value) => PLACEHOLDER_CONTENT.test(value));
}

export async function getPublishedProjects() {
  const db = await getDb();
  if (!db) return [];
  try {
    const published = await db.select().from(projects).where(eq(projects.status, "published")).orderBy(asc(projects.sortOrder), desc(projects.updatedAt));
    return published.filter(isProjectPublishable);
  } catch (error) {
    console.error("[Projects] published query failed", error);
    return [];
  }
}

export async function getLatestPublishedProjects() {
  const db = await getDb();
  if (!db) return [];
  const published = await db.select().from(projects).where(eq(projects.status, "published")).orderBy(desc(projects.updatedAt), desc(projects.id));
  return published.filter(isProjectPublishable).slice(0, 3);
}

export async function getProjectBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  return result[0];
}

export async function getAllProjects() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(projects).orderBy(asc(projects.sortOrder), desc(projects.updatedAt));
}

export async function getProjectPreviewBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  return result[0];
}

export async function createProject(input: InsertProject) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(projects).values(input);
  const created = await db.select().from(projects).where(eq(projects.slug, input.slug)).limit(1);
  return created[0];
}

export async function updateProject(id: number, input: Partial<InsertProject>) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(projects).set(input).where(eq(projects.id, id));
  const updated = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return updated[0];
}

export async function deleteProject(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(projects).where(eq(projects.id, id));
  return { success: true } as const;
}

export async function getPublishedKnowledgePosts() {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(knowledgePosts).where(eq(knowledgePosts.status, "published")).orderBy(asc(knowledgePosts.sortOrder), desc(knowledgePosts.publishedAt), desc(knowledgePosts.updatedAt));
  } catch (error) {
    console.error("[Knowledge] published query failed", error);
    return [];
  }
}

export async function getPublishedKnowledgePostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(knowledgePosts).where(and(eq(knowledgePosts.slug, slug), eq(knowledgePosts.status, "published"))).limit(1);
  return result[0];
}

export async function getAllKnowledgePosts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(knowledgePosts).orderBy(asc(knowledgePosts.sortOrder), desc(knowledgePosts.updatedAt));
}

export async function createKnowledgePost(input: InsertKnowledgePost) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(knowledgePosts).values(input);
  const created = await db.select().from(knowledgePosts).where(eq(knowledgePosts.slug, input.slug)).limit(1);
  return created[0];
}

export async function updateKnowledgePost(id: number, input: Partial<InsertKnowledgePost>) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(knowledgePosts).set(input).where(eq(knowledgePosts.id, id));
  const updated = await db.select().from(knowledgePosts).where(eq(knowledgePosts.id, id)).limit(1);
  return updated[0];
}

export async function deleteKnowledgePost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(knowledgePosts).where(eq(knowledgePosts.id, id));
  return { success: true } as const;
}

export async function getPublishedFaqs() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(faqs).where(eq(faqs.status, "published")).orderBy(asc(faqs.sortOrder), desc(faqs.updatedAt));
}

export async function getAllFaqs() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(faqs).orderBy(asc(faqs.sortOrder), desc(faqs.updatedAt));
}

export async function createFaq(input: InsertFaq) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(faqs).values(input);
  const created = await db.select().from(faqs).where(eq(faqs.question, input.question)).limit(1);
  return created[0];
}

export async function updateFaq(id: number, input: Partial<InsertFaq>) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(faqs).set(input).where(eq(faqs.id, id));
  const updated = await db.select().from(faqs).where(eq(faqs.id, id)).limit(1);
  return updated[0];
}

export async function deleteFaq(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(faqs).where(eq(faqs.id, id));
  return { success: true } as const;
}
