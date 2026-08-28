import { describe, expect, it } from "vitest";
import { isProjectPublishable } from "./db";

describe("project publication quality", () => {
  const validProject = {
    slug: "motor-tahrik-bakimi",
    label: "Motor ve tahrik",
    title: "Şaft ve pervane sistemi",
    detail: "Motor, şaft, kaplin ve pervane hattında bakım önceliklerini görünür kılan teknik değerlendirme.",
    beforeImage: "/manus-storage/before.jpg",
    afterImage: "/manus-storage/after.jpg",
  };

  it("accepts a meaningful project with valid media", () => {
    expect(isProjectPublishable(validProject)).toBe(true);
  });

  it("rejects placeholder or gibberish content", () => {
    expect(isProjectPublishable({ ...validProject, slug: "bvnmvnvngngchngvjh", title: "bvnmvnvngngchngvjh" })).toBe(false);
    expect(isProjectPublishable({ ...validProject, detail: "asdasdnjjhjhjhjh" })).toBe(false);
  });

  it("rejects incomplete content or missing comparison media", () => {
    expect(isProjectPublishable({ ...validProject, detail: "Kısa" })).toBe(false);
    expect(isProjectPublishable({ ...validProject, afterImage: "" })).toBe(false);
  });
});
