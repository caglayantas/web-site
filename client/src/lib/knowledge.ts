const knowledgeCoverImages = [
  { match: /mekanik|pompa|vana|hortum/i, image: "/manus-storage/perla-service-mechanical_1537487f.jpg" },
  { match: /elektrik|lityum|akü|bms|enerji/i, image: "/manus-storage/perla-service-electrical_bfa1b249.jpg" },
  { match: /motor|tahrik|şaft|pervane|dümen/i, image: "/manus-storage/perla-service-propulsion_1dad9846.jpg" },
  { match: /kompozit|kalıp|model/i, image: "/manus-storage/perla-composite-vacuum-infusion_c6928b76.jpg" },
  { match: /elektronik|navigasyon|radar|ais/i, image: "/manus-storage/perla-service-marine-electronics_a9f3a57f.jpg" },
];

export function getKnowledgeCoverImage(category: string, title: string) {
  const searchable = `${category} ${title}`;
  return knowledgeCoverImages.find(({ match }) => match.test(searchable))?.image ?? "/manus-storage/perla-service-marine-electronics_a9f3a57f.jpg";
}
