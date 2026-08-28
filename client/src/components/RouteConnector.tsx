/**
 * Perla Marine / Sessiz Kuvvet: Bölümler arasındaki teknik seyir hattı; sayfa akışını
 * konu etiketi ve ince rota çizgisi ile görünür kılan ortak geçiş elemanı.
 */
type RouteConnectorProps = {
  label: string;
  align?: "left" | "right";
};

export default function RouteConnector({ label, align = "right" }: RouteConnectorProps) {
  return (
    <div className={`route-connector route-connector--${align}`} aria-hidden="true">
      <div className="route-connector__inner">
        <i />
        <b>{label}</b>
      </div>
    </div>
  );
}
