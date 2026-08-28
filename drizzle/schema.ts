import {
  boolean,
  datetime,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn"),
});

export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  label: varchar("label", { length: 120 }).notNull(),
  title: varchar("title", { length: 220 }).notNull(),
  detail: text("detail").notNull(),
  scope: text("scope"),
  systems: text("systems"),
  results: text("results"),
  beforeImage: text("beforeImage").notNull(),
  afterImage: text("afterImage").notNull(),
  status: mysqlEnum("status", ["draft", "published"])
    .default("draft")
    .notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .onUpdateNow()
    .notNull(),
});

export const faqs = mysqlTable("faqs", {
  id: int("id").autoincrement().primaryKey(),
  question: varchar("question", { length: 320 }).notNull(),
  answer: text("answer").notNull(),
  status: mysqlEnum("status", ["draft", "published"])
    .default("published")
    .notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .onUpdateNow()
    .notNull(),
});

export const knowledgePosts = mysqlTable("knowledge_posts", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  category: varchar("category", { length: 120 }).notNull(),
  title: varchar("title", { length: 240 }).notNull(),
  excerpt: text("excerpt").notNull(),
  coverImage: text("coverImage"),
  body: text("body").notNull(),
  seoTitle: varchar("seoTitle", { length: 240 }),
  seoDescription: varchar("seoDescription", { length: 320 }),
  publishedAt: timestamp("publishedAt"),
  status: mysqlEnum("status", ["draft", "published"])
    .default("draft")
    .notNull(),
  featured: boolean("featured").default(false).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .onUpdateNow()
    .notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

export type Faq = typeof faqs.$inferSelect;
export type InsertFaq = typeof faqs.$inferInsert;

export type KnowledgePost = typeof knowledgePosts.$inferSelect;
export type InsertKnowledgePost = typeof knowledgePosts.$inferInsert;
