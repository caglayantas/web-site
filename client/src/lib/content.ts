import { supabase } from "@/lib/supabase";

export type ProjectRow = {
  id: number;
  slug: string;
  label: string;
  title: string;
  detail: string;
  scope: string | null;
  systems: string | null;
  results: string | null;
  beforeImage: string;
  afterImage: string;
  status: "draft" | "published";
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export type KnowledgePostRow = {
  id: number;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  body: string;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: string | null;
  status: "draft" | "published";
  featured: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export type FaqRow = {
  id: number;
  question: string;
  answer: string;
  status: "draft" | "published";
  sortOrder: number;
};

export type ServiceRow = {
  id: number;
  slug: string;
  title: string;
  icon: string;
  image: string | null;
  description: string;
  subtopics: string[];
  eyebrow: string;
  intro: string;
  operations: string[];
  note: string;
  cta: string;
  status: "draft" | "published";
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export type PartnerRow = {
  id: number;
  name: string;
  logo: string | null;
  relationship: string;
  description: string;
  website: string;
  status: "draft" | "published";
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

const mapProject = (row: any): ProjectRow => ({
  id: row.id,
  slug: row.slug,
  label: row.label,
  title: row.title,
  detail: row.detail,
  scope: row.scope,
  systems: row.systems,
  results: row.results,
  beforeImage: row.before_image,
  afterImage: row.after_image,
  status: row.status,
  sortOrder: row.sort_order,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapKnowledge = (row: any): KnowledgePostRow => ({
  id: row.id,
  slug: row.slug,
  category: row.category,
  title: row.title,
  excerpt: row.excerpt,
  coverImage: row.cover_image,
  body: row.body,
  seoTitle: row.seo_title,
  seoDescription: row.seo_description,
  publishedAt: row.published_at,
  status: row.status,
  featured: row.featured,
  sortOrder: row.sort_order,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapFaq = (row: any): FaqRow => ({
  id: row.id,
  question: row.question,
  answer: row.answer,
  status: row.status,
  sortOrder: row.sort_order,
});

const mapService = (row: any): ServiceRow => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  icon: row.icon,
  image: row.image,
  description: row.description,
  subtopics: Array.isArray(row.subtopics) ? row.subtopics : [],
  eyebrow: row.eyebrow,
  intro: row.intro,
  operations: Array.isArray(row.operations) ? row.operations : [],
  note: row.note,
  cta: row.cta,
  status: row.status,
  sortOrder: row.sort_order,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const serviceToRow = (p: Partial<ServiceRow>) => {
  const row: Record<string, unknown> = {};
  if (p.slug !== undefined) row.slug = p.slug;
  if (p.title !== undefined) row.title = p.title;
  if (p.icon !== undefined) row.icon = p.icon;
  if (p.image !== undefined) row.image = p.image;
  if (p.description !== undefined) row.description = p.description;
  if (p.subtopics !== undefined) row.subtopics = p.subtopics;
  if (p.eyebrow !== undefined) row.eyebrow = p.eyebrow;
  if (p.intro !== undefined) row.intro = p.intro;
  if (p.operations !== undefined) row.operations = p.operations;
  if (p.note !== undefined) row.note = p.note;
  if (p.cta !== undefined) row.cta = p.cta;
  if (p.status !== undefined) row.status = p.status;
  if (p.sortOrder !== undefined) row.sort_order = p.sortOrder;
  return row;
};

const mapPartner = (row: any): PartnerRow => ({
  id: row.id,
  name: row.name,
  logo: row.logo,
  relationship: row.relationship,
  description: row.description,
  website: row.website,
  status: row.status,
  sortOrder: row.sort_order,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const partnerToRow = (p: Partial<PartnerRow>) => {
  const row: Record<string, unknown> = {};
  if (p.name !== undefined) row.name = p.name;
  if (p.logo !== undefined) row.logo = p.logo;
  if (p.relationship !== undefined) row.relationship = p.relationship;
  if (p.description !== undefined) row.description = p.description;
  if (p.website !== undefined) row.website = p.website;
  if (p.status !== undefined) row.status = p.status;
  if (p.sortOrder !== undefined) row.sort_order = p.sortOrder;
  return row;
};

const projectToRow = (p: Partial<ProjectRow>) => {
  const row: Record<string, unknown> = {};
  if (p.slug !== undefined) row.slug = p.slug;
  if (p.label !== undefined) row.label = p.label;
  if (p.title !== undefined) row.title = p.title;
  if (p.detail !== undefined) row.detail = p.detail;
  if (p.scope !== undefined) row.scope = p.scope;
  if (p.systems !== undefined) row.systems = p.systems;
  if (p.results !== undefined) row.results = p.results;
  if (p.beforeImage !== undefined) row.before_image = p.beforeImage;
  if (p.afterImage !== undefined) row.after_image = p.afterImage;
  if (p.status !== undefined) row.status = p.status;
  if (p.sortOrder !== undefined) row.sort_order = p.sortOrder;
  return row;
};

const knowledgeToRow = (p: Partial<KnowledgePostRow>) => {
  const row: Record<string, unknown> = {};
  if (p.slug !== undefined) row.slug = p.slug;
  if (p.category !== undefined) row.category = p.category;
  if (p.title !== undefined) row.title = p.title;
  if (p.excerpt !== undefined) row.excerpt = p.excerpt;
  if (p.coverImage !== undefined) row.cover_image = p.coverImage;
  if (p.body !== undefined) row.body = p.body;
  if (p.seoTitle !== undefined) row.seo_title = p.seoTitle;
  if (p.seoDescription !== undefined) row.seo_description = p.seoDescription;
  if (p.publishedAt !== undefined) row.published_at = p.publishedAt;
  if (p.status !== undefined) row.status = p.status;
  if (p.featured !== undefined) row.featured = p.featured;
  if (p.sortOrder !== undefined) row.sort_order = p.sortOrder;
  return row;
};

// ---- Public reads ----

export async function getPublishedProjects(): Promise<ProjectRow[]> {
  const { data, error } = await supabase.from("projects").select("*").eq("status", "published").order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapProject);
}

export async function getPublishedProjectBySlug(slug: string): Promise<ProjectRow | null> {
  const { data, error } = await supabase.from("projects").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
  if (error) throw error;
  return data ? mapProject(data) : null;
}

export async function getPublishedKnowledgePosts(): Promise<KnowledgePostRow[]> {
  const { data, error } = await supabase.from("knowledge_posts").select("*").eq("status", "published").order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapKnowledge);
}

export async function getPublishedKnowledgePostBySlug(slug: string): Promise<KnowledgePostRow | null> {
  const { data, error } = await supabase.from("knowledge_posts").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
  if (error) throw error;
  return data ? mapKnowledge(data) : null;
}

export async function getPublishedFaqs(): Promise<FaqRow[]> {
  const { data, error } = await supabase.from("faq").select("*").eq("status", "published").order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapFaq);
}

export async function getPublishedServices(): Promise<ServiceRow[]> {
  const { data, error } = await supabase.from("services").select("*").eq("status", "published").order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapService);
}

export async function getPublishedPartners(): Promise<PartnerRow[]> {
  const { data, error } = await supabase.from("partners").select("*").eq("status", "published").order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapPartner);
}

// ---- Admin reads/writes (require an authenticated Supabase session; enforced by RLS) ----

export async function getAllProjects(): Promise<ProjectRow[]> {
  const { data, error } = await supabase.from("projects").select("*").order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapProject);
}

export async function getProjectPreviewBySlug(slug: string): Promise<ProjectRow | null> {
  const { data, error } = await supabase.from("projects").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data ? mapProject(data) : null;
}

export async function createProject(input: Partial<ProjectRow>): Promise<ProjectRow> {
  const { data, error } = await supabase.from("projects").insert(projectToRow(input)).select("*").single();
  if (error) throw error;
  return mapProject(data);
}

export async function updateProject(id: number, changes: Partial<ProjectRow>): Promise<ProjectRow> {
  const { data, error } = await supabase.from("projects").update(projectToRow(changes)).eq("id", id).select("*").single();
  if (error) throw error;
  return mapProject(data);
}

export async function deleteProject(id: number): Promise<void> {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}

export async function getAllKnowledgePosts(): Promise<KnowledgePostRow[]> {
  const { data, error } = await supabase.from("knowledge_posts").select("*").order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapKnowledge);
}

export async function createKnowledgePost(input: Partial<KnowledgePostRow>): Promise<KnowledgePostRow> {
  const { data, error } = await supabase.from("knowledge_posts").insert(knowledgeToRow(input)).select("*").single();
  if (error) throw error;
  return mapKnowledge(data);
}

export async function updateKnowledgePost(id: number, changes: Partial<KnowledgePostRow>): Promise<KnowledgePostRow> {
  const { data, error } = await supabase.from("knowledge_posts").update(knowledgeToRow(changes)).eq("id", id).select("*").single();
  if (error) throw error;
  return mapKnowledge(data);
}

export async function deleteKnowledgePost(id: number): Promise<void> {
  const { error } = await supabase.from("knowledge_posts").delete().eq("id", id);
  if (error) throw error;
}

export async function getAllFaqs(): Promise<FaqRow[]> {
  const { data, error } = await supabase.from("faq").select("*").order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapFaq);
}

export async function createFaq(input: Partial<FaqRow>): Promise<FaqRow> {
  const { data, error } = await supabase.from("faq").insert({ question: input.question, answer: input.answer, status: input.status ?? "published", sort_order: input.sortOrder ?? 0 }).select("*").single();
  if (error) throw error;
  return mapFaq(data);
}

export async function updateFaq(id: number, changes: Partial<FaqRow>): Promise<FaqRow> {
  const row: Record<string, unknown> = {};
  if (changes.question !== undefined) row.question = changes.question;
  if (changes.answer !== undefined) row.answer = changes.answer;
  if (changes.status !== undefined) row.status = changes.status;
  if (changes.sortOrder !== undefined) row.sort_order = changes.sortOrder;
  const { data, error } = await supabase.from("faq").update(row).eq("id", id).select("*").single();
  if (error) throw error;
  return mapFaq(data);
}

export async function deleteFaq(id: number): Promise<void> {
  const { error } = await supabase.from("faq").delete().eq("id", id);
  if (error) throw error;
}

export async function getAllServices(): Promise<ServiceRow[]> {
  const { data, error } = await supabase.from("services").select("*").order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapService);
}

export async function createService(input: Partial<ServiceRow>): Promise<ServiceRow> {
  const { data, error } = await supabase.from("services").insert(serviceToRow(input)).select("*").single();
  if (error) throw error;
  return mapService(data);
}

export async function updateService(id: number, changes: Partial<ServiceRow>): Promise<ServiceRow> {
  const { data, error } = await supabase.from("services").update(serviceToRow(changes)).eq("id", id).select("*").single();
  if (error) throw error;
  return mapService(data);
}

export async function deleteService(id: number): Promise<void> {
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw error;
}

export async function getAllPartners(): Promise<PartnerRow[]> {
  const { data, error } = await supabase.from("partners").select("*").order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapPartner);
}

export async function createPartner(input: Partial<PartnerRow>): Promise<PartnerRow> {
  const { data, error } = await supabase.from("partners").insert(partnerToRow(input)).select("*").single();
  if (error) throw error;
  return mapPartner(data);
}

export async function updatePartner(id: number, changes: Partial<PartnerRow>): Promise<PartnerRow> {
  const { data, error } = await supabase.from("partners").update(partnerToRow(changes)).eq("id", id).select("*").single();
  if (error) throw error;
  return mapPartner(data);
}

export async function deletePartner(id: number): Promise<void> {
  const { error } = await supabase.from("partners").delete().eq("id", id);
  if (error) throw error;
}

// ---- Image uploads (Supabase Storage, replacing Manus Forge storage) ----

export async function uploadImage(bucket: "projects" | "knowledge" | "site" | "services" | "partners", file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "bin";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {contentType: file.type });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
