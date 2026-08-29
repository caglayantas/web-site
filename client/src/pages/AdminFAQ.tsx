import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createFaq, updateFaq, deleteFaq, getAllFaqs, type FaqRow } from "@/lib/content";
import { Check, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

type FaqForm = { id?: number; question: string; answer: string; status: "draft" | "published"; sortOrder: number };
const emptyForm: FaqForm = { question: "", answer: "", status: "published", sortOrder: 0 };

export default function AdminFAQ() {
  const [faqList, setFaqList] = useState<FaqRow[] | null>(null);
  const [listError, setListError] = useState(false);
  const refresh = () => { getAllFaqs().then((data) => { setFaqList(data); setListError(false); }).catch(() => setListError(true)); };
  useEffect(() => { refresh(); }, []);
  const [form, setForm] = useState<FaqForm | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form) return;
    setIsSaving(true);
    setSaveError(false);
    try {
      if (form.id !== undefined) await updateFaq(form.id, { question: form.question, answer: form.answer, status: form.status, sortOrder: form.sortOrder });
      else await createFaq({ question: form.question, answer: form.answer, status: form.status, sortOrder: form.sortOrder });
      setForm(null);
      refresh();
    } catch {
      setSaveError(true);
    } finally {
      setIsSaving(false);
    }
  };
  const handleRemove = (id: number) => { if (window.confirm("Bu soruyu kaldırmak istediğinize emin misiniz?")) deleteFaq(id).then(refresh); };

  return <DashboardLayout><div className="admin-projects-page"><header className="admin-page-header"><div><p className="eyebrow">Perla Marine · Yönetim</p><h1>Sık Sorulan Sorular</h1><p>Ana sayfada ve SSS sayfasında gösterilecek soruları, cevapları ve yayın sırasını yönetin.</p></div><Button onClick={() => setForm(emptyForm)}><Plus size={17} /> Yeni soru</Button></header>{form && <form className="admin-project-form" onSubmit={save}><div className="admin-project-form__header"><div><p className="eyebrow">SSS içeriği</p><h2>{form.id ? "Soruyu düzenle" : "Yeni soru ekle"}</h2></div><button type="button" className="admin-icon-button" onClick={() => setForm(null)} aria-label="Formu kapat"><X size={18} /></button></div><div className="admin-project-form__grid"><label className="admin-project-form__full">Soru<Input required minLength={10} maxLength={320} value={form.question} onChange={(event) => setForm({ ...form, question: event.target.value })} /></label><label className="admin-project-form__full">Cevap<Textarea required minLength={20} maxLength={4000} rows={5} value={form.answer} onChange={(event) => setForm({ ...form, answer: event.target.value })} /></label><label>Durum<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as FaqForm["status"] })}><option value="published">Yayında</option><option value="draft">Taslak</option></select></label><label>Sıra<Input type="number" min={0} value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) })} /></label></div>{saveError && <p className="admin-form-error" role="alert">SSS kaydedilemedi. Alanları kontrol edip tekrar deneyin.</p>}<div className="admin-project-form__actions"><Button type="button" variant="outline" onClick={() => setForm(null)}>Vazgeç</Button><Button type="submit" disabled={isSaving}><Save size={16} /> {isSaving ? "Kaydediliyor…" : "Kaydet"}</Button></div></form>}<section className="admin-project-list" aria-label="SSS listesi"><div className="admin-project-list__header"><h2>Tüm sorular</h2><span>{faqList?.length ?? 0} kayıt</span></div>{faqList === null && !listError ? <p className="admin-empty">Sorular yükleniyor…</p> : listError ? <p className="admin-form-error" role="alert">SSS listesi yüklenemedi.</p> : faqList?.length ? faqList.map((faq) => <article className="admin-project-row" key={faq.id}><div className="admin-project-row__copy"><div className="admin-project-row__meta"><span>Sıra {faq.sortOrder}</span><strong className={`admin-status admin-status--${faq.status}`}>{faq.status === "published" ? <><Check size={13} /> Yayında</> : "Taslak"}</strong></div><h3>{faq.question}</h3><p>{faq.answer}</p></div><div className="admin-project-row__actions"><Button variant="outline" size="sm" onClick={() => setForm(faq)}><Pencil size={15} /> Düzenle</Button><Button variant="ghost" size="sm" className="admin-delete-button" onClick={() => handleRemove(faq.id)}><Trash2 size={15} /> Sil</Button></div></article>) : <div className="admin-empty"><p>Henüz SSS içeriği yok.</p><Button onClick={() => setForm(emptyForm)}><Plus size={16} /> İlk soruyu ekle</Button></div>}</section></div></DashboardLayout>;
}
