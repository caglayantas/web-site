const knowledgeCoverImages = [
  { match: /mekanik|pompa|vana|hortum/i, image: "/manus-storage/perla-service-mechanical_1537487f.webp" },
  { match: /elektrik|lityum|akü|bms|enerji/i, image: "/manus-storage/perla-service-electrical_bfa1b249_34b9f24d.webp" },
  { match: /motor|tahrik|şaft|pervane|dümen/i, image: "/manus-storage/perla-service-propulsion_1dad9846.webp" },
  { match: /kompozit|kalıp|model/i, image: "/manus-storage/perla-composite-vacuum-infusion_c6928b76.jpg" },
  { match: /elektronik|navigasyon|radar|ais/i, image: "/manus-storage/perla-service-marine-electronics_a9f3a57f_2b833740.webp" },
];

export function getKnowledgeCoverImage(category: string, title: string) {
  const searchable = `${category} ${title}`;
  return knowledgeCoverImages.find(({ match }) => match.test(searchable))?.image ?? "/manus-storage/perla-service-marine-electronics_a9f3a57f_2b833740.webp";
}
