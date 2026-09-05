import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { enrollTotp, verifyTotpEnrollment, listTotpFactors, unenrollTotp } from "@/lib/auth";
import { ShieldCheck, ShieldOff, KeyRound } from "lucide-react";
import { useEffect, useState } from "react";

type EnrollmentState = { factorId: string; qrCode: string; secret: string } | null;

export default function AdminSecurity() {
  const [existingFactorId, setExistingFactorId] = useState<string | null | undefined>(undefined);
  const [enrollment, setEnrollment] = useState<EnrollmentState>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [success, setSuccess] = useState("");

  const refresh = () => {
    listTotpFactors()
      .then((factors) => setExistingFactorId(factors[0]?.id ?? null))
      .catch(() => setExistingFactorId(null));
  };

  useEffect(() => { refresh(); }, []);

  const startEnrollment = async () => {
    setError("");
    setIsBusy(true);
    try {
      const result = await enrollTotp();
      setEnrollment(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kurulum başlatılamadı.");
    } finally {
      setIsBusy(false);
    }
  };

  const confirmEnrollment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!enrollment) return;
    setError("");
    setIsBusy(true);
    try {
      await verifyTotpEnrollment(enrollment.factorId, code.trim());
      setEnrollment(null);
      setCode("");
      setSuccess("İki adımlı doğrulama etkinleştirildi. Bir sonraki girişte kod istenecek.");
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kod doğrulanamadı, tekrar deneyin.");
    } finally {
      setIsBusy(false);
    }
  };

  const disable2fa = async () => {
    if (!existingFactorId) return;
    if (!window.confirm("İki adımlı doğrulamayı kapatmak istediğinize emin misiniz? Hesabınız yalnızca şifreyle korunacak.")) return;
    setIsBusy(true);
    setError("");
    try {
      await unenrollTotp(existingFactorId);
      setSuccess("İki adımlı doğrulama kapatıldı.");
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kapatılamadı, tekrar deneyin.");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="admin-projects-page">
        <header className="admin-page-header">
          <div><p className="eyebrow">Perla Marine · Yönetim</p><h1>Güvenlik</h1><p>Panel hesabınız için iki adımlı doğrulamayı (2FA) yönetin.</p></div>
        </header>

        {success && <p className="admin-form-success" role="status">{success}</p>}

        {existingFactorId === undefined ? (
          <p className="admin-empty">Durum kontrol ediliyor…</p>
        ) : enrollment ? (
          <section className="admin-project-form">
            <div className="admin-project-form__header">
              <div><p className="eyebrow">Kurulum · 1/2</p><h2>QR kodu taratın</h2></div>
            </div>
            <p style={{ marginBottom: 16, color: "#55677c" }}>
              Google Authenticator, Microsoft Authenticator veya Authy gibi bir kimlik doğrulama uygulamasıyla aşağıdaki kodu okutun. Uygulamanız yoksa önce telefonunuza birini indirin.
            </p>
            <img src={enrollment.qrCode} alt="2FA QR kodu" style={{ width: 220, height: 220, background: "#fff", padding: 12, border: "1px solid #e4ded4" }} />
            <p style={{ marginTop: 12, fontSize: 12, color: "#8a95a3" }}>QR kodu okutamıyorsanız bu anahtarı elle girebilirsiniz: <code>{enrollment.secret}</code></p>
            <form onSubmit={confirmEnrollment} className="admin-project-form__grid" style={{ marginTop: 24 }}>
              <label className="admin-project-form__full">
                Uygulamada görünen 6 haneli kod
                <Input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  value={code}
                  onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                />
              </label>
              {error && <p className="admin-form-error admin-project-form__full" role="alert">{error}</p>}
              <div className="admin-project-form__actions admin-project-form__full">
                <Button type="button" variant="outline" onClick={() => { setEnrollment(null); setCode(""); }}>Vazgeç</Button>
                <Button type="submit" disabled={isBusy || code.length !== 6}>{isBusy ? "Doğrulanıyor…" : "Etkinleştir"}</Button>
              </div>
            </form>
          </section>
        ) : (
          <section className="admin-project-row" style={{ alignItems: "flex-start" }}>
            <div className="admin-knowledge-row__icon">{existingFactorId ? <ShieldCheck size={28} /> : <ShieldOff size={28} />}</div>
            <div className="admin-project-row__copy">
              <h3>{existingFactorId ? "İki adımlı doğrulama açık" : "İki adımlı doğrulama kapalı"}</h3>
              <p>
                {existingFactorId
                  ? "Panele girişte şifrenizin yanında kimlik doğrulama uygulamanızdaki 6 haneli kod da isteniyor."
                  : "Şu an panele yalnızca e-posta ve şifreyle giriş yapılabiliyor. Etkinleştirerek hesabınıza ek bir güvenlik katmanı ekleyebilirsiniz."}
              </p>
              {error && <p className="admin-form-error" role="alert">{error}</p>}
            </div>
            <div className="admin-project-row__actions">
              {existingFactorId ? (
                <Button variant="ghost" className="admin-delete-button" onClick={disable2fa} disabled={isBusy}><ShieldOff size={15} /> Kapat</Button>
              ) : (
                <Button onClick={startEnrollment} disabled={isBusy}><KeyRound size={15} /> {isBusy ? "Başlatılıyor…" : "Etkinleştir"}</Button>
              )}
            </div>
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}
