/**
 * Perla Marine: tekne ve yat bakım-onarım hizmetlerini, konuya özgü alt başlıklarla
 * anlaşılır ve taranabilir kartlar halinde sunar. İçerik /yonetim/hizmetler panelinden
 * yönetilen Supabase "services" tablosundan gelir.
 */
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getPublishedServices, localizeService, type ServiceRow } from "@/lib/content";
import { useLanguage } from "@/lib/i18n";
import {
  Anchor, ArrowUpRight, BatteryCharging, Check, ClipboardCheck, Droplets, Factory,
  Radio, Sailboat, Settings2, Thermometer, Wrench, Wind, Zap, Shield, Compass,
  Ship, LifeBuoy, Cog, Gauge, Fuel, type LucideIcon,
} from "lucide-react";

export const ICON_OPTIONS: Record<string, LucideIcon> = {
  Anchor, BatteryCharging, ClipboardCheck, Droplets, Factory, Radio, Sailboat,
  Settings2, Thermometer, Wrench, Wind, Zap, Shield, Compass, Ship, LifeBuoy,
  Cog, Gauge, Fuel,
};

function resolveIcon(name: string): LucideIcon {
  return ICON_OPTIONS[name] ?? Wrench;
}

const SERVICE_CONTACT_CATEGORY: Record<string, string> = {
  "kompozit-cozumler": "Kompozit çözümler",
  "marin-elektrik": "Marin elektrik",
  "marin-elektronigi": "Marin elektroniği",
  "isitma-sogutma": "Isıtma-soğutma",
  "mekanik-tesisat": "Mekanik tesisat",
  "motor-tahrik-dumen": "Motor, tahrik ve dümen",
  "yelken-arma": "Yelken ve arma donanım",
  "guverte-ekipmanlari": "Güverte ekipmanları",
  "uretim-danismanligi": "Üretim danışmanlığı",
  "tekneye-ozel-cozumler": "Tekneye özel çözümler",
};

type ServiceGridProps = { expanded?: boolean };

export default function ServiceGrid({ expanded = false }: ServiceGridProps) {
  const { lang, toPath } = useLanguage();
  const [services, setServices] = useState<ServiceRow[] | null>(null);
  useEffect(() => {
    let mounted = true;
    getPublishedServices().then((data) => { if (mounted) setServices(data); }).catch(() => { if (mounted) setServices([]); });
    return () => { mounted = false; };
  }, []);

  const items = services ? (expanded ? services : services.slice(0, 4)).map((service) => localizeService(service, lang)) : [];
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);
  const activeService = activeServiceId ? items.find((item) => item.slug === activeServiceId) ?? services?.find((item) => item.slug === activeServiceId) : undefined;

  const openService = (slug: string) => setActiveServiceId(slug);

  if (services === null) {
    return (
      <div className={`service-grid ${expanded ? "service-grid--expanded" : ""}`}>
        {[0, 1, 2, 3].map((index) => <div className="home-content-skeleton" key={`service-skeleton-${index}`} aria-hidden="true" />)}
      </div>
    );
  }

  if (services.length === 0) {
    return <p className="home-content-empty">{lang === "en" ? "No published services yet." : "Henüz yayınlanmış hizmet bulunmuyor."}</p>;
  }

  return (
    <>
      <div className={`service-grid ${expanded ? "service-grid--expanded" : ""}`}>
        {items.map((item) => {
          const Icon = resolveIcon(item.icon);
          return (
            <a className="service-card service-card--interactive" href={toPath(`/hizmetler/${item.slug}`)} id={item.slug} key={item.slug} onClick={(event) => { event.preventDefault(); openService(item.slug); }} aria-haspopup="dialog" aria-expanded={activeServiceId === item.slug}>
              <div className="service-card__media">{item.image && <img className="service-card__image" src={item.image} alt={`${item.title} ${lang === "en" ? "maintenance and application service" : "bakım ve uygulama hizmeti"}`} width={960} height={640} loading="lazy" decoding="async" />}<span className="service-card__view">{lang === "en" ? "View details" : "Detayları incele"} <ArrowUpRight size={14} aria-hidden="true" /></span></div>
              <div className="service-card__body"><div className="service-card__topline"><span className="service-card__signal"><Icon size={20} strokeWidth={1.55} aria-hidden="true" /></span><span className="service-card__rule" aria-hidden="true" /></div><h3>{item.title}</h3><p>{item.description}</p><ul className="service-card__subtopics">{item.subtopics.map((subtopic) => <li key={subtopic}>{subtopic}</li>)}</ul></div>
            </a>
          );
        })}
      </div>

      <Dialog open={Boolean(activeService)} onOpenChange={(open) => { if (!open) setActiveServiceId(null); }}>
        <DialogContent className="service-modal__content">
          <div className="service-modal__scroll">
            {activeService && <>
              <DialogHeader><p className="eyebrow">{activeService.eyebrow}</p><DialogTitle>{activeService.title}</DialogTitle><DialogDescription className="service-modal__intro">{activeService.intro}</DialogDescription></DialogHeader>
              <div className="service-modal__columns"><div><p className="service-modal__label">{lang === "en" ? "Maintenance scope" : "Bakım kapsamı"}</p><ul className="check-list check-list--dark">{activeService.operations.map((operation) => <li key={operation}><Check size={16} aria-hidden="true" /><span>{operation}</span></li>)}</ul></div><div className="service-modal__note"><Wrench size={20} aria-hidden="true" /><p><strong>{lang === "en" ? "The Perla Marine approach" : "Perla Marine yaklaşımı"}</strong><br />{activeService.note}</p></div></div>
              <a className="button button--navy" href={`${toPath("/iletisim")}?kategori=${encodeURIComponent(SERVICE_CONTACT_CATEGORY[activeService.slug] ?? activeService.title)}`}>{activeService.cta} <ArrowUpRight size={17} /></a>
              <a className="text-link text-link--dark" href={toPath(`/hizmetler/${activeService.slug}`)} style={{ marginTop: 12 }}>{lang === "en" ? "Open full page" : "Detaylı sayfayı aç"} <ArrowUpRight size={14} /></a>
            </>}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
