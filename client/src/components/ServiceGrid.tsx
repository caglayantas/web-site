/**
 * Perla Marine: tekne ve yat bakım-onarım hizmetlerini, konuya özgü alt başlıklarla
 * anlaşılır ve taranabilir kartlar halinde sunar. İçerik /yonetim/hizmetler panelinden
 * yönetilen Supabase "services" tablosundan gelir.
 */
import { useEffect, useState, type KeyboardEvent } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getPublishedServices, type ServiceRow } from "@/lib/content";
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

type ServiceGridProps = { expanded?: boolean };

export default function ServiceGrid({ expanded = false }: ServiceGridProps) {
  const [services, setServices] = useState<ServiceRow[] | null>(null);
  useEffect(() => {
    let mounted = true;
    getPublishedServices().then((data) => { if (mounted) setServices(data); }).catch(() => { if (mounted) setServices([]); });
    return () => { mounted = false; };
  }, []);

  const items = services ? (expanded ? services : services.slice(0, 4)) : [];
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);
  const activeService = activeServiceId ? items.find((item) => item.slug === activeServiceId) ?? services?.find((item) => item.slug === activeServiceId) : undefined;

  const openService = (slug: string) => setActiveServiceId(slug);
  const handleCardKeyDown = (event: KeyboardEvent<HTMLElement>, slug: string) => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openService(slug); }
  };

  if (services === null) {
    return (
      <div className={`service-grid ${expanded ? "service-grid--expanded" : ""}`}>
        {[0, 1, 2, 3].map((index) => <div className="home-content-skeleton" key={`service-skeleton-${index}`} aria-hidden="true" />)}
      </div>
    );
  }

  if (services.length === 0) {
    return <p className="home-content-empty">Henüz yayınlanmış hizmet bulunmuyor.</p>;
  }

  return (
    <>
      <div className={`service-grid ${expanded ? "service-grid--expanded" : ""}`}>
        {items.map((item) => {
          const Icon = resolveIcon(item.icon);
          return (
            <article className="service-card service-card--interactive" id={item.slug} key={item.slug} onClick={() => openService(item.slug)} onKeyDown={(event) => handleCardKeyDown(event, item.slug)} role="button" tabIndex={0} aria-haspopup="dialog" aria-expanded={activeServiceId === item.slug}>
              <div className="service-card__media">{item.image && <img className="service-card__image" src={item.image} alt={`${item.title} bakım ve uygulama hizmeti`} width={960} height={640} loading="lazy" decoding="async" />}<span className="service-card__view">Detayları incele <ArrowUpRight size={14} aria-hidden="true" /></span></div>
              <div className="service-card__body"><div className="service-card__topline"><span className="service-card__signal"><Icon size={20} strokeWidth={1.55} aria-hidden="true" /></span><span className="service-card__rule" aria-hidden="true" /></div><h3>{item.title}</h3><p>{item.description}</p><ul className="service-card__subtopics">{item.subtopics.map((subtopic) => <li key={subtopic}>{subtopic}</li>)}</ul></div>
            </article>
          );
        })}
      </div>

      <Dialog open={Boolean(activeService)} onOpenChange={(open) => { if (!open) setActiveServiceId(null); }}>
        <DialogContent className="service-modal__content">
          <div className="service-modal__scroll">
            {activeService && <>
              <DialogHeader><p className="eyebrow">{activeService.eyebrow}</p><DialogTitle>{activeService.title}</DialogTitle><DialogDescription className="service-modal__intro">{activeService.intro}</DialogDescription></DialogHeader>
              <div className="service-modal__columns"><div><p className="service-modal__label">Bakım kapsamı</p><ul className="check-list check-list--dark">{activeService.operations.map((operation) => <li key={operation}><Check size={16} aria-hidden="true" /><span>{operation}</span></li>)}</ul></div><div className="service-modal__note"><Wrench size={20} aria-hidden="true" /><p><strong>Perla Marine yaklaşımı</strong><br />{activeService.note}</p></div></div>
              <a className="button button--navy" href="/iletisim">{activeService.cta} <ArrowUpRight size={17} /></a>
            </>}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
