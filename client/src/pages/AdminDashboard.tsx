import DashboardLayout from "@/components/DashboardLayout";
import { getDashboardStats, getRecentContactMessages, type DashboardStats, type ContactMessageRow } from "@/lib/content";
import { Mail, MessageSquare, TrendingDown, TrendingUp, Minus, Wrench, MapPin, BookOpen, HelpCircle, Award } from "lucide-react";
import { useEffect, useState } from "react";

function trendLabel(current: number, previous: number) {
  if (previous === 0 && current === 0) return { icon: Minus, text: "Değişim yok", tone: "neutral" as const };
  if (previous === 0) return { icon: TrendingUp, text: "Yeni", tone: "up" as const };
  const diff = Math.round(((current - previous) / previous) * 100);
  if (diff > 0) return { icon: TrendingUp, text: `%${diff} artış`, tone: "up" as const };
  if (diff < 0) return { icon: TrendingDown, text: `%${Math.abs(diff)} azalış`, tone: "down" as const };
  return { icon: Minus, text: "Değişim yok", tone: "neutral" as const };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [messages, setMessages] = useState<ContactMessageRow[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([getDashboardStats(), getRecentContactMessages(6)])
      .then(([statsResult, messagesResult]) => { setStats(statsResult); setMessages(messagesResult); })
      .catch(() => setError(true));
  }, []);

  const trend = stats ? trendLabel(stats.messagesThisMonth, stats.messagesLastMonth) : null;
  const TrendIcon = trend?.icon ?? Minus;

  return (
    <DashboardLayout>
      <div className="admin-projects-page">
        <header className="admin-page-header">
          <div><p className="eyebrow">Perla Marine · Yönetim</p><h1>Genel Bakış</h1><p>Site trafiğinin ve gelen taleplerin kısa özeti.</p></div>
        </header>

        {error && <p className="admin-form-error" role="alert">İstatistikler yüklenemedi.</p>}

        {!stats || !messages ? (
          <p className="admin-empty">Yükleniyor…</p>
        ) : (
          <>
            <div className="admin-dashboard-grid">
              <div className="admin-dashboard-card">
                <div className="admin-dashboard-card__icon"><Mail size={20} /></div>
                <span className="admin-dashboard-card__label">Toplam mesaj</span>
                <strong className="admin-dashboard-card__value">{stats.totalMessages}</strong>
              </div>
              <div className="admin-dashboard-card">
                <div className="admin-dashboard-card__icon"><MessageSquare size={20} /></div>
                <span className="admin-dashboard-card__label">Bu ay gelen</span>
                <strong className="admin-dashboard-card__value">{stats.messagesThisMonth}</strong>
                {trend && <span className={`admin-dashboard-card__trend admin-dashboard-card__trend--${trend.tone}`}><TrendIcon size={13} /> {trend.text}</span>}
              </div>
              <div className="admin-dashboard-card">
                <div className="admin-dashboard-card__icon"><Wrench size={20} /></div>
                <span className="admin-dashboard-card__label">En çok talep edilen hizmet</span>
                <strong className="admin-dashboard-card__value admin-dashboard-card__value--text">{stats.topService?.name ?? "—"}</strong>
                {stats.topService && <span className="admin-dashboard-card__trend">{stats.topService.count} talep</span>}
              </div>
              <div className="admin-dashboard-card">
                <div className="admin-dashboard-card__icon"><MapPin size={20} /></div>
                <span className="admin-dashboard-card__label">En çok talep edilen bölge</span>
                <strong className="admin-dashboard-card__value admin-dashboard-card__value--text">{stats.topRegion?.name ?? "—"}</strong>
                {stats.topRegion && <span className="admin-dashboard-card__trend">{stats.topRegion.count} talep</span>}
              </div>
            </div>

            <section className="admin-project-list" aria-label="Yayındaki içerik özeti">
              <div className="admin-project-list__header"><h2>Yayındaki içerik</h2></div>
              <div className="admin-dashboard-content-summary">
                <div><Wrench size={16} /><span>{stats.publishedCounts.services} hizmet</span></div>
                <div><BookOpen size={16} /><span>{stats.publishedCounts.knowledgePosts} teknik yazı</span></div>
                <div><HelpCircle size={16} /><span>{stats.publishedCounts.faq} SSS</span></div>
                <div><Award size={16} /><span>{stats.publishedCounts.references} referans</span></div>
                <div><MapPin size={16} /><span>{stats.publishedCounts.regions} hizmet bölgesi</span></div>
                <div><Wrench size={16} /><span>{stats.publishedCounts.projects} proje</span></div>
              </div>
            </section>

            <section className="admin-project-list" aria-label="Son gelen mesajlar">
              <div className="admin-project-list__header"><h2>Son gelen mesajlar</h2><span>{messages.length} mesaj</span></div>
              {messages.length === 0 ? (
                <p className="admin-empty">Henüz mesaj yok.</p>
              ) : messages.map((message) => (
                <article className="admin-project-row" key={message.id}>
                  <div className="admin-knowledge-row__icon"><Mail size={24} /></div>
                  <div className="admin-project-row__copy">
                    <div className="admin-project-row__meta"><small>{formatDate(message.createdAt)}</small></div>
                    <h3>{message.name || "İsimsiz"} {message.service && <span style={{ fontWeight: 400, color: "#8a95a3" }}>· {message.service}</span>}</h3>
                    <p>{message.message}</p>
                    <small>{message.email}{message.phone ? ` · ${message.phone}` : ""}{message.region ? ` · ${message.region}` : ""}</small>
                  </div>
                </article>
              ))}
            </section>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
