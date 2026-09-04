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
  galleryImages: string[];
  labelEn: string;
  titleEn: string;
  detailEn: string;
  scopeEn: string | null;
  systemsEn: string | null;
  resultsEn: string | null;
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
  categoryEn: string;
  titleEn: string;
  excerptEn: string;
  bodyEn: string;
  seoTitleEn: string | null;
  seoDescriptionEn: string | null;
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
  questionEn: string;
  answerEn: string;
  status: "draft" | "published";
  sortOrder: number;
};

export type BoatListingRow = {
  id: number;
  title: string;
  price: string;
  year: string;
  lengthMeters: string;
  engineInfo: string;
  location: string;
  description: string;
  coverImage: string | null;
  galleryImages: string[];
  status: "draft" | "published";
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
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
  titleEn: string;
  descriptionEn: string;
  subtopicsEn: string[];
  eyebrowEn: string;
  introEn: string;
  operationsEn: string[];
  noteEn: string;
  ctaEn: string;
  status: "draft" | "published";
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ClientReferenceRow = {
  id: number;
  companyName: string;
  logo: string | null;
  workSummary: string;
  workSummaryEn: string;
  website: string;
  showCompanyName: boolean;
  showWorkSummary: boolean;
  status: "draft" | "published";
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export type MarinaPoint = { name: string; lat?: number; lng?: number };

export type RegionRow = {
  id: number;
  regionKey: string;
  name: string;
  nameEn: string;
  intro: string;
  introEn: string;
  marinas: MarinaPoint[];
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
  relationshipEn: string;
  descriptionEn: string;
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
  galleryImages: Array.isArray(row.gallery_images) ? row.gallery_images : [],
  labelEn: row.label_en ?? "",
  titleEn: row.title_en ?? "",
  detailEn: row.detail_en ?? "",
  scopeEn: row.scope_en,
  systemsEn: row.systems_en,
  resultsEn: row.results_en,
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
  categoryEn: row.category_en ?? "",
  titleEn: row.title_en ?? "",
  excerptEn: row.excerpt_en ?? "",
  bodyEn: row.body_en ?? "",
  seoTitleEn: row.seo_title_en,
  seoDescriptionEn: row.seo_description_en,
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
  questionEn: row.question_en ?? "",
  answerEn: row.answer_en ?? "",
  status: row.status,
  sortOrder: row.sort_order,
});

const mapBoatListing = (row: any): BoatListingRow => ({
  id: row.id,
  title: row.title,
  price: row.price,
  year: row.year,
  lengthMeters: row.length_meters,
  engineInfo: row.engine_info,
  location: row.location,
  description: row.description,
  coverImage: row.cover_image,
  galleryImages: Array.isArray(row.gallery_images) ? row.gallery_images : [],
  status: row.status,
  sortOrder: row.sort_order,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const boatListingToRow = (p: Partial<BoatListingRow>) => {
  const row: Record<string, unknown> = {};
  if (p.title !== undefined) row.title = p.title;
  if (p.price !== undefined) row.price = p.price;
  if (p.year !== undefined) row.year = p.year;
  if (p.lengthMeters !== undefined) row.length_meters = p.lengthMeters;
  if (p.engineInfo !== undefined) row.engine_info = p.engineInfo;
  if (p.location !== undefined) row.location = p.location;
  if (p.description !== undefined) row.description = p.description;
  if (p.coverImage !== undefined) row.cover_image = p.coverImage;
  if (p.galleryImages !== undefined) row.gallery_images = p.galleryImages;
  if (p.status !== undefined) row.status = p.status;
  if (p.sortOrder !== undefined) row.sort_order = p.sortOrder;
  return row;
};

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
  titleEn: row.title_en ?? "",
  descriptionEn: row.description_en ?? "",
  subtopicsEn: Array.isArray(row.subtopics_en) ? row.subtopics_en : [],
  eyebrowEn: row.eyebrow_en ?? "",
  introEn: row.intro_en ?? "",
  operationsEn: Array.isArray(row.operations_en) ? row.operations_en : [],
  noteEn: row.note_en ?? "",
  ctaEn: row.cta_en ?? "",
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
  if (p.titleEn !== undefined) row.title_en = p.titleEn;
  if (p.descriptionEn !== undefined) row.description_en = p.descriptionEn;
  if (p.subtopicsEn !== undefined) row.subtopics_en = p.subtopicsEn;
  if (p.eyebrowEn !== undefined) row.eyebrow_en = p.eyebrowEn;
  if (p.introEn !== undefined) row.intro_en = p.introEn;
  if (p.operationsEn !== undefined) row.operations_en = p.operationsEn;
  if (p.noteEn !== undefined) row.note_en = p.noteEn;
  if (p.ctaEn !== undefined) row.cta_en = p.ctaEn;
  if (p.status !== undefined) row.status = p.status;
  if (p.sortOrder !== undefined) row.sort_order = p.sortOrder;
  return row;
};

const mapRegion = (row: any): RegionRow => ({
  id: row.id,
  regionKey: row.region_key,
  name: row.name,
  nameEn: row.name_en ?? "",
  intro: row.intro,
  introEn: row.intro_en ?? "",
  marinas: Array.isArray(row.marinas) ? row.marinas : [],
  status: row.status,
  sortOrder: row.sort_order,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const regionToRow = (p: Partial<RegionRow>) => {
  const row: Record<string, unknown> = {};
  if (p.regionKey !== undefined) row.region_key = p.regionKey;
  if (p.name !== undefined) row.name = p.name;
  if (p.nameEn !== undefined) row.name_en = p.nameEn;
  if (p.intro !== undefined) row.intro = p.intro;
  if (p.introEn !== undefined) row.intro_en = p.introEn;
  if (p.marinas !== undefined) row.marinas = p.marinas;
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
  relationshipEn: row.relationship_en ?? "",
  descriptionEn: row.description_en ?? "",
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
  if (p.relationshipEn !== undefined) row.relationship_en = p.relationshipEn;
  if (p.descriptionEn !== undefined) row.description_en = p.descriptionEn;
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
  if (p.galleryImages !== undefined) row.gallery_images = p.galleryImages;
  if (p.labelEn !== undefined) row.label_en = p.labelEn;
  if (p.titleEn !== undefined) row.title_en = p.titleEn;
  if (p.detailEn !== undefined) row.detail_en = p.detailEn;
  if (p.scopeEn !== undefined) row.scope_en = p.scopeEn;
  if (p.systemsEn !== undefined) row.systems_en = p.systemsEn;
  if (p.resultsEn !== undefined) row.results_en = p.resultsEn;
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
  if (p.categoryEn !== undefined) row.category_en = p.categoryEn;
  if (p.titleEn !== undefined) row.title_en = p.titleEn;
  if (p.excerptEn !== undefined) row.excerpt_en = p.excerptEn;
  if (p.bodyEn !== undefined) row.body_en = p.bodyEn;
  if (p.seoTitleEn !== undefined) row.seo_title_en = p.seoTitleEn;
  if (p.seoDescriptionEn !== undefined) row.seo_description_en = p.seoDescriptionEn;
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

export async function getPublishedBoatListings(): Promise<BoatListingRow[]> {
  const { data, error } = await supabase.from("boat_listings").select("*").eq("status", "published").order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapBoatListing);
}

export async function getListingsEnabled(): Promise<boolean> {
  const { data, error } = await supabase.from("site_settings").select("value").eq("key", "listings_enabled").maybeSingle();
  if (error || !data) return false;
  return data.value === "true";
}

export async function setListingsEnabled(enabled: boolean): Promise<void> {
  const { error } = await supabase.from("site_settings").upsert({ key: "listings_enabled", value: enabled ? "true" : "false" });
  if (error) throw error;
}

export async function getPublishedServices(): Promise<ServiceRow[]> {
  const { data, error } = await supabase.from("services").select("*").eq("status", "published").order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapService);
}

const mapClientReference = (row: any): ClientReferenceRow => ({
  id: row.id,
  companyName: row.company_name,
  logo: row.logo,
  workSummary: row.work_summary,
  workSummaryEn: row.work_summary_en ?? "",
  website: row.website ?? "",
  showCompanyName: row.show_company_name ?? true,
  showWorkSummary: row.show_work_summary ?? true,
  status: row.status,
  sortOrder: row.sort_order,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const clientReferenceToRow = (p: Partial<ClientReferenceRow>) => {
  const row: Record<string, unknown> = {};
  if (p.companyName !== undefined) row.company_name = p.companyName;
  if (p.logo !== undefined) row.logo = p.logo;
  if (p.workSummary !== undefined) row.work_summary = p.workSummary;
  if (p.workSummaryEn !== undefined) row.work_summary_en = p.workSummaryEn;
  if (p.website !== undefined) row.website = p.website;
  if (p.showCompanyName !== undefined) row.show_company_name = p.showCompanyName;
  if (p.showWorkSummary !== undefined) row.show_work_summary = p.showWorkSummary;
  if (p.status !== undefined) row.status = p.status;
  if (p.sortOrder !== undefined) row.sort_order = p.sortOrder;
  return row;
};

export async function getPublishedClientReferences(): Promise<ClientReferenceRow[]> {
  const { data, error } = await supabase.from("client_references").select("*").eq("status", "published").order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapClientReference);
}

export async function getAllClientReferences(): Promise<ClientReferenceRow[]> {
  const { data, error } = await supabase.from("client_references").select("*").order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapClientReference);
}

export async function createClientReference(input: Partial<ClientReferenceRow>): Promise<ClientReferenceRow> {
  const { data, error } = await supabase.from("client_references").insert(clientReferenceToRow(input)).select("*").single();
  if (error) throw error;
  return mapClientReference(data);
}

export async function updateClientReference(id: number, changes: Partial<ClientReferenceRow>): Promise<ClientReferenceRow> {
  const { data, error } = await supabase.from("client_references").update(clientReferenceToRow(changes)).eq("id", id).select("*").single();
  if (error) throw error;
  return mapClientReference(data);
}

export async function deleteClientReference(id: number): Promise<void> {
  const { error } = await supabase.from("client_references").delete().eq("id", id);
  if (error) throw error;
}

export async function getPublishedRegions(): Promise<RegionRow[]> {
  const { data, error } = await supabase.from("regions").select("*").eq("status", "published").order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapRegion);
}

export async function getAllRegions(): Promise<RegionRow[]> {
  const { data, error } = await supabase.from("regions").select("*").order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapRegion);
}

export async function createRegion(input: Partial<RegionRow>): Promise<RegionRow> {
  const { data, error } = await supabase.from("regions").insert(regionToRow(input)).select("*").single();
  if (error) throw error;
  return mapRegion(data);
}

export async function updateRegion(id: number, changes: Partial<RegionRow>): Promise<RegionRow> {
  const { data, error } = await supabase.from("regions").update(regionToRow(changes)).eq("id", id).select("*").single();
  if (error) throw error;
  return mapRegion(data);
}

export async function deleteRegion(id: number): Promise<void> {
  const { error } = await supabase.from("regions").delete().eq("id", id);
  if (error) throw error;
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
  const { data, error } = await supabase.from("faq").insert({ question: input.question, answer: input.answer, question_en: input.questionEn ?? "", answer_en: input.answerEn ?? "", status: input.status ?? "published", sort_order: input.sortOrder ?? 0 }).select("*").single();
  if (error) throw error;
  return mapFaq(data);
}

export async function updateFaq(id: number, changes: Partial<FaqRow>): Promise<FaqRow> {
  const row: Record<string, unknown> = {};
  if (changes.question !== undefined) row.question = changes.question;
  if (changes.answer !== undefined) row.answer = changes.answer;
  if (changes.questionEn !== undefined) row.question_en = changes.questionEn;
  if (changes.answerEn !== undefined) row.answer_en = changes.answerEn;
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

export async function getAllBoatListings(): Promise<BoatListingRow[]> {
  const { data, error } = await supabase.from("boat_listings").select("*").order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapBoatListing);
}

export async function createBoatListing(input: Partial<BoatListingRow>): Promise<BoatListingRow> {
  const { data, error } = await supabase.from("boat_listings").insert(boatListingToRow(input)).select("*").single();
  if (error) throw error;
  return mapBoatListing(data);
}

export async function updateBoatListing(id: number, changes: Partial<BoatListingRow>): Promise<BoatListingRow> {
  const { data, error } = await supabase.from("boat_listings").update(boatListingToRow(changes)).eq("id", id).select("*").single();
  if (error) throw error;
  return mapBoatListing(data);
}

export async function deleteBoatListing(id: number): Promise<void> {
  const { error } = await supabase.from("boat_listings").delete().eq("id", id);
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

export async function uploadImage(bucket: "projects" | "knowledge" | "site" | "services" | "partners" | "listings" | "references", file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "bin";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, { contentType: file.type, cacheControl: "31536000" });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

// ---- Localization helpers ----
// Falls back to the Turkish value whenever the English field hasn't been filled in yet,
// so English pages never show blank content while translations are still in progress.

const pick = (tr: string, en: string) => (en && en.trim() ? en : tr);
const pickNullable = (tr: string | null, en: string | null | undefined) => (en && en.trim() ? en : tr);
const pickList = (tr: string[], en: string[]) => (en && en.length > 0 ? en : tr);

export function localizeService(row: ServiceRow, lang: "tr" | "en"): ServiceRow {
  if (lang === "tr") return row;
  return {
    ...row,
    title: pick(row.title, row.titleEn),
    description: pick(row.description, row.descriptionEn),
    subtopics: pickList(row.subtopics, row.subtopicsEn),
    eyebrow: pick(row.eyebrow, row.eyebrowEn),
    intro: pick(row.intro, row.introEn),
    operations: pickList(row.operations, row.operationsEn),
    note: pick(row.note, row.noteEn),
    cta: pick(row.cta, row.ctaEn),
  };
}

export function localizeProject(row: ProjectRow, lang: "tr" | "en"): ProjectRow {
  if (lang === "tr") return row;
  return {
    ...row,
    label: pick(row.label, row.labelEn),
    title: pick(row.title, row.titleEn),
    detail: pick(row.detail, row.detailEn),
    scope: pickNullable(row.scope, row.scopeEn),
    systems: pickNullable(row.systems, row.systemsEn),
    results: pickNullable(row.results, row.resultsEn),
  };
}

export function localizeKnowledge(row: KnowledgePostRow, lang: "tr" | "en"): KnowledgePostRow {
  if (lang === "tr") return row;
  return {
    ...row,
    category: pick(row.category, row.categoryEn),
    title: pick(row.title, row.titleEn),
    excerpt: pick(row.excerpt, row.excerptEn),
    body: pick(row.body, row.bodyEn),
    seoTitle: pickNullable(row.seoTitle, row.seoTitleEn),
    seoDescription: pickNullable(row.seoDescription, row.seoDescriptionEn),
  };
}

export function localizeFaq(row: FaqRow, lang: "tr" | "en"): FaqRow {
  if (lang === "tr") return row;
  return {
    ...row,
    question: pick(row.question, row.questionEn),
    answer: pick(row.answer, row.answerEn),
  };
}

export function localizeClientReference(row: ClientReferenceRow, lang: "tr" | "en"): ClientReferenceRow {
  if (lang === "tr") return row;
  return {
    ...row,
    workSummary: pick(row.workSummary, row.workSummaryEn),
  };
}

export function localizeRegion(row: RegionRow, lang: "tr" | "en"): RegionRow {
  if (lang === "tr") return row;
  return {
    ...row,
    name: pick(row.name, row.nameEn),
    intro: pick(row.intro, row.introEn),
  };
}

export function localizePartner(row: PartnerRow, lang: "tr" | "en"): PartnerRow {
  if (lang === "tr") return row;
  return {
    ...row,
    relationship: pick(row.relationship, row.relationshipEn),
    description: pick(row.description, row.descriptionEn),
  };
}
